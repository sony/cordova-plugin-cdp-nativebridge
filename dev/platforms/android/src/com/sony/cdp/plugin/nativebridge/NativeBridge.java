package com.sony.cdp.plugin.nativebridge;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.apache.cordova.CallbackContext;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;


/**
 * @class NatvieBridge
 * @brief Base Bridge クラス
 */
public class NativeBridge {
	private static final String TAG = "[CDP.Plugin][Native][NativeBridge] ";

	private CallbackContext mCurrentCallbackContext = null;

	///////////////////////////////////////////////////////////////////////
	// public methods

	/**
	 * メソッド呼び出し
	 * BridgeManager からコールされる
	 */
	public boolean invoke(CallbackContext callbackContext, String taskId, String methodName, JSONObject argsInfo) {
		synchronized(this) {

			try {
				Class<?> cls = this.getClass();
				int length = argsInfo.length();
				Class<?>[] argTypes = new Class[length];
				Object[] argValues = new Object[length];
				for (int i = 0; i < length; i++) {
					Object arg = argsInfo.get(String.valueOf(i));
					argTypes[i] = changeType(arg.getClass());
					argValues[i] = arg;
				}
				Method method = cls.getMethod(methodName, argTypes);
				method.invoke(this, argValues);

	        } catch (JSONException e) {
	            Log.e(TAG, "Invalid JSON object", e);
	        } catch (NoSuchMethodException e) {
	            Log.d(TAG, "method not found", e);
			} catch (IllegalAccessException e) {
	            Log.e(TAG, "Illegal Access", e);
			} catch (IllegalArgumentException e) {
	            Log.e(TAG, "Invalid Arg", e);
			} catch (InvocationTargetException e) {
	            Log.e(TAG, "Invocation Target Exception", e);
			}
		}
		return false;
	}

	///////////////////////////////////////////////////////////////////////
	// protected methods

	/**
	 * CallbackContext の取得
	 * 別スレッド処理や、keepCallback を設定するときに取得する。
	 */
	protected CallbackContext getCallbackContext() {
		return mCurrentCallbackContext;
	}

	///////////////////////////////////////////////////////////////////////
	// private methods

	//! 型変換
	private Class<?> changeType(Class<?> src) {
		String type = src.getName();
		if (type.equals("java.lang.Integer")) {
			return int.class;
		} else if (type.equals("java.lang.Boolean")) {
			return boolean.class;
		} else {
			return src;
		}
	}

}

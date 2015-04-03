package com.sony.cdp.plugin.nativebridge;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import android.util.Log;


/**
 * @class NatvieBridge
 * @brief Base Bridge クラス
 */
public class NativeBridge {
    private static final String TAG = "[com.sony.cdp.plugin.nativebridge][Native][NativeBridge] ";

    public class Cookie {
        public final CallbackContext callbackContext;
        public final String          taskId;
        public final String          threadId = Thread.currentThread().getName();
        public        boolean        needSendResult = true;
        Cookie(CallbackContext ctx, String id) {
            callbackContext = ctx;
            taskId = id;
        }
    }

    private Cookie mCurrentCookie = null;

    ///////////////////////////////////////////////////////////////////////
    // public methods

    /**
     * Cordova 互換ハンドラ
     * BridgeManager からコールされる。
     * compatible オプションが有効な場合、このメソッドがコールされる。
     * クライアントは本メソッドをオーバーライド可能
     *
     * @param action          The action to execute.
     * @param args            The exec() arguments.
     * @param callbackContext The callback context used when calling back into JavaScript.
     * @return                Whether the action was valid.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        Log.w(TAG, "execute() method should be override from sub class.");
        return false;
    }

    /**
     * メソッド呼び出し
     * BridgeManager からコールされる
     */
    public boolean invoke(CallbackContext callbackContext, String taskId, String methodName, JSONArray argsInfo) {
        synchronized (this) {
            try {
                Class<?> cls = this.getClass();
                int length = argsInfo.length();
                Class<?>[] argTypes = new Class[length];
                Object[] argValues = new Object[length];
                for (int i = 0; i < length; i++) {
                    Object arg = argsInfo.get(i);
                    argTypes[i] = normalizeType(arg.getClass());
                    argValues[i] = arg;
                }
                Method method = cls.getMethod(methodName, argTypes);

                mCurrentCookie = new Cookie(callbackContext, taskId);
                method.invoke(this, argValues);
                if (mCurrentCookie.needSendResult) {
                    MessageUtils.sendSuccessResult(callbackContext, taskId);
                }
                return true;

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
            } finally {
                mCurrentCookie = null;
            }
        }
        return false;
    }

    ///////////////////////////////////////////////////////////////////////
    // protected methods

    /**
     * Cookie の取得
     * method 呼び出されたスレッドからのみ Cookie 取得が可能
     *
     * @return Cooke オブジェクト
     */
    protected Cookie getCookie() {
        synchronized (this) {
            if (null != mCurrentCookie && Thread.currentThread().getName().equals(mCurrentCookie.threadId)) {
                mCurrentCookie.needSendResult = false;
                return mCurrentCookie;
            } else {
                Log.e(TAG, "Calling getCookie() is permitted only from method entry thread.");
                return null;
            }
        }
    }

    /**
     * 結果を JavaScript へ返却
     * 関数の return ステートメント同等のセマンティックスを持つ
     * method 呼び出されたスレッドからのみコール可能
     * keepCallback は false が指定される。
     *
     * @param value [in] Native から JavaScript へ返す値を指定
     */
    protected void returnParames(Object param) {
        if (null != mCurrentCookie && Thread.currentThread().getName().equals(mCurrentCookie.threadId)) {
            mCurrentCookie.needSendResult = false;
            MessageUtils.sendSuccessResult(mCurrentCookie.callbackContext, MessageUtils.makeMessage(mCurrentCookie.taskId, param));
        } else {
            Log.e(TAG, "Calling returnMessage() is permitted only from method entry thread.");
        }
    }

    /**
     * 値を JavaScript へ通知
     * sendPluginResult() と等価
     * TBD.
     */
    protected void sendParams(Cookie cookie, Object... params) {
        sendParams(true, cookie, params);
    }

    /**
     * 値を JavaScript へ通知
     * sendPluginResult() と等価
     * TBD.
     */
    protected void sendParams(boolean keepCallback, Cookie cookie, Object... params) {
        if (null == cookie || null == cookie.callbackContext) {
            Log.e(TAG, "Invalid cookie object.");
            return;
        }
        PluginResult result = new PluginResult(PluginResult.Status.OK, MessageUtils.makeMessage(cookie.taskId, params));
        result.setKeepCallback(keepCallback);
        cookie.callbackContext.sendPluginResult(result);
    }

    /**
     * 値を JavaScript へ通知
     * ワーカースレッドから使用可能
     * keepCallback は false が指定される
     */
    protected void doneParams(Cookie cookie, Object... params) {
        if (null == cookie || null == cookie.callbackContext) {
            Log.e(TAG, "Invalid cookie object.");
            return;
        }
        MessageUtils.sendSuccessResult(cookie.callbackContext, MessageUtils.makeMessage(cookie.taskId, params));
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    /**
     * 型の正規化
     * オブジェクトをプリミティブに変換する
     * 数値型は、すべて double にする. (JavaScript との対象性より)
     *
     * @param src [in] 型情報
     * @return 正規化された型情報
     */
    private Class<?> normalizeType(Class<?> src) {
        String type = src.getName();
        if (    type.equals("java.lang.Byte")
            ||  type.equals("java.lang.Short")
            ||  type.equals("java.lang.Integer")
            ||  type.equals("java.lang.Long")
            ||  type.equals("java.lang.Float")
            ||  type.equals("java.lang.Double")
        ) {
            return double.class;
        } else if (type.equals("java.lang.Boolean")) {
            return boolean.class;
        } else {
            return src;
        }
    }

}

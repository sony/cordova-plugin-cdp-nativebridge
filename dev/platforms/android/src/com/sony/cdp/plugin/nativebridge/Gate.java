package com.sony.cdp.plugin.nativebridge;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;


/**
 * @class Gate
 * @brief NativeBridge と通信するベースクラス
 *         com.sony.cdp.plugin.nativebridge クライアントは本クラスから Gate クラスを派生する
 */
public class Gate {
    private static final String TAG = "[com.sony.cdp.plugin.nativebridge][Native][Gate] ";

    /**
     * @class Cookie
     * @brief Cookie 情報を格納
     */
    public class Cookie {
        public final CordovaInterface   cordova;
        public final CallbackContext    callbackContext;
        public final String             className;
        public final String             methodName;
        public final String             objectId;
        public final String             taskId;
        public final boolean           compatible;
        public final String             threadId = Thread.currentThread().getName();
        public        boolean           needSendResult = true;
        Cookie(CordovaInterface cordova, CallbackContext ctx, JSONObject execInfo) throws JSONException {
            this.cordova            = cordova;
            this.callbackContext    = ctx;
            JSONObject feature = execInfo.getJSONObject("feature");
            this.className  = feature.getJSONObject("android").getString("packageInfo");
            this.methodName = execInfo.isNull("method") ? null : execInfo.getString("method");
            this.objectId   = execInfo.getString("objectId");
            this.taskId     = execInfo.isNull("taskId") ? null : execInfo.getString("taskId");
            this.compatible = execInfo.getBoolean("compatible");
        }
    }

    private Cookie mCurrentCookie = null;

    ///////////////////////////////////////////////////////////////////////
    // public methods

    /**
     * Cordova 互換ハンドラ
     * BridgeManager からコールされる
     * compatible オプションが有効な場合、このメソッドがコールされる
     * クライアントは本メソッドをオーバーライド可能
     *
     * @param action          The action to execute.
     * @param args            The exec() arguments.
     * @param callbackContext The callback context used when calling back into JavaScript.
     * @param cookie          The execute cookie. (NativeBridge extended argument)
     * @return                Whether the action was valid.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext, Cookie cookie) throws JSONException {
        Log.w(TAG, "execute() method should be override from sub class.");
        return false;
    }

    /**
     * メソッド呼び出し
     * BridgeManager からコールされる
     *
     * @param mehtodName    [in] 呼び出し対象のメソッド名
     * @param args          [in] exec() の引数リスト
     * @param cookie        [in] Callback Context
     * @return ハンドリング時に true を返却
     */
    public boolean invoke(String methodName, JSONArray args, Cookie cookie) {
        synchronized (this) {
            try {
                Class<?> cls = this.getClass();
                int length = args.length();
                Class<?>[] argTypes = new Class[length];
                Object[] argValues = new Object[length];
                for (int i = 0; i < length; i++) {
                    Object arg = args.get(i);
                    argTypes[i] = normalizeType(arg.getClass());
                    argValues[i] = arg;
                }
                Method method = cls.getMethod(methodName, argTypes);

                mCurrentCookie = cookie;
                method.invoke(this, argValues);
                if (mCurrentCookie.needSendResult) {
                    MessageUtils.sendSuccessResult(cookie.callbackContext, cookie.taskId);
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

    /**
     * cancel 呼び出し
     * BridgeManager からコールされる。
     * クライアントは本メソッドをオーバーライド可能
     *
     * @param cookie [in] The execute cookie. (NativeBridge extended argument)
     */
    public void cancel(Cookie cookie) {
        return;
    }

    ///////////////////////////////////////////////////////////////////////
    // public static methods

    /**
     * Cookie の生成
     * BridgeManager からコールされる
     *
     * @param cordova         [in] cordova interface
     * @param callbackContext [in] callback context
     * @param execInfo        [in] JavaSript 情報
     * @throws JSONException
     */
    public static Cookie newCookie(CordovaInterface cordova, CallbackContext callbackContext, JSONObject execInfo) throws JSONException {
        return new Gate().new Cookie(cordova, callbackContext, execInfo);
    }

    ///////////////////////////////////////////////////////////////////////
    // protected methods

    /**
     * Cookie の取得
     * method 呼び出されたスレッドからのみ Cookie 取得が可能
     * compatible オプションを伴って呼ばれた場合は無効になる。
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
     * @param param [in] Native から JavaScript へ返す値を指定
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
     * sendPluginResult() のヘルパー関数。 既定で keepCallback を有効にする。
     *
     * @param cookie [in] cookie オブジェクトを指定
     * @param params [in] パラメータを可変引数で指定
     */
    protected void notifyParams(Cookie cookie, Object... params) {
        notifyParams(true, cookie, params);
    }

    /**
     * 値を JavaScript へ通知
     * sendPluginResult() のヘルパー関数
     *
     * @param keepCallback [in] keepCallback 値
     * @param cookie       [in] cookie オブジェクトを指定
     * @param params       [in] パラメータを可変引数で指定
     */
    protected void notifyParams(boolean keepCallback, Cookie cookie, Object... params) {
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
     *
     * @param cookie [in] cookie オブジェクトを指定
     * @param params [in] パラメータを可変引数で指定
     */
    protected void resolveParams(Cookie cookie, Object... params) {
        if (null == cookie || null == cookie.callbackContext) {
            Log.e(TAG, "Invalid cookie object.");
            return;
        }
        MessageUtils.sendSuccessResult(cookie.callbackContext, MessageUtils.makeMessage(cookie.taskId, params));
    }

    /**
     * 値を JavaScript へエラーを通知
     * ヘルパー関数
     * keepCallback は false が指定される
     *
     * @param cookie [in] cookie オブジェクトを指定
     * @param params [in] パラメータを可変引数で指定
     */
    protected void rejectParams(Cookie cookie, Object... params) {
        rejectParams(MessageUtils.ERROR_FAIL, null, cookie, params);
    }

    /**
     * 値を JavaScript へエラーを通知
     * ワーカースレッドから使用可能
     * keepCallback は false が指定される
     *
     * @param code    [in] エラーコード
     * @param message [in] エラーメッセージ
     * @param cookie  [in] cookie オブジェクトを指定
     * @param params  [in] パラメータを可変引数で指定
     */
    protected void rejectParams(int code, String message, Cookie cookie, Object... params) {
        if (null == cookie || null == cookie.callbackContext) {
            Log.e(TAG, "Invalid cookie object.");
            return;
        }
        MessageUtils.sendErrorResult(cookie.callbackContext, MessageUtils.makeMessage(code, message, cookie.taskId, params));
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    /**
     * 型の正規化
     * オブジェクトをプリミティブに変換する
     * 数値型は、すべて double にする (JavaScript との対象性より)
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

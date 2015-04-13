package com.sony.cdp.sample;

import java.util.HashSet;
import java.util.Set;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import com.sony.cdp.plugin.nativebridge.Gate;
import com.sony.cdp.plugin.nativebridge.MessageUtils;


/**
 * @class SimpleGate
 * @brief サンプル Gate クラス
 */
public class SimpleGate extends Gate {
    private static final String TAG = "[com.sony.cdp.sample][Native][SimpleGate] ";

    private Set<String> mCancelableTask = new HashSet<String>();

    ///////////////////////////////////////////////////////////////////////
    // public mehtods

    /**
	 * サンプルメソッド
	 * JavaScript レイヤで指定したメソッドと引数を受けることができる
	 * 数値は double 固定
	 *
	 * 値を戻すには
	 *  - returnParams()
	 * を使用する。
	 *
	 * @throws JSONException
	 */
	public void coolMethod(double arg1, boolean arg2, String arg3, JSONObject arg4) throws JSONException {
	    String msg = "arg1: " + String.valueOf((int)arg1) + ", arg2: " + String.valueOf(arg2) + ", arg3: " + arg3;
	    msg += (", 日本語でOK: " + String.valueOf(arg4.getBoolean("ok")));
	    returnParames(msg);
	}

    /**
     * サンプルメソッド
     * void 版
     *
     */
    public void voidMethod() {
        Log.d(TAG, "void voidMethod(void), called.");
    }

    /**
     * サンプルメソッド (スレッドを扱う例)
     * 引数に "final" を指定しても、リフレクションコール可能
     * getCookie() より、cordova plugin が扱う変数にアクセスが可能
     *
     * スレッド内では
     *  - notifyParams()
     *  - resolveParams()
     *  - rejectParams()
     * がそれぞれ使用可能
     *
     * @throws JSONException
     */
    public void threadMethod(final double arg1, final boolean arg2, final String arg3, final JSONObject arg4) throws JSONException {
        final Cookie cookie = getCookie();

        cookie.cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                String errorMsg;
                try {
                    notifyParams(cookie, (int)arg1, arg2);
                    notifyParams(cookie, arg3, arg4);
                    String msg = "arg1: " + String.valueOf((int)arg1) + ", arg2: " + String.valueOf(arg2) + ", arg3: " + arg3;
                    msg += (", 日本語でOK: " + String.valueOf(arg4.getBoolean("ok")));
                    resolveParams(cookie, msg);
                } catch (JSONException e) {
                    errorMsg = "Invalid JSON object";
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, errorMsg, cookie);
                }
            }
        });
    }

    /**
     * ワーカースレッドとキャンセルの例
     * cancel() がコールされるまで、100 [msec] ごとに進捗を通知するサンプル
     *
     * @throws JSONException
     */
    public void progressMethod() throws JSONException {
        final Cookie cookie = getCookie();

        synchronized (this) {
            mCancelableTask.add(cookie.taskId);
        }

        cookie.cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                String errorMsg;
                int progress = 0;
                try {
                    while (true) {
                        if (isCanceled(cookie.taskId)) {
                            rejectParams(MessageUtils.ERROR_CANCEL, TAG + "progressMethod() canceled.", cookie);
                            break;
                        }
                        notifyParams(cookie, progress);
                        progress++;
                        Thread.sleep(100);
                    }
                } catch (InterruptedException e) {
                    errorMsg = "InterruptedException occur.";
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, errorMsg, cookie);
                }
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: NativeBridge

    /**
     * Cordova 互換ハンドラ
     * BridgeManager からコールされる
     * compatible オプションが有効な場合、このメソッドがコールされる
     * 拡張情報は cookie に格納される。
     * クライアントは本メソッドをオーバーライド可能
     *
     * @param action          The action to execute.
     * @param args            The exec() arguments.
     * @param callbackContext The callback context used when calling back into JavaScript.
     * @param cookie          The execute cookie. (NativeBridge extended argument)
     * @return                Whether the action was valid.
     */
	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext, Cookie cookie) throws JSONException {
	    if (action.equals("compatibleCheck")) {
	        JSONArray message = new JSONArray();
	        message.put(cookie.taskId);
	        JSONObject argsInfo = new JSONObject();
	        argsInfo.put("taskId", cookie.taskId);
	        argsInfo.put("arg1", args.getInt(0));
	        argsInfo.put("arg2", args.getBoolean(1));
	        argsInfo.put("arg3", args.getString(2));
	        argsInfo.put("arg4", args.getJSONObject(3));
            message.put(argsInfo);
	        callbackContext.success(message);
	        return true;
	    }
        return false;
    }

    /**
     * cancel 呼び出し
     * BridgeManager からコールされる
     * クライアントは本メソッドをオーバーライドして、taskId を特定し処理を実装する
     * 全キャンセル時は taskId に null が格納されている
     *
     * @param cookie [in] The execute cookie. (NativeBridge extended argument)
     */
	@Override
    public void cancel(Cookie cookie) {
	    synchronized (this) {
	        if (null != cookie.taskId) {
	            mCancelableTask.remove(cookie.taskId);
	        } else {
	            mCancelableTask.clear();
	        }
	    }
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    //! キャンセル確認
    private boolean isCanceled(String taskId) {
        synchronized (this) {
            return !mCancelableTask.contains(taskId);
        }
    }
}


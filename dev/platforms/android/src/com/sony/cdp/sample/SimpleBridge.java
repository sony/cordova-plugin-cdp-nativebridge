package com.sony.cdp.sample;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import com.sony.cdp.plugin.nativebridge.MessageUtils;
import com.sony.cdp.plugin.nativebridge.NativeBridge;


/**
 * @class SimpleBridge
 * @brief サンプル Bridge クラス
 */
public class SimpleBridge extends NativeBridge {
    private static final String TAG = "[com.sony.cdp.sample][Native][SimpleBridge] ";

    ///////////////////////////////////////////////////////////////////////
    // public mehtods

    /**
	 * サンプルメソッド
	 *
	 * @throws JSONException
	 */
	public void coolMethod(double arg1, boolean arg2, String arg3, JSONObject arg4) throws JSONException {
	    String msg = "arg1: " + String.valueOf((int)arg1) + ", arg2: " + String.valueOf(arg2) + ", arg3: " + arg3;
	    msg += (", 日本語でOK: " + String.valueOf(arg4.getBoolean("ok")));
	    returnParames(msg);
	}

    /**
     * サンプルメソッド (スレッドを扱う例)
     *
     * @throws JSONException
     */
    public void threadMethod(final double arg1, final boolean arg2, final String arg3, final JSONObject arg4) throws JSONException {
        final Cookie cookie = getCookie();

        cookie.cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                String errorMsg;
                try {
                    sendParams(cookie, (int)arg1, arg2);
                    sendParams(cookie, arg3, arg4);
                    String msg = "arg1: " + String.valueOf((int)arg1) + ", arg2: " + String.valueOf(arg2) + ", arg3: " + arg3;
                    msg += (", 日本語でOK: " + String.valueOf(arg4.getBoolean("ok")));
                    doneParams(cookie, msg);
                } catch (JSONException e) {
                    errorMsg = "Invalid JSON object";
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
     * BridgeManager からコールされる。
     * compatible オプションが有効な場合、このメソッドがコールされる。
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
}


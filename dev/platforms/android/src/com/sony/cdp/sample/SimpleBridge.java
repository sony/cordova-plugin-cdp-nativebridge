package com.sony.cdp.sample;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.sony.cdp.plugin.nativebridge.NativeBridge;


/**
 * @class SimpleBridge
 * @brief サンプル Bridge クラス
 */
public class SimpleBridge extends NativeBridge {
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
     * @param taskId          The task ID. (NativeBridge extended argument)
     * @return                Whether the action was valid.
     */
	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext, String taskId) throws JSONException {
	    if (action.equals("compatibleCheck")) {
	        JSONArray message = new JSONArray();
	        message.put(taskId);
	        JSONObject argsInfo = new JSONObject();
	        argsInfo.put("taskId", taskId);
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


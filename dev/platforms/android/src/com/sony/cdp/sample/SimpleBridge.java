package com.sony.cdp.sample;

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
	 * @throws JSONException
	 */
	public void coolMethod(double arg1, boolean arg2, String arg3, JSONObject arg4) throws JSONException {
	    String msg = "arg1: " + String.valueOf((int)arg1) + ", arg2: " + String.valueOf(arg2) + ", arg3: " + arg3;
	    msg += (", 日本語でOK: " + String.valueOf(arg4.getBoolean("ok")));
	    returnParames(msg);
	}
}


package com.sony.cdp.plugin.nativebridge;

import java.util.HashMap;
import java.util.Map;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

/**
 * @class BridgeManager
 * @brief cdp.plugin.nativebridge のエントリクラス
 */
public class BridgeManager extends CordovaPlugin {

    private static final String TAG = "[com.sony.cdp.plugin.nativebridge][Native][BridgeManager] ";
    private Map<String, NativeBridge> mBrdiges = new HashMap<String, NativeBridge>();

    ///////////////////////////////////////////////////////////////////////
    // Override: CordovaPlugin

    //! execute のエントリ
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("execTask")) {
            execTask(args.getJSONObject(0), args.getJSONArray(1), callbackContext);
            return true;
        }
        return false;
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    //! "execTask" のエントリ
    private void execTask(JSONObject execInfo, JSONArray argsInfo, CallbackContext callbackContext) {
        Log.v(TAG, "execTask");

        try {
            NativeBridge.Cookie cookie = NativeBridge.newCookie(callbackContext, execInfo);

            {
                NativeBridge bridge = getBridgeClass(cookie.objectId, cookie.className);
                if (null == bridge) {
                    MessageUtils.sendErrorResult(callbackContext, cookie.taskId, MessageUtils.ERROR_CLASS_NOT_FOUND, (TAG + "class not found. class: " + cookie.className));
                    return;
                }

                if (cookie.compatible) {
                    if (!bridge.execute(cookie.methodName, argsInfo, callbackContext, cookie)) {
                        MessageUtils.sendErrorResult(callbackContext, cookie.taskId, MessageUtils.ERROR_NOT_IMPLEMENT, (TAG + "execute() is not implemented. class: " + cookie.className));
                    }
                } else if (!bridge.invoke(cookie.methodName, argsInfo, cookie)) {
                    MessageUtils.sendErrorResult(callbackContext, cookie.taskId, MessageUtils.ERROR_METHOD_NOT_FOUND, (TAG + "method not found. method: " + cookie.className + "#" + cookie.methodName));
                }
            }

        } catch (JSONException e) {
            Log.e(TAG, "Invalid JSON object", e);
        }
    }

    /**
     * NativeBridge クラスのインスタンスを取得
     */
    private NativeBridge getBridgeClass(String objectId, String className) {
        NativeBridge ret = mBrdiges.get(objectId);
        if (null == ret) {
            ret = createBridgeClass(className);
            if (null != ret) {
                mBrdiges.put(objectId, ret);
            }
        }
        return ret;
    }

    /**
     * NativeBridge クラスのインスタンスを生成
     */
    private NativeBridge createBridgeClass(String className) {
        NativeBridge ret = null;
        try {
            Class<?> cls = null;
            if ((className != null) && !("".equals(className))) {
                cls = Class.forName(className);
            }
            if (null != cls && NativeBridge.class.isAssignableFrom(cls)) {
                ret = (NativeBridge)cls.newInstance();
            }
        } catch (Exception e) {
            Log.d(TAG, "class not found. class: " + className, e);
        }
        return ret;
    }
}

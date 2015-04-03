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
            JSONObject feature = execInfo.getJSONObject("feature");
            String className = feature.getJSONObject("android").getString("packageInfo");
            String methodName = execInfo.getString("method");
            String objectId = execInfo.getString("objectId");
            String taskId = execInfo.getString("taskId");

            {
                NativeBridge bridge = getBridgeClass(objectId, className);
                if (null == bridge) {
                    ResultUtils.sendErrorResult(callbackContext, taskId, ResultUtils.ERROR_CLASS_NOT_FOUND, (TAG + "class not found. class: " + className));
                    return;
                }

                if (!bridge.invoke(callbackContext, taskId, methodName, argsInfo)) {
                    ResultUtils.sendErrorResult(callbackContext, taskId, ResultUtils.ERROR_METHOD_NOT_FOUND, (TAG + "method not found. method: " + className + "#" + methodName));
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

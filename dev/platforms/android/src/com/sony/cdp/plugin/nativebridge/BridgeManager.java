package com.sony.cdp.plugin.nativebridge;

import java.util.HashMap;
import java.util.Map;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import android.util.SparseArray;

/**
 * @class BridgeManager
 * @brief cdp.plugin.nativebridge のエントリクラス
 */
public class BridgeManager extends CordovaPlugin {

    private static final String TAG = "[CDP.Plugin][Native][BridgeManager] ";

    // Result Code
    private static final int SUCCESS_OK                 = 0x0000;
    private static final int ERROR_FAIL                 = 0x0001;
    private static final int ERROR_CANCEL               = 0x0002;
    private static final int ERROR_INVALID_ARG          = 0x0003;
    private static final int ERROR_NOT_IMPLEMENT        = 0x0004;
    private static final int ERROR_NOT_SUPPORT          = 0x0005;
    private static final int ERROR_INVALID_OPERATION    = 0x0006;
    private static final int ERROR_CLASS_NOT_FOUND      = 0x0007;
    private static final int ERROR_METHOD_NOT_FOUND     = 0x0008;

    private SparseArray<String> mErrorTbl = new SparseArray<String>();
    private Map<String, NativeBridge> mBrdiges = new HashMap<String, NativeBridge>();

    //! constructor
    public BridgeManager() {
        super();
        mErrorTbl.put(SUCCESS_OK,               "SUCCESS_OK");
        mErrorTbl.put(ERROR_FAIL,               "ERROR_FAIL");
        mErrorTbl.put(ERROR_CANCEL,             "ERROR_CANCEL");
        mErrorTbl.put(ERROR_INVALID_ARG,        "ERROR_INVALID_ARG");
        mErrorTbl.put(ERROR_NOT_IMPLEMENT,      "ERROR_NOT_IMPLEMENT");
        mErrorTbl.put(ERROR_NOT_SUPPORT,        "ERROR_NOT_SUPPORT");
        mErrorTbl.put(ERROR_INVALID_OPERATION,  "ERROR_INVALID_OPERATION");
        mErrorTbl.put(ERROR_CLASS_NOT_FOUND,    "ERROR_CLASS_NOT_FOUND");
        mErrorTbl.put(ERROR_CLASS_NOT_FOUND,    "ERROR_CLASS_NOT_FOUND");
        mErrorTbl.put(ERROR_METHOD_NOT_FOUND,   "ERROR_METHOD_NOT_FOUND");
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: CordovaPlugin

    //! execute のエントリ
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("execTask")) {
            execTask(args.getJSONObject(0), args.getJSONObject(1), callbackContext);
            return true;
        }
        return false;
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    //! "execTask" のエントリ
    private void execTask(JSONObject execInfo, JSONObject argsInfo, CallbackContext callbackContext) {
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
                    sendErrorResult(callbackContext, taskId, ERROR_CLASS_NOT_FOUND, (TAG + "class not found. class: " + className));
                    return;
                }

                if (!bridge.invoke(callbackContext, taskId, methodName, argsInfo)) {
                    sendErrorResult(callbackContext, taskId, ERROR_METHOD_NOT_FOUND, (TAG + "method not found. method: " + className + "#" + methodName));
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

    /**
     * Error 情報を送信
     */
    private void sendErrorResult(CallbackContext callbackContext, String taskId, int code, String message) {
        try {
            JSONObject result = new JSONObject();
            result.put("code", code);
            result.put("message", message);
            result.put("name", TAG + mErrorTbl.get(code));
            result.put("taskId", taskId);

            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, result));
        } catch (JSONException e) {
            Log.e(TAG, "create result JSON object failed.", e);
        }
    }
}

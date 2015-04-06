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
 *         クライアントは本クラスを意識する必要は無い
 */
public final class BridgeManager extends CordovaPlugin {

    private static final String TAG = "[com.sony.cdp.plugin.nativebridge][Native][BridgeManager] ";
    private Map<String, NativeBridge> mBrdiges = new HashMap<String, NativeBridge>();

    ///////////////////////////////////////////////////////////////////////
    // Override: CordovaPlugin

    /**
     * CordovaPlugin のエントリ関数
     *
     * @param action          The action to execute.
     * @param args            The exec() arguments.
     * @param callbackContext The callback context used when calling back into JavaScript.
     * @return                Whether the action was valid.
     */
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("execTask")) {
            execTask(args.getJSONObject(0), args.getJSONArray(1), callbackContext);
            return true;
        } else if (action.equals("cancelTask")) {
            cancelTask(args.getJSONObject(0), callbackContext);
            return true;
        }
        return false;
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    /**
     * "execTask" のエントリ
     *
     * @param execInfo        [in] 実行情報を格納
     * @param argsInfo        [in] 引数情報を格納
     * @param callbackContext [in] Callback Context
     */
    private void execTask(JSONObject execInfo, JSONArray argsInfo, CallbackContext callbackContext) {
        Log.v(TAG, "execTask");

        try {
            NativeBridge.Cookie cookie = NativeBridge.newCookie(cordova, callbackContext, execInfo);

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
     * "cancelTask" のエントリ
     *
     * @param execInfo        [in] 実行情報を格納
     * @param callbackContext [in] Callback Context
     */
    private void cancelTask(JSONObject execInfo, CallbackContext callbackContext) {
        Log.v(TAG, "cancelTask");

        try {
            NativeBridge.Cookie cookie = NativeBridge.newCookie(cordova, callbackContext, execInfo);

            {
                NativeBridge bridge = getBridgeClass(cookie.objectId, cookie.className);
                if (null == bridge) {
                    MessageUtils.sendErrorResult(callbackContext, cookie.taskId, MessageUtils.ERROR_CLASS_NOT_FOUND, (TAG + "class not found. class: " + cookie.className));
                    return;
                }

                bridge.cancel(cookie);
            }

        } catch (JSONException e) {
            Log.e(TAG, "Invalid JSON object", e);
        }
    }

    /**
     * NativeBridge クラスのインスタンスを取得
     *
     * @param objectId  [in] Object ID
     * @param className [in] クラス名
     * @return NativeBridge インスタンス
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
     * NativeBridge クラスのインスタンスをリフレクションにより生成
     *
     * @param className [in] クラス名
     * @return NativeBridge インスタンス
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

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
 * @class NativeBridge
 * @brief cdp.plugin.nativebridge のエントリクラス
 */
public final class NativeBridge extends CordovaPlugin {

    private static final String TAG = "[com.sony.cdp.plugin.nativebridge][Native][NativeBridge] ";
    private Map<String, Gate> mGates = new HashMap<String, Gate>();

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
        } else if (action.equals("disposeTask")) {
            disposeTask(args.getJSONObject(0), callbackContext);
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
        try {
            Gate.Cookie cookie = Gate.newCookie(this, this.preferences, callbackContext, execInfo);

            {
                Gate gate = getGateClass(cookie.objectId, cookie.className);
                if (null == gate) {
                    MessageUtils.sendErrorResult(callbackContext, cookie.taskId, MessageUtils.ERROR_CLASS_NOT_FOUND, (TAG + "class not found. class: " + cookie.className));
                    return;
                }

                if (cookie.compatible) {
                    if (!gate.execute(cookie.methodName, argsInfo, callbackContext, cookie)) {
                        MessageUtils.sendErrorResult(callbackContext, cookie.taskId, MessageUtils.ERROR_NOT_IMPLEMENT, (TAG + "execute() is not implemented. class: " + cookie.className));
                    }
                } else if (!gate.invoke(cookie.methodName, argsInfo, cookie)) {
                    MessageUtils.sendErrorResult(callbackContext, cookie.taskId, MessageUtils.ERROR_METHOD_NOT_FOUND, (TAG + "method not found. method: " + cookie.className + "#" + cookie.methodName));
                }
            }

        } catch (JSONException e) {
            String errorMsg = "Invalid JSON object.";
            Log.e(TAG, errorMsg, e);
            MessageUtils.sendErrorResult(callbackContext, null, MessageUtils.ERROR_INVALID_ARG, (TAG + errorMsg));
        }
    }

    /**
     * "cancelTask" のエントリ
     *
     * @param execInfo        [in] 実行情報を格納
     * @param callbackContext [in] Callback Context
     * @return 対象のオブジェクト ID を返却
     */
    private String cancelTask(JSONObject execInfo, CallbackContext callbackContext) {
        String objectId = null;

        try {
            Gate.Cookie cookie = Gate.newCookie(this, this.preferences, callbackContext, execInfo);

            {
                Gate gate = getGateClass(cookie.objectId, cookie.className);
                if (null == gate) {
                    MessageUtils.sendErrorResult(callbackContext, cookie.taskId, MessageUtils.ERROR_CLASS_NOT_FOUND, (TAG + "class not found. class: " + cookie.className));
                    return null;
                }

                gate.cancel(cookie);
                MessageUtils.sendSuccessResult(callbackContext, MessageUtils.makeMessage(null));
                objectId = cookie.objectId;
            }

        } catch (JSONException e) {
            String errorMsg = "Invalid JSON object.";
            Log.e(TAG, errorMsg, e);
            MessageUtils.sendErrorResult(callbackContext, null, MessageUtils.ERROR_INVALID_ARG, (TAG + errorMsg));
        }

        return objectId;
    }

    /**
     * "disposelTask" のエントリ
     *
     * @param execInfo        [in] 実行情報を格納
     * @param callbackContext [in] Callback Context
     */
    private void disposeTask(JSONObject execInfo, CallbackContext callbackContext) {
        String objectId = cancelTask(execInfo, callbackContext);
        if (null != objectId) {
            mGates.remove(objectId);
        }
    }

    /**
     * Gate クラスのインスタンスを取得
     *
     * @param objectId  [in] Object ID
     * @param className [in] クラス名
     * @return Gate インスタンス
     */
    private Gate getGateClass(String objectId, String className) {
        Gate ret = mGates.get(objectId);
        if (null == ret) {
            ret = createGateClass(className);
            if (null != ret) {
                mGates.put(objectId, ret);
            }
        }
        return ret;
    }

    /**
     * Gate クラスのインスタンスをリフレクションにより生成
     *
     * @param className [in] クラス名
     * @return Gate インスタンス
     */
    private Gate createGateClass(String className) {
        Gate ret = null;
        try {
            Class<?> cls = null;
            if ((className != null) && !("".equals(className))) {
                cls = Class.forName(className);
            }
            if (null != cls && Gate.class.isAssignableFrom(cls)) {
                ret = (Gate)cls.newInstance();
            }
        } catch (Exception e) {
            Log.d(TAG, "class not found. class: " + className, e);
        }
        return ret;
    }
}

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
            execTask(args.getJSONObject(0), getMethodArgs(args), callbackContext);
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
     * 生引数をメソッド引数に変換
     *
     * @param rawArgs [in] cordova.exec() に指定された引数
     * @return JSONArray (index == 1 からの引数リスト)
     * @throws JSONException
     */
    private JSONArray getMethodArgs(JSONArray rawArgs) throws JSONException {
        JSONArray methodArgs = new JSONArray();
        for (int i = 1; i < rawArgs.length(); i++) {
            methodArgs.put(rawArgs.get(i));
        }
        return methodArgs;
    }

    /**
     * "execTask" のエントリ
     *
     * @param execInfo        [in] 実行情報を格納
     * @param argsInfo        [in] 引数情報を格納
     * @param callbackContext [in] Callback Context
     */
    private void execTask(JSONObject execInfo, JSONArray argsInfo, CallbackContext callbackContext) {
        try {
            Gate.Context context = Gate.newContext(this, this.preferences, callbackContext, execInfo);

            {
                Gate gate = getGateClass(context.objectId, context.className);
                if (null == gate) {
                    MessageUtils.sendErrorResult(callbackContext, context.taskId, MessageUtils.ERROR_CLASS_NOT_FOUND, (TAG + "class not found. class: " + context.className));
                    return;
                }
                if (context.compatible) {
                    if (!gate.execute(context.methodName, argsInfo, context)) {
                        MessageUtils.sendErrorResult(callbackContext, context.taskId, MessageUtils.ERROR_NOT_IMPLEMENT, (TAG + "execute() is not implemented. class: " + context.className));
                    }
                } else {
                    JSONObject errorResult = gate.invoke(context.methodName, argsInfo, context);
                    if (null != errorResult) {
                        MessageUtils.sendErrorResult(callbackContext, errorResult);
                    }
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
            Gate.Context context = Gate.newContext(this, this.preferences, callbackContext, execInfo);

            {
                Gate gate = getGateClass(context.objectId, context.className);
                if (null == gate) {
                    MessageUtils.sendErrorResult(callbackContext, context.taskId, MessageUtils.ERROR_CLASS_NOT_FOUND, (TAG + "class not found. class: " + context.className));
                    return null;
                }

                gate.cancel(context);
                MessageUtils.sendSuccessResult(callbackContext, MessageUtils.makeMessage(null));
                objectId = context.objectId;
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

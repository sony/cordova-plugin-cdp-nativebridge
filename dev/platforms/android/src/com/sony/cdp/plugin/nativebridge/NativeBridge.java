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
        MethodContext context = new MethodContext(callbackContext.getCallbackId(), webView, args);
        if (null == context.className) {
            MessageUtils.sendErrorResult(callbackContext, context.taskId, MessageUtils.ERROR_NOT_SUPPORT, (TAG + "the function is not supported on android."));
            return true;
        } else if (action.equals("execTask")) {
            execTask(context);
            return true;
        } else if (action.equals("cancelTask")) {
            cancelTask(context);
            return true;
        } else if (action.equals("disposeTask")) {
            disposeTask(context);
            return true;
        }
        return false;
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    /**
     * "execTask" のエントリ
     *
     * @param context [in] MethodContext オブジェクト
     * @throws JSONException
     */
    private void execTask(final MethodContext context) throws JSONException {
        Gate gate = getGateClass(context.objectId, context.className);
        if (null == gate) {
            MessageUtils.sendErrorResult(context, context.taskId, MessageUtils.ERROR_CLASS_NOT_FOUND, (TAG + "class not found. class: " + context.className));
            return;
        }
        if (context.compatible) {
            if (!gate.execute(context.methodName, context.methodArgs, context)) {
                MessageUtils.sendErrorResult(context, context.taskId, MessageUtils.ERROR_NOT_IMPLEMENT, (TAG + "execute() is not implemented. class: " + context.className));
            }
        } else {
            JSONObject errorResult = gate.invoke(context);
            if (null != errorResult) {
                MessageUtils.sendErrorResult(context, errorResult);
            }
        }
    }

    /**
     * "cancelTask" のエントリ
     *
     * @param context [in] MethodContext オブジェクト
     * @return 対象のオブジェクト ID を返却
     */
    private String cancelTask(final MethodContext context) {
        String objectId = null;

        {
            Gate gate = getGateClass(context.objectId, context.className);
            if (null == gate) {
                MessageUtils.sendErrorResult(context, context.taskId, MessageUtils.ERROR_CLASS_NOT_FOUND, (TAG + "class not found. class: " + context.className));
                return null;
            }

            gate.cancel(context);
            MessageUtils.sendSuccessResult(context, MessageUtils.makeMessage(null));
            objectId = context.objectId;
        }

        return objectId;
    }

    /**
     * "disposelTask" のエントリ
     *
     * @param context [in] MethodContext オブジェクト
     */
    private void disposeTask(final MethodContext context) {
        String objectId = cancelTask(context);
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
                ret.privateInitialize(cordova, webView, preferences);
            }
        } catch (Exception e) {
            Log.d(TAG, "class not found. class: " + className, e);
        }
        return ret;
    }
}

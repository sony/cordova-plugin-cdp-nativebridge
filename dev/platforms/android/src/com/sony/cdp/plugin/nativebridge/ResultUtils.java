package com.sony.cdp.plugin.nativebridge;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import android.util.SparseArray;

/**
 * @class ResultUtils
 * @brief cdp.plugin.nativebridge の結果を生成するユーティリティクラス
 */
public class ResultUtils {

    private static final String TAG = "[com.sony.cdp.plugin.nativebridge][Native][ResultUtil] ";

    // Result Code
    public static final int SUCCESS_OK                 = 0x0000;
    public static final int ERROR_FAIL                 = 0x0001;
    public static final int ERROR_CANCEL               = 0x0002;
    public static final int ERROR_INVALID_ARG          = 0x0003;
    public static final int ERROR_NOT_IMPLEMENT        = 0x0004;
    public static final int ERROR_NOT_SUPPORT          = 0x0005;
    public static final int ERROR_INVALID_OPERATION    = 0x0006;
    public static final int ERROR_CLASS_NOT_FOUND      = 0x0007;
    public static final int ERROR_METHOD_NOT_FOUND     = 0x0008;

    private static SparseArray<String> mErrorTbl = null;

    ///////////////////////////////////////////////////////////////////////
    // public static methods

    /**
     * Success 情報を送信
     */
    public static void sendSuccessResult(CallbackContext callbackContext, String taskId) {
        if (null == mErrorTbl) {
            init();
        }
        try {
            JSONObject result = new JSONObject();
            result.put("code", SUCCESS_OK);
            result.put("name", TAG + mErrorTbl.get(SUCCESS_OK));
            result.put("taskId", taskId);

            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, result));
        } catch (JSONException e) {
            Log.e(TAG, "create result JSON object failed.", e);
        }
    }

    /**
     * Error 情報を送信
     */
    public static void sendErrorResult(CallbackContext callbackContext, String taskId, int code, String message) {
        if (null == mErrorTbl) {
            init();
        }
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

    ///////////////////////////////////////////////////////////////////////
    // private methods

    //! テーブルの初期化
    private static void init() {
        mErrorTbl = new SparseArray<String>();
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
}

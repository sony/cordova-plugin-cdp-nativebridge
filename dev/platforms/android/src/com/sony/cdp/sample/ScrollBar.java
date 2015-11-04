package com.sony.cdp.sample;

import java.lang.reflect.InvocationTargetException;

import android.util.Log;

import com.sony.cdp.plugin.nativebridge.Gate;


/**
 * \~english
 * @class ScrollBar
 * @brief Scroll Bar management class.
 *
 * \~japanese
 * @class ScrollBar
 * @brief Scroll Bar 管理クラス
 */
public class ScrollBar extends Gate {
    private static final String TAG = "[com.sony.cdp.sample][Native][ScrollBar] ";


    ///////////////////////////////////////////////////////////////////////
    // public mehtods

    /**
     * \~english
     * Show vertical scrollBar.
     *
     * \~japanese
     * Vertical ScrollBar の 表示
     */
    public void showVertical() {
        try {
            Utils.getViewFromCordovaWebView(webView).setVerticalScrollBarEnabled(true);
        } catch (NoSuchMethodException e) {
            Log.e(TAG, "NoSuchMethodException", e);
        } catch (IllegalAccessException e) {
            Log.e(TAG, "IllegalAccessException", e);
        } catch (IllegalArgumentException e) {
            Log.e(TAG, "IllegalArgumentException", e);
        } catch (InvocationTargetException e) {
            Log.e(TAG, "InvocationTargetException", e);
        }
        Log.d(TAG, "showVertical() called.");
    }

    /**
     * \~english
     * Hide vertical scrollBar.
     *
     * \~japanese
     * Vertical ScrollBar を非表示
     */
    public void hideVertical() {
        try {
            Utils.getViewFromCordovaWebView(webView).setVerticalScrollBarEnabled(false);
        } catch (NoSuchMethodException e) {
            Log.e(TAG, "NoSuchMethodException", e);
        } catch (IllegalAccessException e) {
            Log.e(TAG, "IllegalAccessException", e);
        } catch (IllegalArgumentException e) {
            Log.e(TAG, "IllegalArgumentException", e);
        } catch (InvocationTargetException e) {
            Log.e(TAG, "InvocationTargetException", e);
        }
        Log.d(TAG, "hideVertical() called.");
    }
}

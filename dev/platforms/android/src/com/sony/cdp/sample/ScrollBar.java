package com.sony.cdp.sample;

import android.util.Log;

import com.sony.cdp.plugin.nativebridge.Gate;


/**
 * @class ScrollBar
 * @brief Scroll Bar 管理クラス
 */
public class ScrollBar extends Gate {
    private static final String TAG = "[com.sony.cdp.sample][Native][ScrollBar] ";


    ///////////////////////////////////////////////////////////////////////
    // public mehtods

    /**
     * Vertical ScrollBar の 表示
     */
    public void showVertical() {
        webView.setVerticalScrollBarEnabled(true);
        Log.d(TAG, "showVertical() called.");
    }

    /**
     * Vertical ScrollBar を非表示
     */
    public void hideVertical() {
        webView.setVerticalScrollBarEnabled(false);
        Log.d(TAG, "hideVertical() called.");
    }
}


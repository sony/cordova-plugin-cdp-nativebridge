package com.sony.cdp.sample;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.apache.cordova.CordovaWebView;

import android.view.View;
import android.webkit.WebView;


/**
 * @class Utils
 * @brief サンプル用ユーティリティクラス
 */
public class Utils {
    ///////////////////////////////////////////////////////////////////////
    // public mehtods

    /**
     * cordova-android 3.x - 4.x 互換用
     *
     * @throws NoSuchMethodException
     * @throws InvocationTargetException
     * @throws IllegalArgumentException
     * @throws IllegalAccessException
     */
    public static View getViewFromCordovaWebView(CordovaWebView cordovaWebView) throws NoSuchMethodException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        if (cordovaWebView instanceof WebView) {
            return (View)cordovaWebView;
        } else {
            Class<?> cls = cordovaWebView.getClass();
            Method method = cls.getMethod("getView");
            return (View)method.invoke(cordovaWebView);
        }
    }
}


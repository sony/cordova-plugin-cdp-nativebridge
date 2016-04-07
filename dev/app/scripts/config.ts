/// <reference path="../modules/include/frameworks.d.ts" />

module Config {

    var global = global || window;

    var baseUrl = /(.+\/)[^/]*#[^/]+/.exec(location.href);
    if (!baseUrl) {
        baseUrl = /(.+\/)/.exec(location.href);
    }

    // require.js configration
    var requireConfig = {
        baseUrl: baseUrl[1],

        urlArgs: "bust=" + Date.now(),

        paths: {
            // external modules
            "jquery": "modules/jquery/scripts/jquery",
            "jquery.mobile": "modules/jquery/scripts/jquery.mobile",
            "underscore": "modules/underscore/scripts/underscore",
            "backbone": "modules/backbone/scripts/backbone",
            "i18n": "modules/i18next/scripts/i18next",
            "hogan": "modules/hogan/scripts/hogan",

            // cdp modules
            "cdp.core": "modules/sony/cdp/scripts/cdp.core",
            "cdp.lazyload": "modules/sony/cdp/scripts/cdp.lazyload",
            "cdp.framework.jqm": "modules/sony/cdp/scripts/cdp.framework.jqm",
            "cdp.promise": "modules/sony/cdp/scripts/cdp.promise",
            "cdp.tools": "modules/sony/cdp/scripts/cdp.tools",
            "cdp.ui.listview": "modules/sony/cdp/scripts/cdp.ui.listview",
            "cdp.ui.jqm": "modules/sony/cdp/scripts/cdp.ui.jqm",

            // internal lib modules
            "cdp.nativebridge": "lib/scripts/cdp.nativebridge",

            // application
            "app": "scripts/app",
        },

        shim: {
        },
    };
    // global export
    global.requirejs = requireConfig;

    // jQuery settings
    export function jquery(): void {
        $.support.cors = true;            // allow cross domain request
        $.ajaxSetup({ cache: false });    // disable ajax request cache
    }

    // jQuery Mobile settings
    export function jquerymobile(): void {
        $.mobile.allowCrossDomainPages = true;
        $.mobile.defaultPageTransition = "none";
        $.mobile.hashListeningEnabled = false;
        $.mobile.pushStateEnabled = false;
    }

    // localize resource data path
    export function i18nDataPath(): string {
        return "res/locales/__ns__-__lng__.json";
    }

    /**
     * When not specifying domain information on a chrome inspector at sourceURL automatic insertion,
     * please set it as a false.
     */
    export var autoDomainAssign = true;

    // The string which is used to avoid a conflict
    export var namespace = "cdp";

    // build configuration symbol
    export var DEBUG = ((): boolean => {
        return !!("%% buildsetting %%");    //! returns "false" on release build
    })();
}

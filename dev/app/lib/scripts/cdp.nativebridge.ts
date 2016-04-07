/// <reference path="CDP/NativeBridge/_dev.dependencies.d.ts" />

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["cdp.promise"], function () {
            return factory(root.CDP || (root.CDP = {}), root.jQuery || root.$);
        });
    } else if (typeof exports === "object") {
        // CommonJS
        module.exports = factory(require("cdp.promise"), require("jquery"));
    } else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}), root.jQuery || root.$);
    }
} (((this || 0).self || global), function (CDP, $) {
    CDP.NativeBridge = CDP.NativeBridge || {};

    //<<
    CDP.lazyLoad("lazy-module-cdp.nativebridge");
    //>>

    return CDP.NativeBridge;
}));

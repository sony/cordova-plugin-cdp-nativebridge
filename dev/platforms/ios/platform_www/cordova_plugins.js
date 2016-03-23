cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.sony.cdp.plugin.test-framework/www/tests.js",
        "id": "com.sony.cdp.plugin.test-framework.cdvtests",
        "pluginId": "com.sony.cdp.plugin.test-framework"
    },
    {
        "file": "plugins/com.sony.cdp.plugin.test-framework/www/jasmine_helpers.js",
        "id": "com.sony.cdp.plugin.test-framework.jasmine_helpers",
        "pluginId": "com.sony.cdp.plugin.test-framework"
    },
    {
        "file": "plugins/com.sony.cdp.plugin.test-framework/www/medic.js",
        "id": "com.sony.cdp.plugin.test-framework.medic",
        "pluginId": "com.sony.cdp.plugin.test-framework"
    },
    {
        "file": "plugins/com.sony.cdp.plugin.test-framework/www/main.js",
        "id": "com.sony.cdp.plugin.test-framework.main",
        "pluginId": "com.sony.cdp.plugin.test-framework"
    },
    {
        "file": "plugins/cordova-plugin-cdp-nativebridge/www/cdp.plugin.nativebridge.js",
        "id": "cordova-plugin-cdp-nativebridge.NativeBridge",
        "pluginId": "cordova-plugin-cdp-nativebridge",
        "clobbers": [
            "CDP.Plugin.NativeBridge"
        ]
    },
    {
        "file": "plugins/cordova-plugin-cdp-nativebridge-tests/www/tests.js",
        "id": "cordova-plugin-cdp-nativebridge-tests.tests",
        "pluginId": "cordova-plugin-cdp-nativebridge-tests"
    }
];
module.exports.metadata = 
// TOP OF METADATA
{}
// BOTTOM OF METADATA
});
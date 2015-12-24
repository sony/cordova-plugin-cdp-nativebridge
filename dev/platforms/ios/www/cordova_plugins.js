cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-cdp-nativebridge/www/cdp.plugin.nativebridge.js",
        "id": "cordova-plugin-cdp-nativebridge.NativeBridge",
        "clobbers": [
            "CDP.Plugin.NativeBridge"
        ]
    },
    {
        "file": "plugins/com.sony.cdp.plugin.nativebridge.tests/www/tests.js",
        "id": "com.sony.cdp.plugin.nativebridge.tests.tests"
    },
    {
        "file": "plugins/com.sony.cdp.plugin.test-framework/www/tests.js",
        "id": "com.sony.cdp.plugin.test-framework.cdvtests"
    },
    {
        "file": "plugins/com.sony.cdp.plugin.test-framework/www/jasmine_helpers.js",
        "id": "com.sony.cdp.plugin.test-framework.jasmine_helpers"
    },
    {
        "file": "plugins/com.sony.cdp.plugin.test-framework/www/medic.js",
        "id": "com.sony.cdp.plugin.test-framework.medic"
    },
    {
        "file": "plugins/com.sony.cdp.plugin.test-framework/www/main.js",
        "id": "com.sony.cdp.plugin.test-framework.main"
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-cdp-nativebridge": "1.1.0-dev",
    "com.sony.cdp.plugin.nativebridge.tests": "1.0.1",
    "com.sony.cdp.plugin.test-framework": "1.0.1-dev-cdp"
}
// BOTTOM OF METADATA
});
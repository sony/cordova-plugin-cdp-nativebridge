cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.sony.cdp.plugin.nativebridge/www/cdp.plugin.nativebridge.js",
        "id": "com.sony.cdp.plugin.nativebridge.NativeBridge",
        "clobbers": [
            "CDP.Plugin.NativeBridge"
        ]
    },
    {
        "file": "plugins/com.sony.cdp.plugin.nativebridge.tests/tests.js",
        "id": "com.sony.cdp.plugin.nativebridge.tests.tests"
    },
    {
        "file": "plugins/org.apache.cordova.test-framework/www/tests.js",
        "id": "org.apache.cordova.test-framework.cdvtests"
    },
    {
        "file": "plugins/org.apache.cordova.test-framework/www/jasmine_helpers.js",
        "id": "org.apache.cordova.test-framework.jasmine_helpers"
    },
    {
        "file": "plugins/org.apache.cordova.test-framework/www/medic.js",
        "id": "org.apache.cordova.test-framework.medic"
    },
    {
        "file": "plugins/org.apache.cordova.test-framework/www/main.js",
        "id": "org.apache.cordova.test-framework.main"
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.sony.cdp.plugin.nativebridge": "0.0.1",
    "com.sony.cdp.plugin.nativebridge.tests": "0.0.1",
    "org.apache.cordova.test-framework": "0.0.2-dev"
}
// BOTTOM OF METADATA
});
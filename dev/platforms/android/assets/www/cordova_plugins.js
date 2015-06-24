cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.sony.cdp.plugin.nativebridge.tests/www/tests.js",
        "id": "com.sony.cdp.plugin.nativebridge.tests.tests"
    },
    {
        "file": "plugins/com.sony.cdp.plugin.nativebridge/www/cdp.plugin.nativebridge.js",
        "id": "com.sony.cdp.plugin.nativebridge.NativeBridge",
        "clobbers": [
            "CDP.Plugin.NativeBridge"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.sony.cdp.plugin.nativebridge.tests": "1.0.0",
    "com.sony.cdp.plugin.nativebridge": "1.0.0"
}
// BOTTOM OF METADATA
});
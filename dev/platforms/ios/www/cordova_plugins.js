cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
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
    "org.apache.cordova.test-framework": "0.0.2-dev"
}
// BOTTOM OF METADATA
});
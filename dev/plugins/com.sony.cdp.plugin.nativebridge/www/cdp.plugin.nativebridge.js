/// <reference path="../../../../../../modules/include/cordova.d.ts" />
/// <reference path="NativeBridge/Interfaces.ts" />
var CDP;
(function (CDP) {
    var Plugin;
    (function (Plugin) {
        /**
         * @class NativeBridge
         * @brief Native Bridge の主クラス
         */
        var NativeBridge = (function () {
            function NativeBridge() {
            }
            return NativeBridge;
        })();
        Plugin.NativeBridge = NativeBridge;
    })(Plugin = CDP.Plugin || (CDP.Plugin = {}));
})(CDP || (CDP = {}));
/// <reference path="NativeBridge.ts" />
/// <reference path="CDP/Plugin/Include.ts" />
module.exports = CDP.Plugin.NativeBridge;

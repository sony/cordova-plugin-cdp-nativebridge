/// <reference path="../../modules/include/require.d.ts" />
/// <reference path="../../modules/include/cdp.lazyload.d.ts" />

(function (root, factory) {
	if (typeof define === "function" && define.amd) {
		// AMD
		define(["cdp.promise"], function () {
			return factory(root.CDP || (root.CDP = {}));
		});
	} else {
		// Browser globals
		factory(root.CDP || (root.CDP = {}));
	}
} (this, function (CDP) {
	CDP.NativeBridge = CDP.NativeBridge || {};

	//<<
	// モジュールスクリプトの遅延ロード
	CDP.lazyLoad("lazy-module-cdp.nativebridge");
	//>>

	return CDP.NativeBridge;
}));

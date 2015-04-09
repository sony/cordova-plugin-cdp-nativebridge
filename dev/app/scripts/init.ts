/// <reference path="../modules/include/frameworks.d.ts" />
/// <reference path="../scripts/app.ts" />

module NativeBridgeDevBed {
	var setup = (callback: Function): void => {
		var global = global || window;
		if (null != global.orientation) {
			require(["cordova"], () => {
				callback();
			});
		} else {
			setTimeout(() => {
				callback();
			});
		}
	};

	setup(() => {
		require(["cdp.ui.jqm"], () => {
			require(["cdp.nativebridge"],() => {
				CDP.Framework.initialize().done(() => {
					// lazy load for application scripts.
					CDP.lazyLoad("lazy");
					NativeBridgeDevBed.onStart();
				});
			});
		});
	});
}

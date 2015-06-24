/// <reference path="../modules/include/frameworks.d.ts" />

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
		require(["cdp.framework.jqm"], () => {
			CDP.Framework.initialize().done(() => {
				require(["app"], (app: any) => {
					app.main();
				});
			});
		});
	});
}

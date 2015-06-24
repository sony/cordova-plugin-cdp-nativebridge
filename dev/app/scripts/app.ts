/// <reference path="../modules/include/frameworks.d.ts" />


module NativeBridgeDevBed {

	import global = CDP.global;

	function onStart(): void {
		var router = CDP.Framework.Router;
		router.register("", "/templates/main.html", true);
		router.start();
	}

	define("app", [
		"cdp.nativebridge",
		"hogan",
		"cdp.ui.jqm",
	], () => {
		var CordovaSampleDevBed = global.CordovaSampleDevBed;

		//<<
		CDP.lazyLoad("lazy");
		//>>

		return { main: onStart };
	});
}

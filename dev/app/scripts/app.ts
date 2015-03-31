/// <reference path="../modules/include/frameworks.d.ts" />


module NativeBridgeDevBed {

	export function onStart(info?: any): void {
		var router = CDP.Framework.Router;
		// set first page.
		router.register("", "/templates/main.html", true);
		// start Router.
		router.start();
	}
}

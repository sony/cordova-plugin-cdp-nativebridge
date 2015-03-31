/// <reference path="../modules/include/frameworks.d.ts" />


module NativeBridgeDevBed {

	/**
	 * Application start function.
	 *  The function expects all necessary .js scripts are loaded before the function is called.
	 *  "info" can be used when application needs to initialize parameter defined in init.ts if needed.
	 */
	export function onStart(info?: any): void {
		var router = CDP.Framework.Router;
		// set first page.
		router.register("", "/templates/main.html", true);
		/*
		>>>>ATELIERMARKUP>>>>
		<TYPE>ROUTER_ENTRY</TYPE>
		<BASEDIR>app</BASEDIR>
		<TEMPLATE>
		router.register("{{pageName}}(/:query)", "/{{htmlPath}}", {{#top}}true{{/top}}{{^top}}false{{/top}});//pageName={{pageName}}
		</TEMPLATE>
		<INSERT>*/
		/*</INSERT>
		<<<<ATELIERMARKUP<<<<
		*/
		// start Router.
		router.start();
	}
}

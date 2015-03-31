/// <reference path="../modules/include/frameworks.d.ts" />

module Config {

	var global = global || window;

	var baseUrl = /(.+\/)[^/]*#[^/]+/.exec(location.href); // "#" がある場合
	if (!baseUrl) {
		baseUrl = /(.+\/)/.exec(location.href); // "#" がない場合。 query parametersは使用不可
	}

	/**
	 * require.js 用設定値
	 */
	var requireConfig = {
		baseUrl: baseUrl[1],

		urlArgs: "bust=" + Date.now(),

		paths: {
			// external modules
			"jquery": "modules/jquery/scripts/jquery",
			"jquery.mobile": "modules/jquery/scripts/jquery.mobile",
			"underscore": "modules/underscore/scripts/underscore",
			"backbone": "modules/backbone/scripts/backbone",
			"i18n": "modules/i18next/scripts/i18next",
			"hogan": "modules/hogan/scripts/hogan",
			"modernizr.custom": "modules/sony/cdp/scripts/modernizr.custom",
			"sylvester": "modules/sylvester/scripts/sylvester",
			"iscroll": "modules/iscroll/scripts/iscroll-probe",
			"flipsnap": "modules/flipsnap/scripts/flipsnap",
			/*
			>>>>ATELIERMARKUP>>>>
			<TYPE>MODULE_ENTRY</TYPE>
			<BASEDIR>app</BASEDIR>
			<TEMPLATE>
			"{{moduleName}}": "{{modulePath}}",
			</TEMPLATE>
			<INSERT>*/
			/*</INSERT>
			<<<<ATELIERMARKUP<<<<
			*/

			// cdp modules
			"cdp.core": "modules/sony/cdp/scripts/cdp.core",
			"cdp.lazyload": "modules/sony/cdp/scripts/cdp.lazyload",

			// cdp framework modules
			"cdp.framework.jqm": "modules/sony/cdp/scripts/cdp.framework.jqm",

			// cdp optional modules
			"cdp.tools": "modules/sony/cdp/scripts/cdp.tools",
			"cdp.tools.proxy": "modules/sony/cdp/scripts/cdp.tools.proxy",
			"cdp.tools.container": "modules/sony/cdp/scripts/cdp.tools.container",
			"cdp.ui.listview": "modules/sony/cdp/scripts/cdp.ui.listview",
			"cdp.ui.jqm": "modules/sony/cdp/scripts/cdp.ui.jqm",
			"cdp.ui.fs": "modules/sony/cdp/scripts/cdp.ui.fs",

			// cdp functinal modules
			"cdp.slideshow": "modules/sony/cdp/scripts/cdp.slideshow",

			// internal lib modules
		},

		shim: {
			/*
			>>>>ATELIERMARKUP>>>>
			<TYPE>MODULE_SHIM_ENTRY</TYPE>
			<TEMPLATE>
			"{{moduleName}}": {
				{{#deps}}"deps": {{{deps}}},{{/deps}}
				{{#exports}}"exports": "{{exports}}",{{/exports}}
			},
			</TEMPLATE>
			<INSERT>*/
			/*</INSERT>
			<<<<ATELIERMARKUP<<<<
			*/
		},
	};
	// global export
	global.requirejs = requireConfig;

	/**
	 * jQuery の設定
	 */
	export function jquery(): void {
		$.support.cors = true;			// cross domain request を許可
		$.ajaxSetup({ cache: false });	// ajax の cache を無効化
	}

	/**
	 * jQuery Mobile の設定
	 */
	export function jquerymobile(): void {
		$.mobile.allowCrossDomainPages = true;
		$.mobile.defaultPageTransition = "none";
		$.mobile.hashListeningEnabled = false;				// backbone.js の Router を使用
		$.mobile.pushStateEnabled = false;
		// 以下は既定値
		$.mobile.autoInitializePage = true;					// $.mobile.initializePage() を明示的に指定する場合 false
		$.mobile.phonegapNavigationEnabled = false;			// jqm 内では cordova.app.back は使用しない
	}

	/**
	 * ローカライズ用データパスの設定
	 */
	export function i18nDataPath(): string {
		return "res/locales/__ns__-__lng__.json";
	}

	/**
	 * CDP.lazyLoad() の sourceURL 自動挿入時に、
	 * domain を指定しない場合には false を指定
	 * .ts ファイルの debug をメインにするときには有用
	 */
	export var autoDomainAssign = true;

	/**
	 * コンフリクトを避けるために使用される文字列
	 * CDP.Tools.Touche の touch event 定義に使用される
	 */
	export var namespace = "cdp.";

	/**
	 * ビルド設定判定
	 *
	 * リリース版では '%% buildsetting %%' を '' (空文字列) に置換することにより
	 *   !!("") (== false)
	 * の設定が反映される
	 */
	export var DEBUG = ():boolean => {
		return !!("%% buildsetting %%");	//! リリース時には false が返る
	}
}

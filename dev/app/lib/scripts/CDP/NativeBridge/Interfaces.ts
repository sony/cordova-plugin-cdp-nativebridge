/// <reference path="../../../../modules/include/cdp.tools.d.ts" />
/// <reference path="../../../../plugins/com.sony.cdp.plugin.nativebridge/www/cdp.plugin.nativebridge.d.ts" />

module CDP {
	export module NativeBridge {

		import IPromise = CDP.Tools.IPromise;
		import Plugin = CDP.Plugin.NativeBridge;

		/**
		 * @interface Feature
		 * @brief 機能情報
		 */
		export interface Feature extends Plugin.Feature { }

		/**
		 * @interface ConstructOptions
		 * @brief 初期化に指定するオプション
		 */
		export interface ConstructOptions extends Plugin.ConstructOptions { }

		/**
		 * @interface IResult
		 * @brief NativeBridge の基底 Result 情報
		 */
		export interface IResult extends Plugin.IResult { }

		/**
		 * @interface ExecOptions
		 * @brief exec() に渡すオプション
		 */
		export interface ExecOptions extends Plugin.ExecOptions { }

		/**
		 * @interface Promise
		 * @brief NativeBridge が扱う Promise オブジェクトの定義
		 */
		export interface Promise extends IPromise<IResult> { }
	}
}

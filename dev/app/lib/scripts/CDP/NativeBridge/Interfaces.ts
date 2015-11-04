/// <reference path="../../../../modules/include/cdp.promise.d.ts" />
/// <reference path="../../../../plugins/com.sony.cdp.plugin.nativebridge/www/cdp.plugin.nativebridge.d.ts" />

module CDP {
	export module NativeBridge {

		import IPromise = CDP.IPromise;
		import Plugin = CDP.Plugin.NativeBridge;

		/**
		 * \~english
		 * @interface Feature
		 * @brief feature information.
		 *
		 * \~japanese
		 * @interface Feature
		 * @brief 機能情報
		 */
		export interface Feature extends Plugin.Feature { }

		/**
		 * \~english
		 * @interface ConstructOptions
		 * @brief NativeBridge class's consrtruction options.
		 *
		 * \~japanese
		 * @interface ConstructOptions
		 * @brief 初期化に指定するオプション
		 */
		export interface ConstructOptions extends Plugin.ConstructOptions { }

		/**
		 * \~english
		 * @interface IResult
		 * @brief NativeBridge base result information.
		 *
		 * \~japanese
		 * @interface IResult
		 * @brief NativeBridge の基底 Result 情報
		 */
		export interface IResult extends Plugin.IResult { }

		/**
		 * \~english
		 * @interface ExecOptions
		 * @brief exec() method options.
		 *
		 * \~japanese
		 * @interface ExecOptions
		 * @brief exec() に渡すオプション
		 */
		export interface ExecOptions extends Plugin.ExecOptions { }

		/**
		 * \~english
		 * @interface Promise
		 * @brief Cancelable promise interface utilized from jquery promise.
		 *
		 * \~japanese
		 * @interface Promise
		 * @brief NativeBridge が扱う Promise オブジェクトの定義
		 */
		export interface Promise extends IPromise<IResult> { }
	}
}

/// <reference path="jquery.d.ts" />

declare module CDP {
	/**
	 * \~english
	 * Global object in system.
	 * This property is Window object regularly.
	 *
	 * \~japanese
	 * システムの global オブジェクトにアクセス
	 * 通常は Window オブジェクトとなる
	 */
	var global: any;

	/**
	 * \~english
	 * Initialization function of environment.
	 *
	 * \~japanese
	 * Framework の初期化関数
	 *
	 * @param options {Object} [in] TBD.
	 */
	function initialize(options?: any): JQueryPromise<any>;

	/**
	 * \~english
	 * Web root location.
	 *
	 * \~japanese
	 * Web root location にアクセス
	 */
	var webRoot: string;
}

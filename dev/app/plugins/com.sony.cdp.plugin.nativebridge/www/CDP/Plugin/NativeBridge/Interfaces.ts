/// <reference path="../../../../../../modules/include/cordova.d.ts" />

/**
 * @file Interfaces.ts
 * @brief interface 宣言ファイル
 *
 *        [Note]
 *        export module NativeBridge 宣言を行っている。
 *        このモジュール宣言から javascript が実体化されると、
 *        ルートの NativeBridge クラスとコンフリクトを起こし Build Error となる。
 *
 *        TODO: 同一ファイルにない場合は class NativeBridge 側のメンバスコープがおかしくなる。
 *              削除候補
 */

module CDP {
	export module Plugin {
		export module _NativeBridge {
			/**
			 * @interface IResult
			 * @brief NativeBridge result interface.
			 */
			export interface IResult {
				code: number;
				message?: string;
				name?: string;
			}
		}
	}
}

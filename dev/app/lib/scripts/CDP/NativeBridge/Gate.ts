/// <reference path="../../../../modules/include/cdp.tools.d.ts" />
/// <reference path="../../../../plugins/com.sony.cdp.plugin.nativebridge/www/cdp.plugin.nativebridge.d.ts" />

module CDP {
	export module NativeBridge {

		var TAG: string = "[CDP.NativeBridge.Gate] ";

		/**
		 * @class Gate
		 * @brief Native Bridge の基底クラス
		 *        このクラスから任意の Bridge クラスを派生して実装可能
		 */
		export class Gate {
			/**
			 * constructor
			 *
			 */
			constructor() {
				// TODO:
			}
		}
	}
}

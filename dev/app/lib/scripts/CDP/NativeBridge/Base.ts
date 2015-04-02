/// <reference path="../../../../modules/include/cdp.tools.d.ts" />
/// <reference path="../../../../plugins/com.sony.cdp.plugin.nativebridge/www/cdp.plugin.nativebridge.d.ts" />

module CDP {
	export module NativeBridge {

		/**
		 * @class Base
		 * @brief Native Bridge の基底クラス
		 *        このクラスから任意の Bridge クラスを派生して実装可能
		 */
		export class Base {
			/**
			 * constructor
			 *
			 */
			constructor() {
				// TODO: test
				var hoge = new CDP.Plugin.NativeBridge({
					name: "Hoge",
					android: {
						packageInfo: "com.sony.cdp.hoge.Hoge",
					},
					ios: {
						packageInfo: "NBPHoge",
					}
				});
				var a: CDP.Plugin.NativeBridge.ExecInfo;
			}
		}
	}
}

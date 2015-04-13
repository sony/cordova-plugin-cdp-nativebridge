/// <reference path="../../modules/include/frameworks.d.ts" />

module NativeBridgeDevBed {
	export module NativeBridge {

		import Promise = CDP.NativeBridge.Promise;

		var TAG: string = "[NativeBridgeDevBed.NativeBridge.ScrollBar] ";

		/**
		 * @class ScrollBar
		 * @brief Native Scroll Bar をコントロールするブリッジクラス
		 */
		export class ScrollBar extends CDP.NativeBridge.Gate {
			/**
			 * constructor
			 *
			 */
			constructor() {
				super({
					name: "ScrollBar",
					android: {
						packageInfo: "com.sony.cdp.sample.ScrollBar",
					},
					ios: {
						packageInfo: "CNPScrollBar",
					},
				});
			}

			///////////////////////////////////////////////////////////////////////
			// public methods

			/**
			 * Vertical ScrollBar の 表示
			 */
			public showVertical(): Promise {
				return super.exec("showVertical", <any>arguments);
			}

			/**
			 * Vertical ScrollBar の 表示
			 */
			public hideVertical(): Promise {
				return super.exec("hideVertical", <any>arguments);
			}
		}
	}
}

/// <reference path="../../modules/include/frameworks.d.ts" />
/// <reference path="../../lib/scripts/cdp.nativebridge.d.ts" />

module NativeBridgeDevBed {
	export module View {

		import Framework = CDP.Framework;
		import UI = CDP.UI;

		var TAG: string = "[NativeBridgeDevBed.View.Menu] ";

		/**
		 * @class Menu
		 * @brief Menu View クラス
		 *        TODO: このファイルは削除
		 */
		class Menu extends UI.PageView<Backbone.Model> {

			/**
			 * constructor
			 */
			constructor() {
				super("/templates/menu.html", "page-devbed-menu", { route: "menu" });
			}

			///////////////////////////////////////////////////////////////////////
			// Override: UI.PageView

			//! jQM event: "pagebeforeshow" に対応
			onInitialize(event: JQueryEventObject): void {
				super.onInitialize(event);

				// test
				debugger;
				var test = CDP.NativeBridge.ERROR_INVALID_OPERATION;
				CDP.NativeBridge.ERROR_INVALID_OPERATION = 99;
				var test2 = CDP.NativeBridge.ERROR_INVALID_OPERATION;
			}
		}

		var menuView = new Menu();
	}
}

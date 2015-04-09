/// <reference path="../../modules/include/frameworks.d.ts" />

module NativeBridgeDevBed {
	export module View {

		import Framework = CDP.Framework;
		import UI = CDP.UI;

		var TAG: string = "[NativeBridgeDevBed.View.Menu] ";

		/**
		 * @class Menu
		 * @brief Menu View クラス
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
			}
		}

		var menuView = new Menu();
	}
}

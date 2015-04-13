/// <reference path="../../modules/include/frameworks.d.ts" />

module NativeBridgeDevBed {
	export module View {

		import Framework = CDP.Framework;
		import UI = CDP.UI;

		var TAG: string = "[NativeBridgeDevBed.View.NativeScrollBar] ";

		/**
		 * @class NativeScrollBar
		 * @brief Native ScrollBar 確認用 View クラス
		 */
		class NativeScrollBar extends UI.PageView<Backbone.Model> {

			/**
			 * constructor
			 */
			constructor() {
				super("/templates/native-scrollbar.html", "page-devbed-native-scrollbar", { route: "native-scrollbar" });
			}

			///////////////////////////////////////////////////////////////////////
			// Override: UI.PageView

			//! jQM event: "pagebeforeshow" に対応
			onPageBeforeShow(event: JQueryEventObject, data?: Framework.ShowEventData): void {
				super.onPageBeforeShow(event, data);
			}

			//! jQM event: "pagebeforehide" に対応
			onPageBeforeHide(event: JQueryEventObject, data?: Framework.HideEventData): void {
				super.onPageBeforeHide(event, data);
			}

		}

		var nativeScrollBarView = new NativeScrollBar();
	}
}

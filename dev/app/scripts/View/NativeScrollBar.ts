/// <reference path="../../modules/include/frameworks.d.ts" />
/// <reference path="../NativeBridge/ScrollBar.ts" />

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

            private _scrollBar: NativeBridge.ScrollBar;

            /**
             * constructor
             */
            constructor() {
                super("/templates/native-scrollbar.html", "page-devbed-native-scrollbar", { route: "native-scrollbar" });
            }

            ///////////////////////////////////////////////////////////////////////
            // Override: UI.PageView

            //! jQM event: "pagebeforeshow" に対応
            onInitialize(event: JQueryEventObject): void {
                super.onInitialize(event);
                this._scrollBar = new NativeBridge.ScrollBar();
            }

            //! jQM event: "pageshow" に対応
            onPageShow(event: JQueryEventObject, data?: Framework.ShowEventData): void {
                super.onPageShow(event, data);
                this._scrollBar.showVertical();
            }

            //! Router "before route change" ハンドラ
            onBeforeRouteChange(): JQueryPromise<any> {
                return this._scrollBar.hideVertical();
            }
        }

        var nativeScrollBarView = new NativeScrollBar();

/*
        // TODO: 削除 test
        debugger;
        var TestGate = (<any>CDP.NativeBridge.Gate).extend({
            constructor: function (options) {
                CDP.NativeBridge.Gate.call(this, {
                    name: "ScrollBar",
                    android: {
                        packageInfo: "com.sony.cdp.sample.ScrollBar",
                    },
                });
            },

            showVertical: function () {
                CDP.NativeBridge.Gate.prototype.exec.call("showVertical", <any>arguments);
            },

            hideVertical: function () {
                var df = $.Deferred<void>();
                CDP.NativeBridge.Gate.prototype.exec.call("hideVertical", <any>arguments)
                    .always(() => {
                        df.resolve();
                    });
                return df.promise();
            },
        });

        var testGate = new TestGate();
*/
    }
}

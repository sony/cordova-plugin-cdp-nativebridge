/// <reference path="../../modules/include/frameworks.d.ts" />

module NativeBridgeDevBed {
    export module View {

        import Framework = CDP.Framework;
        import UI = CDP.UI;

        var TAG: string = "[NativeBridgeDevBed.View.Main] ";

        /**
         * @class Main
         * @brief Main View クラス
         */
        class Main extends UI.PageView<Backbone.Model> {

            private _$autoTestFrame: JQuery;

            /**
             * constructor
             */
            constructor() {
                super("/templates/main.html", "page-devbed-main", { route: "main" });
                Framework.Router.register("menu", "/templates/menu.html");
            }

            ///////////////////////////////////////////////////////////////////////
            // Override: UI.PageView

            //! jQM event: "pagebeforeshow" に対応
            onInitialize(event: JQueryEventObject): void {
                super.onInitialize(event);
                this._$autoTestFrame = $("#auto-tests");
                this._$autoTestFrame.attr("src", Framework.toUrl("cdvtests/index.html"));
            }
        }

        var mainView = new Main();
    }
}

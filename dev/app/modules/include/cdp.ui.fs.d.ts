/// <reference path="jquery.d.ts" />
/// <reference path="flipsnap.d.ts" />
/// <reference path="cdp.ui.jqm.d.ts" />
declare module CDP {
    module UI {
        /**
         * @class SmoothScroll
         * @brief Provide smooth page scroll function.
         *        NOTE: current version supported 'horizontal' only.
         */
        class SmoothScroll {
            private static _defaultOptions;
            private static PAGE_CLASS_NAME;
            private static PAGE_CLASS_SELECTOR;
            private static DATA_PAGE_READY;
            private static DATA_PAGE_INDEX;
            private static DATA_ELEMENT_INDEX;
            private static DATA_ELEMENT_READY;
            private _settings;
            private _$container;
            private _resizeTimerId;
            private _hiddenTimerId;
            private _profile;
            private _inPaging;
            /**
             * init
             * Lazy construction method.
             *
             * @param {String} container id.
             * @param {Number} element max count.
             * @param {Object} options Option object.
             */
            init(containerId: string, count: number, options?: any): boolean;
            /**
             * valid
             * Validate this SmoothScroll object
             *
             */
            valid(): boolean;
            /**
             * page next with animation.
             * NOTE: current version supported "horizontal" only.
             *
             */
            pageNext(): void;
            /**
             * page previous with animation.
             * NOTE: current version supported 'horizontal' only.
             *
             */
            pagePrevious(): void;
            /**
             * check page next enable.
             * NOTE: current version supported 'horizontal' only.
             *
             * @return true: can op / false: cannot.
             */
            canPageNext(): boolean;
            /**
             * check page previous enable.
             * NOTE: current version supported 'horizontal' only.
             *
             * @return true: can op / false: cannot.
             */
            canPagePrevious(): boolean;
            /**
             * get element count.
             *
             * @return {Number} number of elements.
             */
            getElementCount(): number;
            /**
             * get element by index.
             *
             * @param  {Number} index.
             * @return {Object} jQuery object.
             */
            getElement(index: number): JQuery;
            /**
             * set focus class.
             * enable if set focusClass in init method.
             *
             * @param  {Number} index.
             * @param  {boolean} index.
             */
            setFocus(index: number, exclusive?: boolean): void;
            /**
             * ensure visibility index element.
             * NOTE: current version supported 'horizontal' only.
             *
             * @param  {Number} index.
             */
            ensureVisible(index: number): void;
            /**
             * notify element setup status.
             *
             * @param  {Number} index.
             */
            setElementStatus(index: number, succeeded: boolean): void;
            /**
             * set settings for update, after init() called.
             *
             * @param {Object} options Option object.
             */
            setSettings(options: any): void;
            /**
             * prepare all elements.
             * NOTE: current version supported 'horizontal' only.
             *
             * @private
             */
            private prepareElements();
            /**
             * create elements.
             *
             * @private
             */
            private createElement(className, index);
            /**
             * create page.
             *
             * @private
             */
            private createPage(index);
            /**
             * clear page div.
             *
             * @private
             */
            private clearPage();
            /**
             * setup page div.
             * NOTE: current version supported 'horizontal' only.
             *
             * @private
             */
            private setupPage();
            /**
             * scroll core logic.
             * NOTE: current version supported 'horizontal' only.
             *
             * @param {Number} scroll position.
             * @param {Boolean} true: animation / false : non animation.
             * @param {Number} element index if known.
             * @private
             */
            private scroll(pos, animation, index?);
            /**
             * animate scroll
             * NOTE: current version supported "horizontal" only.
             *
             * @param {Number} scroll position.
             * @private
             */
            private animateScroll(pos);
            /**
             * set page visibility.
             * prepare page data [prev|current|next].
             *
             * @param {Number} visible element index
             * @private
             */
            private setPageVisibility(elementIndex);
            /**
             * set page visibility by scroll position.
             * prepare page data [prev|current|next].
             *
             * @param {Number} scroll position
             * @private
             */
            private setPageVisibilityByPosition(pos);
            /**
             * prepare page data.
             *
             * @param {Number} visible element index
             * @private
             */
            private preparePageData($page);
        }
    }
}
declare module CDP {
    module UI {
        /**
         * @class Console
         * @brief 拡張コンソール出力 UI を作成, 管理するクラス
         */
        class DeviceConsole implements Console {
            private static s_console;
            private static s_instance;
            private static s_$display;
            private static s_line;
            /**
             * 拡張コンソール出力を有効にする
             *
             * @param {String} selector [in] jQuery に指定可能なセレクタ
             */
            static show(selector?: string): void;
            /**
             * 拡張コンソール出力を無効にし、既定の振る舞いに戻す。
             *
             */
            static hide(): void;
            /**
             * 拡張コンソール出力の有効/無効切り替え
             *
             * @param {String} selector [in] jQuery に指定可能なセレクタ
             */
            static toggle(selector?: string): void;
            /**
             * 拡張コンソール出力を無効にし、完全にオブジェクトを破棄する。
             *
             * TODO: 調査必要
             * remove を呼ぶと、jquery.mobile のイベントを受けられなくなるかも。
             */
            static destroy(): void;
            /**
             * 拡張コンソール出力の有効・無効判定
             *
             * @return {Boolean} true: 有効 / false: 無効
             */
            static visible(): boolean;
            /**
             * 行数を指定する
             *
             * @param {Number} lines [in] 行数
             */
            static setLineNumber(line: number): void;
            static output(message: string, kind?: string): void;
            static clearMessage(): void;
            count(countTitle?: string): void;
            groupEnd(): void;
            time(timerName?: string): void;
            timeEnd(timerName?: string): void;
            trace(): void;
            group(groupTitle?: string): void;
            dirxml(value: any): void;
            debug(message?: string, ...optionalParams: any[]): void;
            groupCollapsed(groupTitle?: string): void;
            select(element: Element): void;
            info(message?: any, ...optionalParams: any[]): void;
            profile(reportName?: string): void;
            assert(test?: boolean, message?: string, ...optionalParams: any[]): void;
            msIsIndependentlyComposed(element: Element): boolean;
            clear(): void;
            dir(value?: any, ...optionalParams: any[]): void;
            warn(message?: any, ...optionalParams: any[]): void;
            error(message?: any, ...optionalParams: any[]): void;
            log(message?: any, ...optionalParams: any[]): void;
            profileEnd(): void;
        }
    }
}
declare module CDP {
    module UI {
        import Framework = CDP.Framework;
        /**
         * @interface PageTabListViewConstructOptions
         * @brief ScrollManager の初期化情報を格納するインターフェイスクラス
         */
        interface PageTabListViewConstructOptions<TModel extends Backbone.Model> extends PageListViewConstructOptions<TModel> {
            tabCount: number;
        }
        /**
         * @class PageTabListView
         * @brief タブ切り替え機能を持つ PageListView クラス
         */
        class PageTabListView<TModel extends Backbone.Model> extends PageView<TModel> implements IListView {
            private _listviews;
            private _needRebuild;
            private _activeTabIndex;
            private _flipsnap;
            private _flipEndEventHandler;
            private _flipMoveEventHandler;
            private _refreshTimerId;
            private _$contentsHolder;
            /**
             * constructor
             *
             * @param url     {String}                        [in] page template に使用する URL
             * @param id      {String}                        [in] page に振られた ID
             * @param options {PageViewConstructOptions} [in] オプション
             */
            constructor(url: string, id: string, options: PageTabListViewConstructOptions<TModel>);
            onOrientationChanged(newOrientation: Framework.Orientation): void;
            onBeforeRouteChange(): JQueryPromise<any>;
            onPageBeforeShow(event: JQueryEventObject, data?: Framework.ShowEventData): void;
            onPageShow(event: JQueryEventObject, data?: Framework.ShowEventData): void;
            getActiveTabIndex(): number;
            setActiveTab(index: number, transitionDuration?: number, initial?: boolean): boolean;
            onFlipTabChanged(newIndex: number): void;
            onTabChanged(newIndex: number): void;
            resetTabPosition(): void;
            isInitialized(): boolean;
            /**
             * 登録
             * プロパティを指定して、ListItem を管理
             *
             * @param height      {Number}   [in] ラインの高さ
             * @param initializer {LineView} [in] LineView 派生クラスのコンストラクタ
             * @param info        {Object}   [in] initializer に渡されるオプション引数
             * @param insertTo    {Number}   [in] ラインの挿入位置をインデックスで指定
             */
            addItem(height: number, initializer: new (options?: any) => BaseListItemView, info: any, insertTo?: number, tabIndex?: number): void;
            removeItem(index: number, size?: number, delay?: number, tabIndex?: number): void;
            getItemInfo(target: number, tabIndex?: number): any;
            getItemInfo(target: JQueryEventObject, tabIndex?: number): any;
            refresh(tabIndex?: number): void;
            update(tabIndex?: number): void;
            rebuild(tabIndex?: number): void;
            release(tabIndex?: number): void;
            backup(key: string, tabIndex?: number): boolean;
            restore(key: string, reserveRebuile?: boolean, tabIndex?: number): boolean;
            hasBackup(key: string, tabIndex?: number): boolean;
            clearBackup(key?: string, tabIndex?: number): boolean;
            backupData: any;
            getBackupData(tabIndex: number): any;
            setScrollHandler(handler: (event: JQueryEventObject) => void, on: boolean): void;
            setScrollStopHandler(handler: (event: JQueryEventObject) => void, on: boolean): void;
            getScrollPos(): number;
            getScrollPosMax(): number;
            scrollTo(pos: number, animate?: boolean, time?: number): void;
            ensureVisible(index: number, options?: EnsureVisibleOptions): void;
            getScrollMapHeight(): number;
            updateScrollMapHeight(delta: number): void;
            updateProfiles(from: number): void;
            getScrollMapElement(): JQuery;
            findRecycleElements(): JQuery;
            getListViewOptions(): ListViewOptions;
            private setFlipsnapCondition();
            private resetFlipsnapCondition();
            private preprocess();
            private postprocess();
            private validTab(index);
            private _targets(index, primaryActive);
            private _activeview;
            private getPageBaseHeight();
        }
    }
}



(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["cdp.ui.jqm"], function () {
            return factory(root.CDP || (root.CDP = {}));
        });
    }
    else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}));
    }
}(this, function (CDP) {
    CDP.UI = CDP.UI || {};
    
/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        /**
         * @class SmoothScroll
         * @brief Provide smooth page scroll function.
         *        NOTE: current version supported 'horizontal' only.
         */
        var SmoothScroll = (function () {
            function SmoothScroll() {
                this._settings = null;
                this._$container = null;
                this._resizeTimerId = 0;
                this._hiddenTimerId = 0;
                this._profile = null;
                this._inPaging = false;
            }
            /**
             * init
             * Lazy construction method.
             *
             * @param {String} container id.
             * @param {Number} element max count.
             * @param {Object} options Option object.
             */
            SmoothScroll.prototype.init = function (containerId, count, options) {
                var _this = this;
                if (!containerId || !count || count <= 0) {
                    console.log("error. invalid arg");
                    return false;
                }
                // setup settings
                this._settings = $.extend({}, SmoothScroll._defaultOptions, options);
                this._settings.containerId = containerId;
                this._settings.count = count;
                if ("horizontal" !== this._settings.orientation) {
                    console.log("error. unsupported orientation. orientation: " + this._settings.orientation);
                    return false;
                }
                if (this._$container) {
                    this._$container.children().remove();
                }
                $(window).resize(function () {
                    clearTimeout(_this._resizeTimerId);
                    _this._resizeTimerId = setTimeout(function () {
                        var oldIndex = _this._profile.lastEnsureVisbleElementIndex;
                        _this.clearPage();
                        _this.setupPage();
                        if (!!_this._settings.ensureVisibleOnResize) {
                            _this.setPageVisibility(oldIndex);
                        }
                    }, 200);
                });
                this.prepareElements();
                return this.setupPage();
            };
            /**
             * valid
             * Validate this SmoothScroll object
             *
             */
            SmoothScroll.prototype.valid = function () {
                return !!this._$container;
            };
            /**
             * page next with animation.
             * NOTE: current version supported "horizontal" only.
             *
             */
            SmoothScroll.prototype.pageNext = function () {
                if (!this.valid()) {
                    console.log("error. not to be initialized.");
                    return;
                }
                var pos = this._$container.scrollLeft() + this._profile.pageSize;
                this.scroll(pos, true);
            };
            /**
             * page previous with animation.
             * NOTE: current version supported 'horizontal' only.
             *
             */
            SmoothScroll.prototype.pagePrevious = function () {
                if (!this.valid()) {
                    console.log("error. not to be initialized.");
                    return;
                }
                var pos = this._$container.scrollLeft() - this._profile.pageSize;
                this.scroll(pos, true);
            };
            /**
             * check page next enable.
             * NOTE: current version supported 'horizontal' only.
             *
             * @return true: can op / false: cannot.
             */
            SmoothScroll.prototype.canPageNext = function () {
                if (!this.valid()) {
                    return false;
                }
                var pos = this._$container.scrollLeft() + $(window).width();
                if (this._profile.scrollMapSize <= $(window).width() || this._profile.scrollMapSize <= pos) {
                    return false;
                }
                return true;
            };
            /**
             * check page previous enable.
             * NOTE: current version supported 'horizontal' only.
             *
             * @return true: can op / false: cannot.
             */
            SmoothScroll.prototype.canPagePrevious = function () {
                if (!this.valid()) {
                    return false;
                }
                var pos = this._$container.scrollLeft();
                if (0 === pos) {
                    return false;
                }
                return true;
            };
            /**
             * get element count.
             *
             * @return {Number} number of elements.
             */
            SmoothScroll.prototype.getElementCount = function () {
                if (!this.valid()) {
                    return 0;
                }
                return this._settings.count;
            };
            /**
             * get element by index.
             *
             * @param  {Number} index.
             * @return {Object} jQuery object.
             */
            SmoothScroll.prototype.getElement = function (index) {
                if (!this.valid()) {
                    return null;
                }
                if (index < 0 || this._settings.count <= index) {
                    console.log("error. invalid index. : " + index);
                    return null;
                }
                return this._$container.find("div[" + SmoothScroll.DATA_ELEMENT_INDEX + "='" + index + "']");
            };
            /**
             * set focus class.
             * enable if set focusClass in init method.
             *
             * @param  {Number} index.
             * @param  {boolean} index.
             */
            SmoothScroll.prototype.setFocus = function (index, exclusive) {
                if (exclusive === void 0) { exclusive = true; }
                if (!this.valid() || !this._settings.focusClass) {
                    return;
                }
                if (exclusive) {
                    this._$container.find("." + this._settings.elementClass).removeClass(this._settings.focusClass);
                }
                this.getElement(index).addClass(this._settings.focusClass);
            };
            /**
             * ensure visibility index element.
             * NOTE: current version supported 'horizontal' only.
             *
             * @param  {Number} index.
             */
            SmoothScroll.prototype.ensureVisible = function (index) {
                if (!this.valid()) {
                    return;
                }
                if (index < 0 || this._settings.count <= index) {
                    console.log("error. invalid index. : " + index);
                    return null;
                }
                var absPos = this._profile.elementWidth * index;
                var scrollPos = absPos - this._profile.ensureBase;
                this.scroll(scrollPos, false, index);
            };
            /**
             * notify element setup status.
             *
             * @param  {Number} index.
             */
            SmoothScroll.prototype.setElementStatus = function (index, succeeded) {
                if (!this.valid()) {
                    return;
                }
                var $element = this._$container.find("div[" + SmoothScroll.DATA_ELEMENT_INDEX + "='" + index + "']");
                if (succeeded) {
                    $element.attr(SmoothScroll.DATA_ELEMENT_READY, "true");
                }
                else {
                    $element.parent().attr(SmoothScroll.DATA_PAGE_READY, "false");
                }
            };
            /**
             * set settings for update, after init() called.
             *
             * @param {Object} options Option object.
             */
            SmoothScroll.prototype.setSettings = function (options) {
                this._settings = $.extend({}, this._settings, options);
            };
            /**
             * prepare all elements.
             * NOTE: current version supported 'horizontal' only.
             *
             * @private
             */
            SmoothScroll.prototype.prepareElements = function () {
                var _this = this;
                this._$container = $("#" + this._settings.containerId);
                for (var i = 0; i < this._settings.count; i++) {
                    this._$container.append(this.createElement(this._settings.elementClass, i));
                }
                this._$container.scroll(function (event) {
                    if (!_this._inPaging) {
                        _this.setPageVisibilityByPosition(_this._$container.scrollLeft());
                        if (typeof _this._settings.onScrollEnd === "function") {
                            _this._settings.onScrollEnd(_this._$container.scrollTop(), _this._$container.scrollLeft());
                        }
                    }
                });
            };
            /**
             * create elements.
             *
             * @private
             */
            SmoothScroll.prototype.createElement = function (className, index) {
                var _this = this;
                var element = "<div class='" + className + "' " + SmoothScroll.DATA_ELEMENT_INDEX + "='" + index + "' " + SmoothScroll.DATA_ELEMENT_READY + "='false'></div>";
                var $element = $(element);
                if (typeof this._settings.onClickElement === "function") {
                    $element.on("click", function () {
                        _this._settings.onClickElement(index, $element);
                    });
                }
                if (typeof this._settings.onTouchStartElement === "function") {
                    $element.on("touchstart MSPointerDown", function () {
                        _this._settings.onTouchStartElement(index, $element);
                    });
                }
                if (typeof this._settings.onTouchEndElement === "function") {
                    $element.on("touchend MSPointerUp", function () {
                        _this._settings.onTouchEndElement(index, $element);
                    });
                }
                return $element;
            };
            /**
             * create page.
             *
             * @private
             */
            SmoothScroll.prototype.createPage = function (index) {
                var page = "<div class='" + SmoothScroll.PAGE_CLASS_NAME + "' " + SmoothScroll.DATA_PAGE_INDEX + "='" + index + "' " + SmoothScroll.DATA_PAGE_READY + "='false'></div>";
                var $page = $(page);
                var cssProperties = {
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    display: "inline-block",
                    visibility: "hidden",
                };
                $page.css(cssProperties);
                return $page;
            };
            /**
             * clear page div.
             *
             * @private
             */
            SmoothScroll.prototype.clearPage = function () {
                var $pages = this._$container.find(SmoothScroll.PAGE_CLASS_SELECTOR);
                $pages.children().unwrap();
            };
            /**
             * setup page div.
             * NOTE: current version supported 'horizontal' only.
             *
             * @private
             */
            SmoothScroll.prototype.setupPage = function () {
                var containerWidth = this._$container.parent().width() - (parseInt(this._$container.css("margin-left"), 10) + parseInt(this._$container.css("margin-right"), 10));
                var $elements = this._$container.find("." + this._settings.elementClass);
                var elementWidth = $elements.first().width() + parseInt($elements.first().css("margin-left"), 10) + parseInt($elements.first().css("margin-right"), 10) + parseInt($elements.first().css("padding-left"), 10) + parseInt($elements.first().css("padding-right"), 10) + parseInt($elements.first().css("border-left-width"), 10) + parseInt($elements.first().css("border-right-width"), 10);
                if (containerWidth <= 0 || elementWidth <= 0) {
                    console.log("error. invalid width.");
                    return false;
                }
                var elementsAllWidth = elementWidth * this._settings.count;
                var pageNum = Math.ceil(elementsAllWidth / containerWidth);
                var pageElementNum = Math.floor(containerWidth / elementWidth);
                while (pageNum * pageElementNum < this._settings.count) {
                    pageNum++;
                }
                var i = 0, start = 0, end = 0;
                for (i = 0; i < pageNum; i++) {
                    start = i * pageElementNum;
                    end = start + pageElementNum;
                    if (this._settings.count < end) {
                        end = this._settings.count;
                    }
                    var $target = $elements.slice(start, end);
                    $target.wrapAll(this.createPage(i));
                }
                // cache profile.
                this._$container.width(containerWidth);
                this._profile = {};
                this._profile.scrollMapSize = elementsAllWidth;
                this._profile.elementWidth = elementWidth;
                this._profile.pageNum = pageNum;
                this._profile.pageElementNum = pageElementNum;
                this._profile.pageSize = pageElementNum * elementWidth;
                this._profile.ensureBase = Math.floor(containerWidth * this._settings.ensureBaseRacio / elementWidth) * elementWidth;
                this._profile.lastEnsureVisbleElementIndex = 0;
                return true;
            };
            /**
             * scroll core logic.
             * NOTE: current version supported 'horizontal' only.
             *
             * @param {Number} scroll position.
             * @param {Boolean} true: animation / false : non animation.
             * @param {Number} element index if known.
             * @private
             */
            SmoothScroll.prototype.scroll = function (pos, animation, index) {
                if (animation) {
                    this.animateScroll(pos);
                }
                else {
                    this._$container.scrollLeft(pos);
                    if (typeof this._settings.onScrollEnd === "function") {
                        this._settings.onScrollEnd(this._$container.scrollTop(), this._$container.scrollLeft());
                    }
                }
                if (null != index) {
                    this.setPageVisibility(index);
                }
                else {
                    this.setPageVisibilityByPosition(pos);
                }
            };
            /**
             * animate scroll
             * NOTE: current version supported "horizontal" only.
             *
             * @param {Number} scroll position.
             * @private
             */
            SmoothScroll.prototype.animateScroll = function (pos) {
                var _this = this;
                this._inPaging = true;
                var complete = function () {
                    _this._inPaging = false;
                    if (typeof _this._settings.onScrollEnd === "function") {
                        _this._settings.onScrollEnd(_this._$container.scrollTop(), _this._$container.scrollLeft());
                    }
                };
                this._$container.animate({ scrollLeft: pos }, {
                    speed: this._settings.scrollSpeed,
                    easing: "linear",
                    complete: complete,
                });
            };
            /**
             * set page visibility.
             * prepare page data [prev|current|next].
             *
             * @param {Number} visible element index
             * @private
             */
            SmoothScroll.prototype.setPageVisibility = function (elementIndex) {
                var _this = this;
                if (elementIndex < 0) {
                    elementIndex = 0;
                }
                var $currentPage = this._$container.find("div[" + SmoothScroll.DATA_ELEMENT_INDEX + "='" + elementIndex + "']").parent();
                var currentPageIndex = parseInt($currentPage.attr(SmoothScroll.DATA_PAGE_INDEX), 10);
                var $prevPage = null, $nextPage = null;
                var pageIndex = 0;
                var i = 0;
                this._profile.lastEnsureVisbleElementIndex = elementIndex;
                var hiddenIndexPrev = null, hiddenIndexNext = null;
                if (0 < currentPageIndex) {
                    for (i = 0, pageIndex = currentPageIndex - 1; i < this._settings.preloadCount; i++, pageIndex--) {
                        if (pageIndex < 0) {
                            break;
                        }
                        hiddenIndexPrev = pageIndex;
                        $prevPage = this._$container.find("div[" + SmoothScroll.DATA_PAGE_INDEX + "='" + pageIndex + "']");
                        $prevPage.css("visibility", "visible");
                        this.preparePageData($prevPage);
                    }
                }
                $currentPage.css("visibility", "visible");
                this.preparePageData($currentPage);
                if (currentPageIndex < this._profile.pageNum - 1) {
                    for (i = 0, pageIndex = currentPageIndex + 1; i < this._settings.preloadCount; i++, pageIndex++) {
                        if (this._profile.pageNum - 1 < pageIndex) {
                            break;
                        }
                        hiddenIndexNext = pageIndex + 1;
                        $nextPage = this._$container.find("div[" + SmoothScroll.DATA_PAGE_INDEX + "='" + pageIndex + "']");
                        $nextPage.css("visibility", "visible");
                        this.preparePageData($nextPage);
                    }
                }
                // hidden with post scroll end.
                if (typeof hiddenIndexPrev === "number" || typeof hiddenIndexNext === "number") {
                    clearTimeout(this._hiddenTimerId);
                    this._hiddenTimerId = setTimeout(function () {
                        if (typeof hiddenIndexPrev === "number") {
                            _this._$container.children().slice(0, hiddenIndexPrev).css("visibility", "hidden");
                        }
                        if (typeof hiddenIndexNext === "number") {
                            _this._$container.children().slice(hiddenIndexNext, _this._profile.pageNum).css("visibility", "hidden");
                        }
                    }, this._settings.scrollSpeed);
                }
            };
            /**
             * set page visibility by scroll position.
             * prepare page data [prev|current|next].
             *
             * @param {Number} scroll position
             * @private
             */
            SmoothScroll.prototype.setPageVisibilityByPosition = function (pos) {
                var elementIndex = Math.floor(pos / this._profile.elementWidth);
                this.setPageVisibility(elementIndex);
            };
            /**
             * prepare page data.
             *
             * @param {Number} visible element index
             * @private
             */
            SmoothScroll.prototype.preparePageData = function ($page) {
                var _this = this;
                var ready = $page.attr(SmoothScroll.DATA_PAGE_READY);
                if ("false" === ready && typeof this._settings.onSetElement === "function") {
                    $page.attr(SmoothScroll.DATA_PAGE_READY, "true");
                    var $target = $page.find("div[" + SmoothScroll.DATA_ELEMENT_READY + "='false']");
                    $target.each(function (index, element) {
                        var globalIndex = parseInt($(element).attr(SmoothScroll.DATA_ELEMENT_INDEX), 10);
                        _this._settings.onSetElement(globalIndex, $(element));
                    });
                }
            };
            SmoothScroll._defaultOptions = {
                orientation: "horizontal",
                elementClass: "cdp-smooth-page-element",
                focusClass: null,
                preloadCount: 1,
                scrollSpeed: 250,
                ensureBaseRacio: 0.25,
                ensureVisibleOnResize: true,
                onSetElement: null,
                onClickElement: null,
                onTouchStartElement: null,
                onTouchEndElement: null,
                onScrollEnd: null,
            };
            SmoothScroll.PAGE_CLASS_NAME = "cdp-smooth-page";
            SmoothScroll.PAGE_CLASS_SELECTOR = ".cdp-smooth-page";
            SmoothScroll.DATA_PAGE_READY = "data-page-ready";
            SmoothScroll.DATA_PAGE_INDEX = "data-page-index";
            SmoothScroll.DATA_ELEMENT_INDEX = "data-element-index";
            SmoothScroll.DATA_ELEMENT_READY = "data-element-ready";
            return SmoothScroll;
        })();
        UI.SmoothScroll = SmoothScroll;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));

var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        /**
         * @class Console
         * @brief 拡張コンソール出力 UI を作成, 管理するクラス
         */
        var DeviceConsole = (function () {
            function DeviceConsole() {
            }
            /**
             * 拡張コンソール出力を有効にする
             *
             * @param {String} selector [in] jQuery に指定可能なセレクタ
             */
            DeviceConsole.show = function (selector) {
                if (selector === void 0) { selector = "cdp-device-console"; }
                this.hide();
                if (!DeviceConsole.s_console) {
                    DeviceConsole.s_console = window.console;
                }
                if (!DeviceConsole.s_instance) {
                    DeviceConsole.s_instance = new DeviceConsole();
                }
                window.console = DeviceConsole.s_instance;
                if (!DeviceConsole.s_$display) {
                    DeviceConsole.s_$display = $("<div id='" + selector + "'></div>");
                    DeviceConsole.s_$display.appendTo($(document.body));
                    $(document).on("pagebeforeshow", function () {
                        if (DeviceConsole.visible()) {
                            DeviceConsole.s_$display.appendTo($(document.body));
                            DeviceConsole.s_$display.scrollTop(DeviceConsole.s_$display[0].scrollHeight);
                        }
                    });
                }
                else {
                    DeviceConsole.s_$display.css("visibility", "visible");
                }
            };
            /**
             * 拡張コンソール出力を無効にし、既定の振る舞いに戻す。
             *
             */
            DeviceConsole.hide = function () {
                if (DeviceConsole.s_console) {
                    window.console = DeviceConsole.s_console;
                }
                if (DeviceConsole.s_$display) {
                    DeviceConsole.s_$display.css("visibility", "hidden");
                    DeviceConsole.clearMessage();
                }
                DeviceConsole.s_instance = null;
            };
            /**
             * 拡張コンソール出力の有効/無効切り替え
             *
             * @param {String} selector [in] jQuery に指定可能なセレクタ
             */
            DeviceConsole.toggle = function (selector) {
                if (selector === void 0) { selector = "pmo-device-console"; }
                if (DeviceConsole.visible()) {
                    DeviceConsole.hide();
                }
                else {
                    DeviceConsole.show(selector);
                }
            };
            /**
             * 拡張コンソール出力を無効にし、完全にオブジェクトを破棄する。
             *
             * TODO: 調査必要
             * remove を呼ぶと、jquery.mobile のイベントを受けられなくなるかも。
             */
            DeviceConsole.destroy = function () {
                DeviceConsole.hide();
                if (DeviceConsole.s_$display) {
                    DeviceConsole.s_$display.remove();
                    DeviceConsole.s_$display = null;
                }
            };
            /**
             * 拡張コンソール出力の有効・無効判定
             *
             * @return {Boolean} true: 有効 / false: 無効
             */
            DeviceConsole.visible = function () {
                return null != DeviceConsole.s_instance;
            };
            /**
             * 行数を指定する
             *
             * @param {Number} lines [in] 行数
             */
            DeviceConsole.setLineNumber = function (line) {
                DeviceConsole.s_line = line;
            };
            //! 出力
            DeviceConsole.output = function (message, kind) {
                // [iOS] DOM 操作による preventDefault を避けるための setTimeout 処理
                setTimeout(function () {
                    if (DeviceConsole.s_$display) {
                        if (DeviceConsole.s_line <= DeviceConsole.s_$display.children().length) {
                            DeviceConsole.s_$display.children().first().remove();
                        }
                        var tag = (null != kind) ? "<p class='" + kind + "'>" : "<p>";
                        DeviceConsole.s_$display.append(tag + message + "</p>");
                        setTimeout(function () {
                            DeviceConsole.s_$display.scrollTop(DeviceConsole.s_$display[0].scrollHeight);
                        }, 1);
                    }
                }, 1);
            };
            //! message の破棄
            DeviceConsole.clearMessage = function () {
                if (DeviceConsole.s_$display) {
                    DeviceConsole.s_$display.children().remove();
                }
            };
            //___________________________________________________________________________________________________________________//
            DeviceConsole.prototype.count = function (countTitle) {
                if (DeviceConsole.s_console) {
                    DeviceConsole.s_console.count(countTitle);
                }
            };
            DeviceConsole.prototype.groupEnd = function () {
                if (DeviceConsole.s_console) {
                    DeviceConsole.s_console.groupEnd();
                }
            };
            DeviceConsole.prototype.time = function (timerName) {
                if (DeviceConsole.s_console) {
                    DeviceConsole.s_console.time(timerName);
                }
            };
            DeviceConsole.prototype.timeEnd = function (timerName) {
                if (DeviceConsole.s_console) {
                    DeviceConsole.s_console.timeEnd(timerName);
                }
            };
            DeviceConsole.prototype.trace = function () {
                if (DeviceConsole.s_console) {
                    DeviceConsole.s_console.trace();
                }
            };
            DeviceConsole.prototype.group = function (groupTitle) {
                if (DeviceConsole.s_console) {
                    DeviceConsole.s_console.group(groupTitle);
                }
            };
            DeviceConsole.prototype.dirxml = function (value) {
                if (DeviceConsole.s_console) {
                    DeviceConsole.s_console.dirxml(value);
                }
            };
            DeviceConsole.prototype.debug = function (message) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                if (DeviceConsole.s_console) {
                    if (0 < optionalParams.length) {
                        DeviceConsole.s_console.debug(message, optionalParams);
                    }
                    else {
                        DeviceConsole.s_console.debug(message);
                    }
                }
                DeviceConsole.output("[debug]" + message, "debug");
            };
            DeviceConsole.prototype.groupCollapsed = function (groupTitle) {
                if (DeviceConsole.s_console) {
                    DeviceConsole.s_console.groupCollapsed(groupTitle);
                }
            };
            DeviceConsole.prototype.select = function (element) {
                if (DeviceConsole.s_console) {
                    DeviceConsole.s_console.select(element);
                }
            };
            DeviceConsole.prototype.info = function (message) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                if (DeviceConsole.s_console) {
                    if (0 < optionalParams.length) {
                        DeviceConsole.s_console.info(message, optionalParams);
                    }
                    else {
                        DeviceConsole.s_console.info(message);
                    }
                }
                DeviceConsole.output("[info]" + message, "info");
            };
            DeviceConsole.prototype.profile = function (reportName) {
                if (DeviceConsole.s_console) {
                    DeviceConsole.s_console.profile(reportName);
                }
            };
            DeviceConsole.prototype.assert = function (test, message) {
                var optionalParams = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    optionalParams[_i - 2] = arguments[_i];
                }
                if (DeviceConsole.s_console) {
                    if (0 < optionalParams.length) {
                        DeviceConsole.s_console.assert(test, message, optionalParams);
                    }
                    else {
                        DeviceConsole.s_console.assert(test, message);
                    }
                }
                DeviceConsole.output("[assert]" + message, "assert");
            };
            DeviceConsole.prototype.msIsIndependentlyComposed = function (element) {
                if (DeviceConsole.s_console) {
                    return DeviceConsole.s_console.msIsIndependentlyComposed(element);
                }
                return false;
            };
            DeviceConsole.prototype.clear = function () {
                if (DeviceConsole.s_console) {
                    DeviceConsole.s_console.clear();
                }
            };
            DeviceConsole.prototype.dir = function (value) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                if (DeviceConsole.s_console) {
                    if (0 < optionalParams.length) {
                        DeviceConsole.s_console.dir(value, optionalParams);
                    }
                    else {
                        DeviceConsole.s_console.dir(value);
                    }
                }
            };
            DeviceConsole.prototype.warn = function (message) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                if (DeviceConsole.s_console) {
                    if (0 < optionalParams.length) {
                        DeviceConsole.s_console.warn(message, optionalParams);
                    }
                    else {
                        DeviceConsole.s_console.warn(message);
                    }
                }
                DeviceConsole.output("[warn]" + message, "warn");
            };
            DeviceConsole.prototype.error = function (message) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                if (DeviceConsole.s_console) {
                    if (0 < optionalParams.length) {
                        DeviceConsole.s_console.error(message, optionalParams);
                    }
                    else {
                        DeviceConsole.s_console.error(message);
                    }
                }
                DeviceConsole.output("[error]" + message, "error");
            };
            DeviceConsole.prototype.log = function (message) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                if (DeviceConsole.s_console) {
                    if (0 < optionalParams.length) {
                        DeviceConsole.s_console.log(message, optionalParams);
                    }
                    else {
                        DeviceConsole.s_console.log(message);
                    }
                }
                DeviceConsole.output(message);
            };
            DeviceConsole.prototype.profileEnd = function () {
                if (DeviceConsole.s_console) {
                    DeviceConsole.s_console.profileEnd();
                }
            };
            DeviceConsole.s_console = null;
            DeviceConsole.s_instance = null;
            DeviceConsole.s_$display = null;
            DeviceConsole.s_line = 100;
            return DeviceConsole;
        })();
        UI.DeviceConsole = DeviceConsole;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));


var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.PageTabListView] ";
        var _Config;
        (function (_Config) {
            _Config.SCROLL_MAP_CLASS = "listview-scroll-map";
            _Config.SCROLL_MAP_SELECTOR = "." + _Config.SCROLL_MAP_CLASS;
            _Config.FLIPSNAP_CLASS = "flipsnap";
            _Config.FLIPSNAP_SELECTOR = "." + _Config.FLIPSNAP_CLASS;
            _Config.FRIPSNAP_REFRESH_COEFF = 1.0; //!< flipsnap 切り替え時に duration に対して更新を行う係数
        })(_Config || (_Config = {}));
        /**
         * @class PageTabListView
         * @brief タブ切り替え機能を持つ PageListView クラス
         */
        var PageTabListView = (function (_super) {
            __extends(PageTabListView, _super);
            /**
             * constructor
             *
             * @param url     {String}                        [in] page template に使用する URL
             * @param id      {String}                        [in] page に振られた ID
             * @param options {PageViewConstructOptions} [in] オプション
             */
            function PageTabListView(url, id, options) {
                var _this = this;
                _super.call(this, url, id, $.extend({}, { showNativeScrollBar: true }, options));
                this._listviews = []; //!< scroll コアロジック
                this._needRebuild = []; //!< ページ表示時に rebuild() をコールするための内部変数
                this._activeTabIndex = 0; //!< active tab
                this._flipsnap = null; //!< flipsnap オブジェクト
                this._flipEndEventHandler = null; //!< "fstouchend"
                this._flipMoveEventHandler = null; //!< "fstouchmove"
                this._refreshTimerId = null; //!< refresh() 反映確認用
                this._$contentsHolder = null; //!< contents holder
                for (var i = 0, n = options.tabCount; i < n; i++) {
                    this._listviews.push(new UI.ScrollManager(options));
                    this._needRebuild.push(false);
                }
                this._flipEndEventHandler = function (event) {
                    var fsEvent = event.originalEvent;
                    if (fsEvent.moved) {
                        _this.onFlipTabChanged(fsEvent.newPoint);
                    }
                };
                this._flipMoveEventHandler = function (event) {
                    var fsEvent = event.originalEvent;
                    if ((-1 === fsEvent.direction && 0 === _this._activeTabIndex) || (1 === fsEvent.direction && _this._activeTabIndex === _this._listviews.length - 1)) {
                        event.preventDefault();
                        _this._flipsnap.moveToPoint(fsEvent.newPoint);
                    }
                    else {
                        _this.preprocess();
                    }
                };
            }
            ///////////////////////////////////////////////////////////////////////
            // Override: PageView
            //! Orientation の変更検知
            PageTabListView.prototype.onOrientationChanged = function (newOrientation) {
                var _this = this;
                this._listviews.forEach(function (listview) {
                    listview.setBaseHeight(_this.getPageBaseHeight());
                });
                if (null != this._refreshTimerId) {
                    clearTimeout(this._refreshTimerId);
                }
                if (this._flipsnap) {
                    (function () {
                        var proc = function () {
                            // リトライ
                            if (_this._flipsnap && _this._flipsnap.maxPoint !== _this._listviews.length) {
                                _this._flipsnap.refresh();
                                _this._refreshTimerId = setTimeout(proc, _this.getListViewOptions().scrollMapRefreshInterval);
                            }
                            else {
                                _this._refreshTimerId = null;
                            }
                        };
                        _this._flipsnap.refresh();
                        _this._refreshTimerId = setTimeout(proc, _this.getListViewOptions().scrollMapRefreshInterval);
                    })();
                }
            };
            //! ページ遷移直前イベント処理
            PageTabListView.prototype.onBeforeRouteChange = function () {
                this.resetFlipsnapCondition();
                this._listviews.forEach(function (listview) {
                    listview.destroy();
                });
                this._$contentsHolder = null;
                return _super.prototype.onBeforeRouteChange.call(this);
            };
            //! jQM event: "pagebeforeshow" に対応
            PageTabListView.prototype.onPageBeforeShow = function (event, data) {
                var _this = this;
                _super.prototype.onPageBeforeShow.call(this, event, data);
                var $maps = this.$page.find(_Config.SCROLL_MAP_SELECTOR);
                if ($maps.length === this._listviews.length) {
                    this._listviews.forEach(function (listview, index) {
                        listview.initialize($($maps[index]), _this.getPageBaseHeight());
                    });
                    this._$contentsHolder = this.$page.find(_Config.FLIPSNAP_SELECTOR).parent();
                }
                else {
                    console.error(TAG + "data size miss match. [$maps:" + $maps.length + "][tabs:" + this._listviews.length + "]");
                }
            };
            //! jQM event: "pagecontainershow" (旧:"pageshow") に対応
            PageTabListView.prototype.onPageShow = function (event, data) {
                _super.prototype.onPageShow.call(this, event, data);
                this.setFlipsnapCondition();
                for (var i = 0, n = this._needRebuild.length; i < n; i++) {
                    if (this._needRebuild[i]) {
                        this.rebuild(i);
                    }
                    this._needRebuild[i] = false;
                }
            };
            ///////////////////////////////////////////////////////////////////////
            // Override: ScrollTabPageView
            //! アクティブなタブ Index を取得
            PageTabListView.prototype.getActiveTabIndex = function () {
                return this._activeTabIndex;
            };
            //! アクティブ Tab を設定
            PageTabListView.prototype.setActiveTab = function (index, transitionDuration, initial) {
                var _this = this;
                if (initial || (this._activeTabIndex !== index && this.validTab(index))) {
                    // 遷移前に scroll 位置の view を更新
                    this.preprocess();
                    this._activeTabIndex = index;
                    this._flipsnap.moveToPoint(this._activeTabIndex, transitionDuration);
                    // 遷移後に listview の状態を変更
                    transitionDuration = transitionDuration || parseInt(this._flipsnap.transitionDuration, 10);
                    setTimeout(function () {
                        _this.postprocess();
                        _this.onTabChanged(_this._activeTabIndex);
                    }, transitionDuration * _Config.FRIPSNAP_REFRESH_COEFF);
                    return true;
                }
                else {
                    return false;
                }
            };
            //! flip 終了時にコールされる
            PageTabListView.prototype.onFlipTabChanged = function (newIndex) {
                this.setActiveTab(newIndex);
            };
            //! タブ切り替え時にコールされる. setActiveTab() を行ってもコールされる
            PageTabListView.prototype.onTabChanged = function (newIndex) {
                // noop.
            };
            //! タブポジションの初期化
            PageTabListView.prototype.resetTabPosition = function () {
                this._listviews.forEach(function (listview) {
                    listview.scrollTo(0, false, 0);
                    listview.refresh();
                });
                this.setActiveTab(0, 0, true);
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: ScrollManager Profile 管理
            //! 初期化済みか判定
            PageTabListView.prototype.isInitialized = function () {
                return this._activeview.isInitialized();
            };
            /**
             * 登録
             * プロパティを指定して、ListItem を管理
             *
             * @param height      {Number}   [in] ラインの高さ
             * @param initializer {LineView} [in] LineView 派生クラスのコンストラクタ
             * @param info        {Object}   [in] initializer に渡されるオプション引数
             * @param insertTo    {Number}   [in] ラインの挿入位置をインデックスで指定
             */
            PageTabListView.prototype.addItem = function (height, initializer, info, insertTo, tabIndex) {
                var _this = this;
                this._targets(tabIndex, true).forEach(function (listview) {
                    listview._addLine(new UI.LineProfile(listview, Math.floor(height), initializer, $.extend({}, info, { owner: _this })), insertTo);
                });
            };
            //! 指定したラインを解除
            PageTabListView.prototype.removeItem = function (index, size, delay, tabIndex) {
                this._targets(tabIndex, true).forEach(function (listview) {
                    listview.removeItem(index, size, delay);
                });
            };
            PageTabListView.prototype.getItemInfo = function (target, tabIndex) {
                var info;
                this._targets(tabIndex, true).forEach(function (listview) {
                    info = listview.getItemInfo(target);
                });
                return info;
            };
            //! アクティブページを更新
            PageTabListView.prototype.refresh = function (tabIndex) {
                this._targets(tabIndex, true).forEach(function (listview) {
                    listview.refresh();
                });
            };
            //! 未アサインページを構築
            PageTabListView.prototype.update = function (tabIndex) {
                this._targets(tabIndex, true).forEach(function (listview) {
                    listview.update();
                });
                this._$contentsHolder.height(this._activeview.getScrollMapHeight());
            };
            //! ページアサインを再構成
            PageTabListView.prototype.rebuild = function (tabIndex) {
                this._targets(tabIndex, true).forEach(function (listview) {
                    listview.rebuild();
                });
                this._$contentsHolder.height(this._activeview.getScrollMapHeight());
            };
            //! 管轄データを破棄
            PageTabListView.prototype.release = function (tabIndex) {
                this._targets(tabIndex, true).forEach(function (listview) {
                    listview.release();
                });
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: ScrollManager Backup / Restore
            //! 内部データをバックアップ
            PageTabListView.prototype.backup = function (key, tabIndex) {
                var retval = true;
                this._targets(tabIndex, false).forEach(function (listview) {
                    var ret = listview.backup(key);
                    if (!ret) {
                        retval = false;
                    }
                });
                return retval;
            };
            //! 内部データをリストア
            PageTabListView.prototype.restore = function (key, reserveRebuile, tabIndex) {
                var _this = this;
                if (reserveRebuile === void 0) { reserveRebuile = false; }
                var retval = true;
                var _restore = function (index, reserve) {
                    var ret = _this._listviews[i].restore(key, reserveRebuile);
                    if (ret) {
                        _this._needRebuild[i] = reserve;
                    }
                    else {
                        retval = false;
                    }
                };
                if (null == tabIndex) {
                    for (var i = 0, n = this._listviews.length; i < n; i++) {
                        _restore(i, reserveRebuile);
                    }
                }
                else if (this.validTab(tabIndex)) {
                    _restore(tabIndex, reserveRebuile);
                }
                else {
                    retval = false;
                }
                return retval;
            };
            //! バックアップデータの有無
            PageTabListView.prototype.hasBackup = function (key, tabIndex) {
                var retval = false;
                this._targets(tabIndex, false).forEach(function (listview) {
                    var ret = listview.hasBackup(key);
                    if (ret) {
                        retval = true;
                    }
                });
                return retval;
            };
            //! バックアップデータの破棄
            PageTabListView.prototype.clearBackup = function (key, tabIndex) {
                var retval = true;
                this._targets(tabIndex, false).forEach(function (listview) {
                    var ret = listview.clearBackup(key);
                    if (!ret) {
                        retval = false;
                    }
                });
                return retval;
            };
            Object.defineProperty(PageTabListView.prototype, "backupData", {
                //! バックアップデータにアクセス
                get: function () {
                    return this._activeview.backupData;
                },
                enumerable: true,
                configurable: true
            });
            //! バックアップデータにアクセス
            PageTabListView.prototype.getBackupData = function (tabIndex) {
                var backupData;
                this._targets(tabIndex, true).forEach(function (listview) {
                    backupData = listview.backupData;
                });
                return backupData;
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: ScrollManager Scroll
            //! スクロールイベントハンドラ設定/解除
            PageTabListView.prototype.setScrollHandler = function (handler, on) {
                this._activeview.setScrollHandler(handler, on);
            };
            //! スクロール終了イベントハンドラ設定/解除
            PageTabListView.prototype.setScrollStopHandler = function (handler, on) {
                this._activeview.setScrollStopHandler(handler, on);
            };
            //! スクロール位置を取得
            PageTabListView.prototype.getScrollPos = function () {
                return this._activeview.getScrollPos();
            };
            //! スクロール位置の最大値を取得
            PageTabListView.prototype.getScrollPosMax = function () {
                return this._activeview.getScrollPosMax();
            };
            //! スクロール位置を指定
            PageTabListView.prototype.scrollTo = function (pos, animate, time) {
                this._activeview.scrollTo(pos, animate, time);
            };
            //! 指定された LineView の表示を保証
            PageTabListView.prototype.ensureVisible = function (index, options) {
                this._activeview.ensureVisible(index, options);
            };
            ///////////////////////////////////////////////////////////////////////
            // implements: IListViewFramework:
            //! Scroll Map の高さを取得
            PageTabListView.prototype.getScrollMapHeight = function () {
                return this._activeview.getScrollMapHeight();
            };
            //! Scroll Map の高さを更新. framework が使用する.
            PageTabListView.prototype.updateScrollMapHeight = function (delta) {
                this._activeview.updateScrollMapHeight(delta);
            };
            //! 内部 Profile の更新. framework が使用する.
            PageTabListView.prototype.updateProfiles = function (from) {
                this._activeview.updateProfiles(from);
            };
            //! Scroll Map Element を取得. framework が使用する.
            PageTabListView.prototype.getScrollMapElement = function () {
                return this._activeview.getScrollMapElement();
            };
            //! リサイクル可能な Element を取得. framework が使用する.
            PageTabListView.prototype.findRecycleElements = function () {
                return this._activeview.findRecycleElements();
            };
            //! ListViewOptions を取得. framework が使用する.
            PageTabListView.prototype.getListViewOptions = function () {
                return this._activeview.getListViewOptions();
            };
            ///////////////////////////////////////////////////////////////////////
            // private method:
            //! flipsnap 環境設定
            PageTabListView.prototype.setFlipsnapCondition = function () {
                this._flipsnap = Flipsnap(_Config.FLIPSNAP_SELECTOR, {});
                $(this._flipsnap.element).on("fstouchend", _.bind(this._flipEndEventHandler, this));
                $(this._flipsnap.element).on("fstouchmove", _.bind(this._flipMoveEventHandler, this));
                this.setActiveTab(this._activeTabIndex, 0, true);
            };
            //! flipsnap 環境破棄
            PageTabListView.prototype.resetFlipsnapCondition = function () {
                $(this._flipsnap.element).off("fstouchmove", _.bind(this._flipMoveEventHandler, this));
                $(this._flipsnap.element).off("fstouchend", _.bind(this._flipEndEventHandler, this));
                this._flipsnap = null;
            };
            //! Tab 切り替えの前処理
            PageTabListView.prototype.preprocess = function () {
                var _this = this;
                this._listviews.forEach(function (listview, index) {
                    if (index !== _this._activeTabIndex) {
                        listview.treatScrollPosition();
                    }
                });
            };
            //! Tab 切り替えの後処理
            PageTabListView.prototype.postprocess = function () {
                var _this = this;
                this._$contentsHolder.height(this._activeview.getScrollMapHeight());
                this._listviews.forEach(function (listview, index) {
                    if (index === _this._activeTabIndex) {
                        listview.setActiveState(true);
                    }
                    else {
                        listview.setActiveState(false);
                    }
                });
            };
            //! Tab Index を検証
            PageTabListView.prototype.validTab = function (index) {
                if (0 <= index && index < this._listviews.length) {
                    return true;
                }
                else {
                    console.error(TAG + "invalid tab index. index: " + index);
                    return false;
                }
            };
            //! 操作対象 ScrollManager を取得
            PageTabListView.prototype._targets = function (index, primaryActive) {
                if (null == index) {
                    if (primaryActive) {
                        return [this._activeview];
                    }
                    else {
                        return this._listviews;
                    }
                }
                else if (this.validTab(index)) {
                    return [this._listviews[index]];
                }
                else {
                    return [];
                }
            };
            Object.defineProperty(PageTabListView.prototype, "_activeview", {
                //! アクティブなタブ ScrollManager を取得
                get: function () {
                    return this._listviews[this._activeTabIndex];
                },
                enumerable: true,
                configurable: true
            });
            //! ページの基準値を取得
            PageTabListView.prototype.getPageBaseHeight = function () {
                return $(window).height() - parseInt(this.$page.css("padding-top"), 10);
            };
            return PageTabListView;
        })(UI.PageView);
        UI.PageTabListView = PageTabListView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));

    return CDP.UI;
}));

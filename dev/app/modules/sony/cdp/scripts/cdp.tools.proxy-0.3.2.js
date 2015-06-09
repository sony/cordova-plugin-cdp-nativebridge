

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        // uxtc butter.js を使用する場合、sylvester は不要
        define(["jquery", "sylvester"], function () {
            return factory(root.CDP || (root.CDP = {}));
        });
    }
    else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}));
    }
}(this, function (CDP) {
    CDP.Tools = CDP.Tools || {};
    

/* tslint:disable:max-line-length */
// TODO: butter.js (sylvester.js) があるときは使い、ない場合はfallbackするように修正する
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var TAG = "[CDP.Tools.CSS] ";
        /**
         * @class CSS
         * @brief JavaScript で CSS を操作するときに使用するユーティリティクラス
         */
        var CSS = (function () {
            function CSS() {
            }
            Object.defineProperty(CSS, "is3dSupported", {
                ///////////////////////////////////////////////////////////////////////
                // public static methods
                get: function () {
                    if (null == CSS._is3dSupported) {
                        CSS._is3dSupported = CSS.has3d();
                    }
                    return CSS._is3dSupported;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSS, "isTransitionSupported", {
                get: function () {
                    if (null == CSS._isTransitionSupported) {
                        CSS._isTransitionSupported = CSS.supportsTransitions();
                    }
                    return CSS._isTransitionSupported;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSS, "transitionEnd", {
                /**
                 * "transitionend" のイベント名配列を返す
                 *
                 * @return {Array} transitionend イベント名
                 */
                get: function () {
                    return "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSS, "cssPrefixes", {
                /**
                 * css の vender 拡張 prefix を返す
                 *
                 * @return {Array} prefix
                 */
                get: function () {
                    return ["-webkit-", "-moz-", "-ms-", "-o-", ""];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSS, "cssHideBackFace", {
                get: function () {
                    return {
                        "-webkit-backface-visibility": "hidden",
                        "-moz-backface-visibility": "hidden",
                        "-ms-backface-visibility": "hidden",
                        "-o-backface-visibility": "hidden",
                        "backface-visibility": "hidden"
                    };
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Build css property string for scale and translate.
             *
             * @param  {Number} scale: scaling value, by using same value for x y coordinate.
             * @param  {Number} traslateX: x translate value, unit is pixel.
             * @param  {Number} traslateY: y translate value, unit is pixel.
             * @return {String} ex): "scale3d(1.5,1.5,1.0) translate3d(10px,20px,0px)"
             */
            CSS.buildCssTransformString = function (scale, traslateX, translateY) {
                return CSS.buildCssScaleString(scale) + " " + CSS.buildCssTranslateString(traslateX, translateY);
            };
            /**
             * Build css property string for scale.
             *
             * @param  {Number} scale: scaling value, by using same value for x y coordinate.
             * @return {String} ex): "scale3d(1.5,1.5,1.0)"
             */
            CSS.buildCssScaleString = function (scale) {
                if (CSS.is3dSupported) {
                    return "scale3d(" + scale + "," + scale + ",1.0)";
                }
                else {
                    return "scale(" + scale + "," + scale + ")";
                }
            };
            /**
             * Build css property string for translate.
             *
             * @param  {Number} traslateX: x translate value, unit is pixel.
             * @param  {Number} traslateY: y translate value, unit is pixel.
             * @return {String} ex): "translate3d(10px,20px,0px)"
             */
            CSS.buildCssTranslateString = function (traslateX, translateY) {
                if (CSS.is3dSupported) {
                    return "translate3d(" + traslateX + "px," + translateY + "px,0px)";
                }
                else {
                    return "translate(" + traslateX + "px," + translateY + "px)";
                }
            };
            CSS.getCssMatrixValue = function (element, type) {
                var transX = 0;
                var transY = 0;
                var scaleX = 0;
                var scaleY = 0;
                for (var i = 0; i < CSS.cssPrefixes.length; i++) {
                    var matrix = $(element).css(CSS.cssPrefixes[i] + "transform");
                    if (matrix) {
                        var is3dMatrix = matrix.indexOf("3d") !== -1 ? true : false;
                        matrix = matrix.replace("matrix3d", "").replace("matrix", "").replace(/[^\d.,-]/g, "");
                        var arr = matrix.split(",");
                        transX = Number(arr[is3dMatrix ? 12 : 4]);
                        transY = Number(arr[is3dMatrix ? 13 : 5]);
                        scaleX = Number(arr[0]);
                        scaleY = Number(arr[is3dMatrix ? 5 : 3]);
                        break;
                    }
                }
                switch (type) {
                    case "translateX":
                        return isNaN(transX) ? 0 : transX;
                    case "translateY":
                        return isNaN(transY) ? 0 : transY;
                    case "scaleX":
                        return isNaN(scaleX) ? 1 : scaleX;
                    case "scaleY":
                        return isNaN(scaleY) ? 1 : scaleY;
                    default:
                        return 0;
                }
            };
            CSS.clearTransformsTransitions = function (element) {
                var $element = $(element);
                if (!CSS.isTransitionSupported) {
                    $element.stop(true, true);
                }
                $element.off(CSS.transitionEnd);
                var transforms = {};
                var transitions = {};
                for (var i = 0; i < CSS.cssPrefixes.length; i++) {
                    transforms[CSS.cssPrefixes[i] + "transform"] = "";
                    transitions[CSS.cssPrefixes[i] + "transition"] = "";
                }
                $element.css(transforms).css(transitions);
            };
            CSS.clearTransitions = function (element) {
                var $element = $(element);
                if (!CSS.isTransitionSupported) {
                    $element.stop(true, true);
                }
                $element.off(CSS.transitionEnd);
                var transitions = {};
                for (var i = 0; i < CSS.cssPrefixes.length; i++) {
                    transitions[CSS.cssPrefixes[i] + "transition"] = "";
                }
                $element.css(transitions);
            };
            CSS.setFadeProperty = function (element, msec, timingFunction) {
                var transitions = {}, second = (msec / 1000) + "s", animation = " " + second + " " + timingFunction;
                for (var i = 0; i < CSS.cssPrefixes.length; i++) {
                    transitions[CSS.cssPrefixes[i] + "transition"] = "opacity" + animation + "," + CSS.cssPrefixes[i] + "transform" + animation;
                }
                $(element).css(transitions);
            };
            CSS.moveImage = function (offsetX, offsetY, scaleX, scaleY, element, duration, callback) {
                // sylevster が無い場合の fall back
                if (null != $M) {
                    CSS.transformElement(element, {
                        duration: duration,
                        callback: callback,
                        scale: scaleX,
                        offsetX: offsetX,
                        offsetY: offsetY,
                    });
                }
                else {
                    CSS.moveImageNoTranslate(offsetX, offsetY, element, duration, callback);
                }
            };
            CSS.moveImageNoTranslate = function (offsetX, offsetY, element, duration, callback) {
                $(element).animate({
                    left: offsetX + "px",
                    top: offsetY + "px",
                    bottom: offsetY * (-1) + "px",
                    right: offsetX * (-1) + "px"
                }, duration, function () {
                    if (typeof callback === "function") {
                        callback();
                    }
                });
            };
            /**
             * Detects if the browser supports 3d tranforms.
             *
             * @private
             * @return {Boolean} true: has / false: doesn"t.
             */
            CSS.has3d = function () {
                if (null != Modernizr && null != Modernizr.csstransforms3d) {
                    return Modernizr.csstransforms3d;
                }
                else {
                    var el = document.createElement("p");
                    var has3d = true;
                    var transforms = {
                        "webkitTransform": "-webkit-transform",
                        "OTransform": "-o-transform",
                        "msTransform": "-ms-transform",
                        "MozTransform": "-moz-transform",
                        "transform": "transform"
                    };
                    // Add it to the body to get the computed style.
                    document.body.insertBefore(el, null);
                    for (var t in transforms) {
                        if (null != el.style[t]) {
                            el.style[t] = "translate3d(1px,1px,1px)";
                            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                        }
                    }
                    document.body.removeChild(el);
                    return ((null != has3d) && has3d.length > 0 && has3d !== "none");
                }
            };
            /**
             * Returns true if the browser supports css transitions
             * currently, this only returns false for IE9 and below.
             *
             * @private
             * @return {Boolean} true: supported / false: not supported.
             */
            CSS.supportsTransitions = function () {
                if (null != Modernizr && null != Modernizr.csstransitions) {
                    return Modernizr.csstransitions;
                }
                else {
                    var ieTransVer = 10;
                    var rv = ieTransVer;
                    var ua = navigator.userAgent;
                    var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
                    if (re.exec(ua) !== null) {
                        rv = parseFloat(RegExp.$1);
                    }
                    // assumes IE10 version that supports transition
                    if (rv < ieTransVer) {
                        return false;
                    }
                    return true;
                }
            };
            CSS.transformElement = function (element, config) {
                var duration = (typeof config.duration === "number") ? config.duration : 0;
                var callback = (typeof config.callback === "function") ? config.callback : null;
                var transformValue = "";
                config.timing = config.timing || "ease-in";
                // Bug in sylvester: If scale is 0 it won't animate
                config.scale = (typeof config.scale !== "undefined") ? config.scale : 1;
                config.scale = config.scale || 0.001;
                if (config.transformValue) {
                    transformValue = config.transformValue;
                }
                else if (CSS.is3dSupported) {
                    transformValue = CSS.transformElement3D(config);
                }
                else {
                    transformValue = CSS.transformElement2D(config);
                }
                var secondsDuration = (duration / 1000) + "s";
                var transformProperties = {};
                var elemTransitions = {};
                for (var i = 0; i < CSS.cssPrefixes.length; i++) {
                    transformProperties[CSS.cssPrefixes[i] + "transform"] = transformValue;
                    elemTransitions[CSS.cssPrefixes[i] + "transition"] = "all " + secondsDuration + " " + config.timing;
                    if (config.delay) {
                        transformProperties[CSS.cssPrefixes[i] + "transition-delay"] = (config.delay / 1000) + "s";
                    }
                }
                var $element = $(element);
                $element.css(elemTransitions).css(transformProperties);
                if (typeof config.opacity !== "undefined") {
                    $element.css("opacity", config.opacity);
                }
                setTimeout(function () {
                    if (callback !== null) {
                        callback();
                    }
                }, duration || 0);
            };
            /**
             * function to use if 3d transformations are not supported. Fall back to 2D support.
             *
             * @param {Object} configurations and overrides
             * @return null
             */
            CSS.transformElement2D = function (config) {
                var s = config.scale;
                var scaleMatrix = $M([
                    [s, 0, 0],
                    [0, s, 0],
                    [0, 0, 1]
                ]);
                // Create translation matrix
                var tx = config.offsetX || 0;
                var ty = config.offsetY || 0;
                var translateMatrix = $M([
                    [1, 0, tx],
                    [0, 1, ty],
                    [0, 0, 1]
                ]);
                // Create rotation Z matrix
                var z1 = (typeof config.rotateZ !== "undefined") ? Math.cos(config.rotateZ) : 1;
                var z2 = (typeof config.rotateZ !== "undefined") ? Math.sin(-config.rotateZ) : 0;
                var z3 = (typeof config.rotateZ !== "undefined") ? Math.sin(config.rotateZ) : 0;
                var z4 = (typeof config.rotateZ !== "undefined") ? Math.cos(config.rotateZ) : 1;
                var rotateZMatrix = $M([
                    [z1, z2, 0],
                    [z3, z4, 0],
                    [0, 0, 1]
                ]);
                var fm = translateMatrix.x(scaleMatrix).x(rotateZMatrix);
                return "matrix(" + fm.e(1, 1).toFixed(10) + "," + fm.e(2, 1).toFixed(10) + "," + fm.e(1, 2).toFixed(10) + "," + fm.e(2, 2).toFixed(10) + "," + fm.e(1, 3).toFixed(10) + "," + fm.e(2, 3).toFixed(10) + ")";
            };
            /**
             * function to use if 3d transformations are supported
             *
             * @param {Object} configurations and overrides
             * @return null
             */
            CSS.transformElement3D = function (config) {
                // Create scale matrix
                var s = config.scale;
                var scaleMatrix = $M([
                    [s, 0, 0, 0],
                    [0, s, 0, 0],
                    [0, 0, s, 0],
                    [0, 0, 0, 1]
                ]);
                // Create translation matrix
                var tx = config.offsetX || 0;
                var ty = config.offsetY || 0;
                var tz = config.offsetZ || 0;
                var translateMatrix = $M([
                    [1, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0],
                    [tx, ty, tz, 1]
                ]);
                // Create rotation X matrix
                var x1 = (typeof config.rotateX !== "undefined") ? Math.cos(config.rotateX) : 1;
                var x2 = (typeof config.rotateX !== "undefined") ? Math.sin(-config.rotateX) : 0;
                var x3 = (typeof config.rotateX !== "undefined") ? Math.sin(config.rotateX) : 0;
                var x4 = (typeof config.rotateX !== "undefined") ? Math.cos(config.rotateX) : 1;
                var rotateXMatrix = $M([
                    [1, 0, 0, 0],
                    [0, x1, x2, 0],
                    [0, x3, x4, 0],
                    [0, 0, 0, 1]
                ]);
                // Create rotation Y matrix
                var y1 = (typeof config.rotateY !== "undefined") ? Math.cos(config.rotateY) : 1;
                var y2 = (typeof config.rotateY !== "undefined") ? Math.sin(config.rotateY) : 0;
                var y3 = (typeof config.rotateY !== "undefined") ? Math.sin(-config.rotateY) : 0;
                var y4 = (typeof config.rotateY !== "undefined") ? Math.cos(config.rotateY) : 1;
                var rotateYMatrix = $M([
                    [y1, 0, y2, 0],
                    [0, 1, 0, 0],
                    [y3, 0, y4, 0],
                    [0, 0, 0, 1]
                ]);
                // Create rotation Z matrix
                var z1 = (typeof config.rotateZ !== "undefined") ? Math.cos(config.rotateZ) : 1;
                var z2 = (typeof config.rotateZ !== "undefined") ? Math.sin(-config.rotateZ) : 0;
                var z3 = (typeof config.rotateZ !== "undefined") ? Math.sin(config.rotateZ) : 0;
                var z4 = (typeof config.rotateZ !== "undefined") ? Math.cos(config.rotateZ) : 1;
                var rotateZMatrix = $M([
                    [z1, z2, 0, 0],
                    [z3, z4, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1]
                ]);
                var fm = rotateXMatrix.x(rotateYMatrix).x(rotateZMatrix).x(scaleMatrix).x(translateMatrix);
                return "matrix3d(" + fm.e(1, 1).toFixed(10) + "," + fm.e(1, 2).toFixed(10) + "," + fm.e(1, 3).toFixed(10) + "," + fm.e(1, 4).toFixed(10) + "," + fm.e(2, 1).toFixed(10) + "," + fm.e(2, 2).toFixed(10) + "," + fm.e(2, 3).toFixed(10) + "," + fm.e(2, 4).toFixed(10) + "," + fm.e(3, 1).toFixed(10) + "," + fm.e(3, 2).toFixed(10) + "," + fm.e(3, 3).toFixed(10) + "," + fm.e(3, 4).toFixed(10) + "," + fm.e(4, 1).toFixed(10) + "," + fm.e(4, 2).toFixed(10) + "," + fm.e(4, 3).toFixed(10) + "," + fm.e(4, 4).toFixed(10) + ")";
            };
            CSS._is3dSupported = undefined;
            CSS._isTransitionSupported = undefined;
            return CSS;
        })();
        Tools.CSS = CSS;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));

/* tslint:disable:max-line-length quotemark forin one-line */
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var TAG = "[CDP.Tools.Touch] ";
        /**
         * @brief touch event 拡張モジュール
         *        オリジナルは CDP UXTC touch.js モジュール。
         *        http://ghe.am.sony.com/cdp/touch-module
         *
         *        サポートするイベントは以下。jQuery.on() で使用可能。
         *         drag
         *         dragstart
         *         dragend
         *         swipe
         *         tap
         *         doubletap
         *         pinchstart
         *         pinchend
         *         pinchin
         *         pinchout
         *
         *        2014/04/25 時点
         *        ロジックはそのままだが、以下の点から PMO ソースとして扱う。
         *        - event 定義 "swipe" と "tap" が jQM と被る
         *        - 細かいパラメータ調整を行う可能性がある。
         *        PMO が落ち着いたら、CDP に porting するので、自由に編集可能。
         *        変更した場合、"[PMO]" とコメントを入れること推奨。
         */
        // cdp.tools は cdp.core に依存しないため、独自にglobal を提供する
        var global = global || window;
        var _eventPrefix = "";
        var config = global.Config; // global config object.
        if (config && typeof config.namespace === "string") {
            _eventPrefix = config.namespace + "_";
        }
        /**
         * タッチイベント名を解決する
         *
         * @param plane {String} [in] plane イベント名を指定. ex) "swipe"
         * @return {String} 実際に使用するイベント名
         */
        function touchEvent(plane) {
            return _eventPrefix + plane;
        }
        Tools.touchEvent = touchEvent;
        //___________________________________________________________________________________________________________________//
        // touch.js implementation scope.
        var Touch;
        (function (Touch) {
            // Check whether the browser is using MSPointers
            var _isMsPtr = window.navigator.msPointerEnabled;
            // The original events we'll be listening to
            var _origEvents = {
                start: 'touchstart mousedown',
                end: 'touchend mouseup',
                move: 'touchmove mousemove'
            };
            // Our custom events we'll be firing [PMO] add custom event name prefix.
            var _customEvents = {
                drag: _eventPrefix + 'drag',
                dragStart: _eventPrefix + 'dragstart',
                dragEnd: _eventPrefix + 'dragend',
                swipe: _eventPrefix + 'swipe',
                tap: _eventPrefix + 'tap',
                doubleTap: _eventPrefix + 'doubletap',
                pinchStart: _eventPrefix + 'pinchstart',
                pinchEnd: _eventPrefix + 'pinchend',
                pinchIn: _eventPrefix + 'pinchin',
                pinchOut: _eventPrefix + 'pinchout'
            };
            // Redefine our original events if the browser uses MSPointers [PMO] add mouse events.
            if (_isMsPtr) {
                _origEvents.start = 'MSPointerDown mousedown';
                _origEvents.end = 'MSPointerUp mouseup';
                _origEvents.move = 'MSPointerMove mousemove';
            }
            /**
             * [PMO]
             * Bind original events to target element to use touch object.
             * @param  {JQuery} element [in]
             *       This dom element receives origEvents
             *       and then sends customEvents to handlers which are bind by Touch module user.
             *
             * (注意) elementをwindowとした場合、windowの"touchstart"と"touchmove"に対して
             *        preventDefaultが呼ばれるため、他のタグのブラウザ機能も無効となる。
             */
            function setTarget(element) {
                for (var evt in _customEvents) {
                    // If we are in IE
                    if (!evt) {
                        evt = window.event;
                    }
                    _bindToElement(_customEvents[evt], element);
                }
            }
            Touch.setTarget = setTarget;
            /**
             * [PMO]
             * Unbind original events from target element.
             * @param  {JQuery} element [in]
             *       This dom element receives origEvents
             *       and then sends customEvents to handlers which are bind by Touch module user.
             */
            function removeTarget(element) {
                for (var evt in _origEvents) {
                    // If we are in IE  // TODO: This part should be checked wheter correct or not.
                    if (!evt) {
                        evt = window.event;
                    }
                    _unbindFromElement(_origEvents[evt], element);
                }
            }
            Touch.removeTarget = removeTarget;
            // [PMO]
            function _bindToElement(customEvent, element) {
                _on(customEvent, element, function (e) {
                    var args = [customEvent, Array.prototype.slice.call(arguments)];
                    args[1].shift();
                    $.prototype.trigger.apply($(e.target), args);
                });
            }
            Touch._bindToElement = _bindToElement;
            // [PMO]
            function _unbindFromElement(customEvent, element) {
                // TODO: handler名を指定して、削除すべきかも
                $(element).unbind(customEvent);
            }
            function _init() {
                for (var evt in _customEvents) {
                    // If we are in IE
                    if (!evt) {
                        evt = window.event;
                    }
                    _bindToWindow(_customEvents[evt]);
                }
            }
            function _bindToWindow(customEvent) {
                _on(customEvent, $(window), function (e) {
                    var args = [customEvent, Array.prototype.slice.call(arguments)];
                    args[1].shift();
                    $.prototype.trigger.apply($(e.target), args);
                });
            }
            function _on(event, element, callback) {
                var startX = 0;
                var startY = 0;
                var endX = 0;
                var endY = 0;
                var startPinchX1 = 0;
                var startPinchX2 = 0;
                var startPinchY1 = 0;
                var startPinchY2 = 0;
                var tapCount = 0;
                var tapWait = 200;
                var doubleTapWait = 300;
                var tapAllowedOffset = 5;
                var isTouching = false;
                var isPinching = false;
                var isTapWaiting = false;
                var isWaitingDoubleTap = false;
                var updateStartPinchCoordinates = function (e) {
                    startPinchX1 = e.originalEvent.touches[0].pageX;
                    startPinchX2 = e.originalEvent.touches[1].pageX;
                    startPinchY1 = e.originalEvent.touches[0].pageY;
                    startPinchY2 = e.originalEvent.touches[1].pageY;
                };
                var getSwipeInfo = function (coordinates) {
                    var swipeValue = false; // [PMO] add annotation for typescript.
                    var swipeOffset = 0;
                    if (coordinates.offsetY < coordinates.offsetX) {
                        swipeOffset = coordinates.offsetX;
                        if (coordinates.startX > coordinates.endX) {
                            swipeValue = 'swipeleft';
                        }
                        else if (coordinates.startX < coordinates.endX) {
                            swipeValue = 'swiperight';
                        }
                    }
                    else {
                        swipeOffset = coordinates.offsetY;
                        if (coordinates.startY > coordinates.endY) {
                            swipeValue = 'swipeup';
                        }
                        else if (coordinates.startY < coordinates.endY) {
                            swipeValue = 'swipedown';
                        }
                    }
                    return {
                        swipeValue: swipeValue,
                        swipeOffset: swipeOffset
                    };
                };
                _bindEvent({
                    genericEvent: _origEvents.end,
                    customEvent: event,
                    element: element,
                    handler: function (e) {
                        // Detect pinchend
                        if (e.originalEvent.touches && e.originalEvent.touches.length !== 2) {
                            if (isPinching && event === _customEvents.pinchEnd) {
                                callback(e);
                            }
                            isPinching = false;
                        }
                        // Detect swipe, dragend, doubletap, tap
                        if ((e.originalEvent.touches && e.originalEvent.touches.length === 0) || !e.originalEvent.touches) {
                            endX = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : e.originalEvent.pageX;
                            endY = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageY : e.originalEvent.pageY;
                            isTouching = false;
                            // Distance between when a pointer started touching the screen and end touching
                            var newOffsetX = Math.abs(endX - startX);
                            var newOffsetY = Math.abs(endY - startY);
                            var swipeInfo = getSwipeInfo({
                                offsetX: newOffsetX,
                                offsetY: newOffsetY,
                                startX: startX,
                                startY: startY,
                                endX: endX,
                                endY: endY
                            });
                            // Detect swipe
                            if (swipeInfo.swipeValue && event === _customEvents.swipe) {
                                callback(e, swipeInfo.swipeValue, Math.abs(swipeInfo.swipeOffset));
                            }
                            else if (event === _customEvents.dragEnd) {
                                callback(e, endX, endY, newOffsetX, newOffsetY);
                            }
                            else if (tapCount === 2 && isWaitingDoubleTap && event === _customEvents.doubleTap) {
                                isWaitingDoubleTap = false;
                                tapCount = 0;
                                callback(e, endX, endY);
                            }
                            else if (isTapWaiting && event === _customEvents.tap && Math.abs(newOffsetX) <= tapAllowedOffset && Math.abs(newOffsetY) <= tapAllowedOffset && e.button !== 1 && e.button !== 2) {
                                isTapWaiting = false;
                                callback(e, endX, endY);
                            }
                        }
                    }
                });
                _bindEvent({
                    genericEvent: _origEvents.move,
                    customEvent: event,
                    element: element,
                    handler: function (e) {
                        e.preventDefault(); // [PMO] In kitkat device, "touchend" event is not comming if preventDefault is not called in handlers for "touchstart" and "touchmove"
                        if (isTouching) {
                            var touchX = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : e.originalEvent.pageX;
                            var touchY = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageY : e.originalEvent.pageY;
                            // Detect drag
                            if (event === _customEvents.drag) {
                                if ((e.originalEvent.changedTouches && e.originalEvent.changedTouches.length === 1) && (e.originalEvent.touches && e.originalEvent.touches.length === 1) || !e.originalEvent.changedTouches) {
                                    callback(e, touchX, touchY, touchX - startX, touchY - startY);
                                }
                            }
                        }
                        // Detect pinch
                        if (e.originalEvent.touches && isPinching && (event === _customEvents.pinchIn || event === _customEvents.pinchOut) && e.originalEvent.touches.length === 2) {
                            var endPinchX1 = e.originalEvent.touches[0].pageX;
                            var endPinchX2 = e.originalEvent.touches[1].pageX;
                            var endPinchY1 = e.originalEvent.touches[0].pageY;
                            var endPinchY2 = e.originalEvent.touches[1].pageY;
                            // Get drag distance for each touch using pythagorean theorem
                            var touchADistance = Math.round(Math.sqrt(((endPinchX1 - startPinchX1) * (endPinchX1 - startPinchX1)) + ((endPinchY1 - startPinchY1) * (endPinchY1 - startPinchY1))));
                            var touchBDistance = Math.round(Math.sqrt(((endPinchX2 - startPinchX2) * (endPinchX2 - startPinchX2)) + ((endPinchY2 - startPinchY2) * (endPinchY2 - startPinchY2))));
                            // Get finger distance for start and end using pythagorean theorem
                            var startDistance = Math.round(Math.sqrt(((startPinchX2 - startPinchX1) * (startPinchX2 - startPinchX1)) + ((startPinchY2 - startPinchY1) * (startPinchY2 - startPinchY1))));
                            var endDistance = Math.round(Math.sqrt(((endPinchX2 - endPinchX1) * (endPinchX2 - endPinchX1)) + ((endPinchY2 - endPinchY1) * (endPinchY2 - endPinchY1))));
                            // Determine type of pinch
                            var dragDistance = touchADistance > touchBDistance ? touchADistance : touchBDistance;
                            var pinchType = startDistance > endDistance ? _customEvents.pinchIn : _customEvents.pinchOut;
                            if (startDistance === endDistance) {
                                pinchType = false;
                            }
                            if (pinchType && pinchType === _customEvents.pinchOut && event === _customEvents.pinchOut) {
                                callback(e, dragDistance);
                            }
                            else if (pinchType && pinchType === _customEvents.pinchIn && event === _customEvents.pinchIn) {
                                callback(e, dragDistance);
                            }
                        }
                    }
                });
                _bindEvent({
                    genericEvent: _origEvents.start,
                    customEvent: event,
                    element: element,
                    handler: function (e) {
                        //						e.preventDefault(); // [PMO] In kitkat device, "touchend" event is not comming if preventDefault is not called in handlers for "touchstart" and "touchmove"
                        if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length !== 2) {
                            // Detect pinchend
                            if (isPinching && event === _customEvents.pinchEnd) {
                                callback(e);
                            }
                            isPinching = false;
                        }
                        if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length === 2) {
                            isPinching = true;
                            // Detect pinchstart
                            if (event === _customEvents.pinchStart) {
                                callback(e);
                            }
                            updateStartPinchCoordinates(e);
                        }
                        else if (e.originalEvent) {
                            startX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.originalEvent.pageX;
                            startY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.originalEvent.pageY;
                            isTouching = true;
                            // Detect dragstart
                            if ((e.originalEvent.touches && event === _customEvents.dragStart && (e.originalEvent.touches.length === 1)) || event === _customEvents.dragStart && !e.originalEvent.touches) {
                                callback(e, startX, startY);
                            }
                            else if ((e.originalEvent.touches && event === _customEvents.doubleTap && (e.originalEvent.touches.length === 1)) || event === _customEvents.doubleTap && !e.originalEvent.touches) {
                                if (!isWaitingDoubleTap) {
                                    setTimeout(function () {
                                        isWaitingDoubleTap = false;
                                        tapCount = 0;
                                    }, doubleTapWait);
                                }
                                isWaitingDoubleTap = true;
                                tapCount++;
                            }
                            else if ((e.originalEvent.touches && event === _customEvents.tap && (e.originalEvent.touches.length === 1)) || event === _customEvents.tap && !e.originalEvent.touches) {
                                if (!isTapWaiting) {
                                    setTimeout(function () {
                                        isTapWaiting = false;
                                    }, tapWait);
                                }
                                isTapWaiting = true;
                            }
                        }
                        else {
                            callback(e);
                        }
                    }
                });
            }
            function _bindEvent(config) {
                var genericEvent = config.genericEvent;
                var customEvent = config.customEvent;
                var element = config.element;
                var handler = config.handler;
                var events = element.events || {};
                if (!events[customEvent]) {
                    events[customEvent] = [];
                }
                events[customEvent].push({
                    handler: handler,
                    genericEvent: genericEvent
                });
                element.events = events;
                $(element).bind(genericEvent, handler);
            }
        })(Touch = Tools.Touch || (Tools.Touch = {}));
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));

    return CDP.Tools;
}));



(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["cdp.tools.proxy", "cdp.tools.container"], function () {
            return factory(root.CDP || (root.CDP = {}));
        });
    }
    else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}));
    }
}(this, function (CDP) {
    CDP.SlideShow = CDP.SlideShow || {};
    

var CDP;
(function (CDP) {
    var SlideShow;
    (function (SlideShow) {
        var TAG = "[CDP.SlideShow.TimerAnimation] ";
        /**
         * @class TimerAnimationInfo
         * @brief Slide Show internal class.
         */
        var TimerAnimationInfo = (function () {
            //! constructor
            function TimerAnimationInfo(_enableFade, _opacity, _enableTransform, _scaleX, _scaleY, _translateX, _translateY, _cssPrefixes) {
                this._enableFade = _enableFade;
                this._opacity = _opacity;
                this._enableTransform = _enableTransform;
                this._scaleX = _scaleX;
                this._scaleY = _scaleY;
                this._translateX = _translateX;
                this._translateY = _translateY;
                this._cssPrefixes = _cssPrefixes;
            }
            //! accesser : fade
            TimerAnimationInfo.prototype.getFadeProperty = function (rev) {
                if (!this._enableFade) {
                    return -1; // for ignore mark.
                }
                var opacity = this._opacity.start + rev * this._opacity.distance;
                if (this._opacity.start < this._opacity.end) {
                    if (this._opacity.end < opacity) {
                        opacity = this._opacity.end;
                    }
                }
                else {
                    if (this._opacity.end > opacity) {
                        opacity = this._opacity.end;
                    }
                }
                return opacity;
            };
            //! accesser : transform
            TimerAnimationInfo.prototype.getTransformProperty = function (rev) {
                if (!this._enableTransform) {
                    return false;
                }
                var scaleRevX = this._scaleX.start + rev * this._scaleX.distance;
                if (this._scaleX.start < this._scaleX.end) {
                    if (this._scaleX.end < scaleRevX) {
                        scaleRevX = this._scaleX.end;
                    }
                }
                else {
                    if (this._scaleX.end > scaleRevX) {
                        scaleRevX = this._scaleX.end;
                    }
                }
                var scaleRevY = this._scaleY.start + rev * this._scaleY.distance;
                if (this._scaleY.start < this._scaleY.end) {
                    if (this._scaleY.end < scaleRevY) {
                        scaleRevY = this._scaleY.end;
                    }
                }
                else {
                    if (this._scaleY.end > scaleRevY) {
                        scaleRevY = this._scaleY.end;
                    }
                }
                var translateRevX = this._translateX.start + Math.floor(rev * this._translateX.distance);
                if (this._translateX.start < this._translateX.end) {
                    if (this._translateX.end < translateRevX) {
                        translateRevX = this._translateX.end;
                    }
                }
                else {
                    if (this._translateX.end > translateRevX) {
                        translateRevX = this._translateX.end;
                    }
                }
                var translateRevY = this._translateY.start + Math.floor(rev * this._translateY.distance);
                if (this._translateY.start < this._translateY.end) {
                    if (this._translateY.end < translateRevY) {
                        translateRevY = this._translateY.end;
                    }
                }
                else {
                    if (this._translateY.end > translateRevY) {
                        translateRevY = this._translateY.end;
                    }
                }
                var transformsProperties = "scale(" + scaleRevX + "," + scaleRevY + ") " + "translate(" + translateRevX + "px," + translateRevY + "px)";
                var transform = {};
                for (var i = 0; i < this._cssPrefixes.length; i++) {
                    transform[this._cssPrefixes[i] + "transform"] = transformsProperties;
                }
                return transform;
            };
            /**
             * Start timer animation.
             *
             * @private
             * @param  {Object} TransitionTarget object.
             * @param  {Number} fade duration.
             * @param  {Number} transform duration.
             */
            TimerAnimationInfo.start = function (target, fadeDuration, trasformDuration) {
                var df = $.Deferred();
                if (null == fadeDuration) {
                    fadeDuration = 0;
                }
                if (null == trasformDuration) {
                    trasformDuration = 0;
                }
                var duration = (fadeDuration <= trasformDuration) ? trasformDuration : fadeDuration;
                if (!target || !target.$element || duration <= 0) {
                    return df.resolve();
                }
                var param = TimerAnimationInfo.createTimerAnimationInfo(target, fadeDuration, trasformDuration);
                if (!param) {
                    return df.resolve();
                }
                var complete = function () {
                    df.resolve();
                };
                var step = function (now, fx) {
                    if ("transform" === fx.prop) {
                        var transform = fx.end.info.getTransformProperty(fx.pos);
                        if (transform) {
                            $(fx.elem).css(transform);
                        }
                    }
                    if ("fade" === fx.prop) {
                        var fade = fx.end.info.getFadeProperty(fx.pos);
                        if (0 <= fade) {
                            $(fx.elem).css("opacity", fade);
                        }
                    }
                };
                target.$element.animate(param, {
                    duration: duration,
                    easing: "linear",
                    complete: complete,
                    step: step,
                });
                return df.promise();
            };
            /**
             * Create timer animation information object.
             *
             * @private
             * @param  {Object} TransitionTarget object.
             * @param  {Number} fade duration.
             * @param  {Number} transform duration.
             * @return {Object} TimerAnimationInfo object.
             */
            TimerAnimationInfo.createTimerAnimationInfo = function (target, fadeDuration, transformDuration) {
                var scaleStartX = 1.0;
                var scaleStartY = 1.0;
                var translateStartX = 0;
                var translateStartY = 0;
                var opacityStart = 1.0;
                var scaleEndX = 1.0;
                var scaleEndY = 1.0;
                var translateEndX = 0;
                var translateEndY = 0;
                var opacityEnd = 1.0;
                var scaleDistanceX = 0.0;
                var scaleDistanceY = 0.0;
                var translateDistanceX = 0.0;
                var translateDistanceY = 0.0;
                var opacityDistance = 0.0;
                var fadeVelocity = 1.0;
                var transformVelocity = 1.0;
                if (0 < fadeDuration && 0 < transformDuration && fadeDuration !== transformDuration) {
                    if (fadeDuration < transformDuration) {
                        fadeVelocity = transformDuration / fadeDuration;
                    }
                    else {
                        transformVelocity = fadeDuration / transformDuration;
                    }
                }
                if (!!target.transform) {
                    var start = (!!target.transform.start && !!target.transform.start.transform) ? target.transform.start.transform : "";
                    var end = (!!target.transform.end && !!target.transform.end.transform) ? target.transform.end.transform : "";
                    var scaleStartInfo = start.match(/scale\(..*,..*\)/);
                    if (!!scaleStartInfo && scaleStartInfo[0]) {
                        scaleStartX = 1 * scaleStartInfo[0].substring(scaleStartInfo[0].indexOf("(") + 1, scaleStartInfo[0].indexOf(","));
                        scaleStartY = 1 * scaleStartInfo[0].substring(scaleStartInfo[0].indexOf(",") + 1, scaleStartInfo[0].indexOf(")"));
                    }
                    var scaleEndInfo = end.match(/scale\(..*,..*\)/);
                    if (!!scaleEndInfo && scaleEndInfo[0]) {
                        scaleEndX = 1 * scaleEndInfo[0].substring(scaleEndInfo[0].indexOf("(") + 1, scaleEndInfo[0].indexOf(","));
                        scaleEndY = 1 * scaleEndInfo[0].substring(scaleEndInfo[0].indexOf(",") + 1, scaleEndInfo[0].indexOf(")"));
                    }
                    if ((null != scaleStartX) && (null != scaleEndX)) {
                        scaleDistanceX = (scaleEndX - scaleStartX) * transformVelocity;
                    }
                    if ((null != scaleStartY) && (null != scaleEndY)) {
                        scaleDistanceY = (scaleEndY - scaleStartY) * transformVelocity;
                    }
                    var translateWork = null;
                    var translateStart = start.match(/translate\(..*,..*\)/);
                    if (!!translateStart && translateStart[0]) {
                        translateWork = translateStart[0].replace(/px/g, "");
                        translateStartX = 1 * translateWork.substring(translateWork.indexOf("(") + 1, translateWork.indexOf(","));
                        translateStartY = 1 * translateWork.substring(translateWork.indexOf(",") + 1, translateWork.indexOf(")"));
                    }
                    var translateEnd = end.match(/translate\(..*,..*\)/);
                    if (!!translateEnd && translateEnd[0]) {
                        translateWork = translateEnd[0].replace(/px/g, "");
                        translateEndX = 1 * translateWork.substring(translateWork.indexOf("(") + 1, translateWork.indexOf(","));
                        translateEndY = 1 * translateWork.substring(translateWork.indexOf(",") + 1, translateWork.indexOf(")"));
                    }
                    if ((null != translateStartX) && (null != translateEndX)) {
                        translateDistanceX = (translateEndX - translateStartX) * transformVelocity;
                    }
                    if ((null != translateStartY) && (null != translateEndY)) {
                        translateDistanceY = (translateEndY - translateStartY) * transformVelocity;
                    }
                }
                if (!!target.fade) {
                    if (!!target.fade.start) {
                        opacityStart = 1 * target.fade.start.opacity;
                    }
                    if (!!target.fade.end) {
                        opacityEnd = 1 * target.fade.end.opacity;
                        opacityDistance = (opacityEnd - opacityStart) * fadeVelocity;
                    }
                }
                var info = new TimerAnimationInfo(!!target.fade, { start: opacityStart, end: opacityEnd, distance: opacityDistance }, !!target.transform, { start: scaleStartX, end: scaleEndX, distance: scaleDistanceX }, { start: scaleStartY, end: scaleEndY, distance: scaleDistanceY }, { start: translateStartX, end: translateEndX, distance: translateDistanceX }, { start: translateStartY, end: translateEndY, distance: translateDistanceY }, CDP.Tools.CSS.cssPrefixes);
                return {
                    fade: { info: info },
                    transform: { info: info },
                };
            };
            return TimerAnimationInfo;
        })();
        SlideShow.TimerAnimationInfo = TimerAnimationInfo;
    })(SlideShow = CDP.SlideShow || (CDP.SlideShow = {}));
})(CDP || (CDP = {}));
// for min dependency release, change the follow ts includes.



var CDP;
(function (CDP) {
    var SlideShow;
    (function (SlideShow) {
        var CSS = CDP.Tools.CSS;
        var TAG = "[CDP.SlideShow.Transition] ";
        /**
         * @class Transition
         * @brief Slide Show transition logic utility class
         */
        var Transition = (function () {
            function Transition() {
            }
            Object.defineProperty(Transition, "imageOffset", {
                ///////////////////////////////////////////////////////////////////////
                // public static methods
                //! get image offset value
                get: function () {
                    return Transition.s_imageOffset;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Slide effect transition.
             *
             * @private
             * @param viewport {Object}  [in] viewport element where the image will be shown.
             * @param newElem  {Object}  [in] dom element that will be animated.
             * @param config   {Object}  [in] config options.
             * @param start    {Boolean} [in] true: first image / false: not first
             * @return {Object} TransitionSettings object.
             */
            Transition.slideIn = function (viewport, newElem, config, start) {
                // initialize configs
                var direction = config && config.direction ? config.direction : "left";
                var duration = config && config.duration ? config.duration : 500;
                var offset = config && config.offset ? config.offset : Transition.s_imageOffset;
                var focusDuration = config && config.focusDuration ? config.focusDuration : 1500;
                // for first frame switch zoom-in
                if (!!start) {
                    config.fadeDuration = duration / 2;
                    return Transition.kenBurn(viewport, newElem, config, start);
                }
                // init screen
                var oldElem = Transition.initViewport(viewport, newElem);
                // old target
                var oldElementNewOffset = ((direction === "left") ? -1 : 1) * (offset + $(oldElem).width());
                var currX = CSS.getCssMatrixValue($(oldElem), "translateX");
                var currY = CSS.getCssMatrixValue($(oldElem), "translateY");
                var currScale = CSS.getCssMatrixValue($(oldElem), "scaleX");
                var oldTransitionTarget = {
                    $element: $(oldElem),
                    transform: Transition.createTransformProperty(currScale, currX, currY, currScale, oldElementNewOffset, currY),
                };
                // new target
                var newElementNewOffset = ((direction === "left") ? 1 : -1) * (offset + $(oldElem).width());
                var newTransitionTarget = {
                    $element: $(newElem),
                    transform: Transition.createTransformProperty(1.0, newElementNewOffset, 0, 1.0, 0, 0),
                };
                // transition setting.
                var transitionSettings = {
                    viewport: viewport,
                    oldTarget: oldTransitionTarget,
                    newTarget: newTransitionTarget,
                    transformDuration: duration,
                    transformTimingFunction: "ease-out",
                    focusDuration: focusDuration,
                };
                return transitionSettings;
            };
            /**
             * Crossfade effect transition.
             *
             * @private
             * @param {Object} viewport element where the image will be shown.
             * @param {Object} dom element that will be animated.
             * @param {Function} callback.
             * @param {Object} config options.
             * @return {Object} TransitionSettings object.
             */
            Transition.fadeIn = function (viewport, newElem, config, start) {
                // config settings
                var duration = config && config.duration ? config.duration : 1000;
                var focusDuration = config && config.focusDuration ? config.focusDuration : 1500;
                // init screen
                var oldElem = Transition.initViewport(viewport, newElem);
                // old target
                var oldTransitionTarget = null;
                if (!start) {
                    oldTransitionTarget = {
                        $element: $(oldElem),
                        fade: Transition.createFadeProperty(1.0, 0.0),
                        transform: Transition.createHardwareAcceleratorProperty(oldElem),
                    };
                }
                // new target
                var newTransitionTarget = {
                    $element: $(newElem),
                    fade: Transition.createFadeProperty(0.0, 1.0),
                    transform: Transition.createHardwareAcceleratorProperty(),
                };
                // transition setting.
                var transitionSettings = {
                    viewport: viewport,
                    oldTarget: oldTransitionTarget,
                    newTarget: newTransitionTarget,
                    fadeDuration: duration,
                    fadeTimingFunction: "ease-in-out",
                    focusDuration: focusDuration,
                };
                return transitionSettings;
            };
            /**
             * Kenburn effect transition.
             *
             * @private
             * @param {Object} viewport element where the image will be shown.
             * @param {Object} dom element that will be animated.
             * @param {Object} config options.
             * @param {Boolean} true: start content.
             * @return {Object} TransitionSettings object.
             */
            Transition.kenBurn = function (viewport, newElem, config, start) {
                // config settings
                var type = config && config.type ? config.type : "zoomin";
                var scale = config && config.scale ? config.scale : 1.5;
                var offsetX = config && config.offsetX ? config.offsetX : 50;
                var offsetY = config && config.offsetY ? config.offsetY : 50;
                var duration = config && config.duration ? config.duration : 4000;
                var focusDuration = config && config.focusDuration ? config.focusDuration : 500;
                var transformDuration = config && config.transformDuration ? config.transformDuration : duration;
                var fadeDuration = config && config.fadeDuration ? config.fadeDuration : 2000;
                // init screen
                var oldElem = Transition.initViewport(viewport, newElem);
                // old target
                var oldTransitionTarget = null;
                if (!start && 0 !== fadeDuration) {
                    oldTransitionTarget = {
                        $element: $(oldElem),
                        fade: Transition.createFadeProperty(1.0, 0.0),
                        transform: Transition.createHardwareAcceleratorProperty(oldElem),
                    };
                }
                // new transition properties
                var newFadeProp = null, newTrasformProp = null;
                if (0 !== fadeDuration) {
                    newFadeProp = Transition.createFadeProperty(0.3, 1.0);
                }
                switch (type) {
                    case "zoomout":
                        newTrasformProp = Transition.createTransformProperty(scale, 0, 0, 1.0, 0, 0);
                        break;
                    case "zoomin":
                        newTrasformProp = Transition.createTransformProperty(1.0, 0, 0, scale, 0, 0);
                        break;
                    case "slideright":
                        newTrasformProp = Transition.createTransformProperty(scale, -offsetX, offsetY, scale, offsetX, 0);
                        break;
                    case "slideleft":
                        newTrasformProp = Transition.createTransformProperty(scale, offsetX, offsetY, scale, -offsetX, 0);
                        break;
                    default:
                        break;
                }
                // new target
                var newTransitionTarget = {
                    $element: $(newElem),
                    fade: newFadeProp,
                    transform: newTrasformProp,
                };
                // transition setting.
                var transitionSettings = {
                    viewport: viewport,
                    oldTarget: oldTransitionTarget,
                    newTarget: newTransitionTarget,
                    fadeDuration: fadeDuration,
                    transformDuration: transformDuration,
                    focusDuration: focusDuration,
                };
                return transitionSettings;
            };
            /**
             * Fade in and zooom out with fixed screen size transition (inscribed).
             *
             * @private
             * @param {Object} viewport element where the image will be shown.
             * @param {Object} dom element that will be animated.
             * @param {Object} config options.
             * @param {Boolean} true: start content.
             * @return {Object} TransitionSettings object.
             */
            Transition.fixedFadeInZoomOutInscribed = function (viewport, newElem, config, start) {
                return Transition.fixedFadeInZoomOutCommon(viewport, newElem, config, start, function (viewW, viewH, imgW, imgH) {
                    var fixedScale = 1.0;
                    if (0 !== imgW && 0 !== imgH) {
                        if (imgH <= imgW) {
                            fixedScale = viewW / imgW;
                        }
                        else {
                            fixedScale = viewH / imgH;
                        }
                    }
                    else {
                        console.error(TAG + "invalid image size.");
                    }
                    return fixedScale;
                });
            };
            /**
             * Fade in and zooom out with fixed screen size transition (circumscribed).
             *
             * @private
             * @param {Object} viewport element where the image will be shown.
             * @param {Object} dom element that will be animated.
             * @param {Object} config options.
             * @param {Boolean} true: start content.
             * @return {Object} TransitionSettings object.
             */
            Transition.fixedFadeInZoomOutCircumscribed = function (viewport, newElem, config, start) {
                return Transition.fixedFadeInZoomOutCommon(viewport, newElem, config, start, function (viewW, viewH, imgW, imgH) {
                    var fixedScale = 1.0;
                    if (0 !== imgW && 0 !== imgH) {
                        if (imgH <= imgW) {
                            fixedScale = viewH / imgH;
                        }
                        else {
                            fixedScale = viewW / imgW;
                        }
                    }
                    else {
                        console.error(TAG + "invalid image size.");
                    }
                    return fixedScale;
                });
            };
            /**
             * Fade in and zooom out with fixed screen size transition (inscribed).
             *
             * @private
             * @param {Object} viewport element where the image will be shown.
             * @param {Object} dom element that will be animated.
             * @param {Object} config options.
             * @param {Boolean} true: start content.
             * @return {Object} TransitionSettings object.
             */
            Transition.fixedFadeInZoomOutCommon = function (viewport, newElem, config, start, compare) {
                // config settings
                var scale = config && config.scale ? config.scale : 1.25;
                var duration = config && config.duration ? config.duration : 5000;
                var focusDuration = config && config.focusDuration ? config.focusDuration : 0;
                var transformDuration = config && config.transformDuration ? config.transformDuration : duration;
                var fadeDuration = config && config.fadeDuration ? config.fadeDuration : 2500;
                // init screen
                var oldElem = Transition.initViewport(viewport, newElem);
                // old target
                var oldTransitionTarget = null;
                if (!start) {
                    oldTransitionTarget = {
                        $element: $(oldElem),
                        fade: Transition.createFadeProperty(1.0, 0.0),
                        transform: Transition.createHardwareAcceleratorProperty(oldElem),
                    };
                }
                // calcurate new element transform property
                var viewportWidth = $(viewport).width();
                var viewportHeight = $(viewport).height();
                var imgWidth = $(newElem).find("img").first().width();
                var imgHeight = $(newElem).find("img").first().height();
                var fixedScale = compare(viewportWidth, viewportHeight, imgWidth, imgHeight);
                // new target
                var newTransitionTarget = {
                    $element: $(newElem),
                    fade: Transition.createFadeProperty(0.3, 1.0),
                    transform: Transition.createTransformProperty(fixedScale * scale, 0, 0, fixedScale, 0, 0),
                };
                // transition setting.
                var transitionSettings = {
                    viewport: viewport,
                    oldTarget: oldTransitionTarget,
                    newTarget: newTransitionTarget,
                    fadeDuration: fadeDuration,
                    transformDuration: transformDuration,
                    focusDuration: focusDuration,
                };
                return transitionSettings;
            };
            /**
             * Custom effect transition.
             *
             * @private
             * @param {Object} viewport element where the image will be shown.
             * @param {Object} dom element that will be animated.
             * @param {Object} config options.
             * @param {Boolean} true: start content.
             * @return {Object} TransitionSettings object.
             */
            Transition.customEffect = function (viewport, newElem, config, start) {
                // config settings
                var oldEndScale = config && config.oldEndScale ? config.oldEndScale : null; // null: mean keep old value.
                var oldEndOffsetX = config && config.oldEndOffsetX ? config.oldEndOffsetX : null; // null: mean keep old value.
                var oldEndOffsetY = config && config.oldEndOffsetY ? config.oldEndOffsetY : null; // null: mean keep old value.
                var oldEndOpacity = config && config.oldEndOpacity ? config.oldEndOpacity : null; // null: mean keep old value.
                var newStartScale = config && config.newStartScale ? config.newStartScale : -1.0; // -1: mean use fixed scale.
                var newStartOffsetX = config && config.newStartOffsetY ? config.newStartOffsetY : 0;
                var newStartOffsetY = config && config.newStartOffsetY ? config.newStartOffsetY : 0;
                var newStartOpacity = config && config.newEndOpacity ? config.newEndOpacity : 0.3;
                var newEndScale = config && config.newEndScale ? config.newEndScale : -1.25; // -1: mean use fixed scale.
                var newEndOffsetX = config && config.newEndOffsetX ? config.newEndOffsetX : 0;
                var newEndOffsetY = config && config.newEndOffsetY ? config.newEndOffsetY : 0;
                var newEndOpacity = config && config.newEndOpacity ? config.newEndOpacity : 1.0;
                var fixedScale = 1.0;
                var duration = config && config.duration ? config.duration : 4000;
                var focusDuration = config && config.focusDuration ? config.focusDuration : 0;
                var transformDuration = config && config.transformDuration ? config.transformDuration : duration;
                var transformTimingFunction = config && config.transformTimingFunction ? config.fadeTimingFunction : "ease-out";
                var fadeDuration = config && config.fadeDuration ? config.fadeDuration : Math.floor(transformDuration / 2);
                var fadeTimingFunction = config && config.fadeTimingFunction ? config.fadeTimingFunction : "linear";
                // calcurate image fixed screen scale, if needed.
                if (newStartScale < 0 || newEndScale < 0) {
                    var viewportWidth = $(viewport).width();
                    var viewportHeight = $(viewport).height();
                    var imgWidth = $(newElem).find("img").first().width();
                    var imgHeight = $(newElem).find("img").first().height();
                    if (0 !== imgWidth && 0 !== imgHeight) {
                        if (viewportHeight <= viewportWidth) {
                            fixedScale = viewportWidth / imgWidth;
                        }
                        else {
                            fixedScale = viewportHeight / imgHeight;
                        }
                    }
                    else {
                        console.error(TAG + "invalid image size.");
                    }
                    newStartScale = Math.abs(newStartScale);
                    newEndScale = Math.abs(newEndScale);
                }
                // init screen
                var oldElem = Transition.initViewport(viewport, newElem);
                // old target
                var oldTransitionTarget = null;
                if (!start) {
                    var currOpacity = parseInt($(oldElem).css("opacity"), 10);
                    var currX = CSS.getCssMatrixValue($(oldElem), "translateX");
                    var currY = CSS.getCssMatrixValue($(oldElem), "translateY");
                    var currScale = CSS.getCssMatrixValue($(oldElem), "scaleX");
                    if (null == oldEndScale) {
                        oldEndScale = currScale;
                    }
                    if (null == oldEndOffsetX) {
                        oldEndOffsetX = currX;
                    }
                    if (null == oldEndOffsetY) {
                        oldEndOffsetY = currY;
                    }
                    oldTransitionTarget = {
                        $element: $(oldElem),
                        fade: Transition.createFadeProperty(currOpacity, oldEndScale),
                        transform: Transition.createTransformProperty(currScale, currX, currY, oldEndScale, oldEndOffsetX, oldEndOffsetY),
                    };
                }
                // new target
                var newTransitionTarget = {
                    $element: $(newElem),
                    fade: Transition.createFadeProperty(newStartOpacity, newEndOpacity),
                    transform: Transition.createTransformProperty(fixedScale * newStartScale, newStartOffsetX, newStartOffsetY, fixedScale * newEndScale, newEndOffsetX, newStartOffsetY),
                };
                // transition setting.
                var transitionSettings = {
                    viewport: viewport,
                    oldTarget: oldTransitionTarget,
                    newTarget: newTransitionTarget,
                    transformDuration: transformDuration,
                    transformTimingFunction: transformTimingFunction,
                    fadeDuration: fadeDuration,
                    fadeTimingFunction: fadeTimingFunction,
                    focusDuration: focusDuration,
                };
                return transitionSettings;
            };
            /**
             * Start animation common API.
             * If browser doesn"t support css transition, fall back to use jQuery animation.
             *
             * @private
             * @param  {Object} TransitionSettings object.
             * @return jQueryPromise object.
             */
            Transition.startEffect = function (settings) {
                if (CSS.isTransitionSupported) {
                    return Transition.startEffectByCssTransition(settings);
                }
                else {
                    return Transition.startEffectByTimerAnimation(settings);
                }
            };
            ///////////////////////////////////////////////////////////////////////
            // private static methods
            /**
             * Initialize view port for transition.
             *
             * @private
             * @param  {Object} viewport element where the image will be shown.
             * @param  {Object} dom element that will be animated.
             * @param  {Function} function callback.
             * @param  {Object} config options.
             * @return {Object} old element jQuery object.
             */
            Transition.initViewport = function (viewport, newElem) {
                // init element
                var oldElem = $(viewport).children(":first");
                $(oldElem).css(CSS.cssHideBackFace);
                $(newElem).css(CSS.cssHideBackFace);
                CSS.clearTransitions(oldElem);
                CSS.clearTransitions(newElem);
                var cssProperties = {
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    bottom: "0px",
                    visibility: "hidden",
                };
                $(newElem).css(cssProperties);
                $(viewport).append(newElem);
                return oldElem;
            };
            /**
             * Create fade transition property object.
             *
             * @private
             * @param  {Number} start opacity value.
             * @param  {Number} end opacity value.
             * @return {Object} TransitionProperty object.
             */
            Transition.createFadeProperty = function (opacityStart, opacityEnd) {
                var fadeProp = {
                    start: { opacity: (opacityStart).toString(10) },
                    end: { opacity: (opacityEnd).toString(10) },
                };
                return fadeProp;
            };
            /**
             * Create transform transition property object.
             *
             * @private
             * @param  {Number} start scale value.
             * @param  {Number} start translate x value.
             * @param  {Number} start translate y value.
             * @param  {Number} end scale value.
             * @param  {Number} end translate x value.
             * @param  {Number} end translate y value.
             * @return {Object} TransitionProperty object.
             */
            Transition.createTransformProperty = function (scaleStart, traslateXStart, translateYStart, scaleEnd, traslateXEnd, translateYEnd) {
                var transformStart = {};
                var transformEnd = {};
                var transformsPropertiesStart = "";
                var transformsPropertiesEnd = "";
                transformsPropertiesStart = CSS.buildCssTransformString(scaleStart, traslateXStart, translateYStart);
                transformsPropertiesEnd = CSS.buildCssTransformString(scaleEnd, traslateXEnd, translateYEnd);
                var i = 0;
                for (i = 0; i < CSS.cssPrefixes.length; i++) {
                    transformStart[CSS.cssPrefixes[i] + "transform"] = transformsPropertiesStart;
                    transformEnd[CSS.cssPrefixes[i] + "transform"] = transformsPropertiesEnd;
                }
                var transformProp = {
                    start: transformStart,
                    end: transformEnd,
                };
                return transformProp;
            };
            /**
             * Create property object for Hardware Accelerator.
             *
             * @private
             * @param {Object} dom element that will be animated.
             * @return TransitionProperty object.
             */
            Transition.createHardwareAcceleratorProperty = function (element) {
                if (null == element) {
                    return Transition.createTransformProperty(1.0, 0, 0, 1.0, 0, 0);
                }
                else {
                    var currX = CSS.getCssMatrixValue($(element), "translateX");
                    var currY = CSS.getCssMatrixValue($(element), "translateY");
                    var currScale = CSS.getCssMatrixValue($(element), "scaleX");
                    return Transition.createTransformProperty(currScale, currX, currY, currScale, currX, currY);
                }
            };
            /**
             * startEffect() helper API.
             * implemented by css transtion property.
             *
             * @private
             * @param  {Object} TransitionSettings object.
             * @return jQueryPromise object.
             */
            Transition.startEffectByCssTransition = function (settings) {
                var df = $.Deferred();
                var countTransitionEndFired = 0;
                var enableFade = (0 < settings.fadeDuration);
                var enableTransform = (0 < settings.transformDuration);
                if (enableFade) {
                    countTransitionEndFired++;
                }
                if (enableTransform) {
                    countTransitionEndFired++;
                }
                if (0 === countTransitionEndFired) {
                    console.error(TAG + "no transtion setting.");
                    return df.reject();
                }
                Transition.setTransitionProperty(settings.oldTarget, "start");
                Transition.setTransitionProperty(settings.newTarget, "start");
                var eventReceived = 0;
                var transitionEndHandler = function (event) {
                    eventReceived++;
                    if (countTransitionEndFired <= eventReceived) {
                        df.resolve();
                    }
                };
                setTimeout(function () {
                    Transition.setTransitionProperty(settings.oldTarget, "end");
                    Transition.setTransitionProperty(settings.newTarget, "end").on(CSS.transitionEnd, transitionEndHandler);
                    var elemTransitions = {};
                    var i = 0;
                    for (i = 0; i < CSS.cssPrefixes.length; i++) {
                        var secondsFadeDuration = (settings.fadeDuration / 1000) + "s";
                        var secondsTransformDuration = (settings.transformDuration / 1000) + "s";
                        elemTransitions[CSS.cssPrefixes[i] + "transition"] = "";
                        if (enableFade) {
                            var fadePropertyString = "opacity" + " " + secondsFadeDuration + ((settings.fadeTimingFunction) ? (" " + settings.fadeTimingFunction) : " linear");
                            elemTransitions[CSS.cssPrefixes[i] + "transition"] += fadePropertyString;
                        }
                        if (enableTransform) {
                            if (elemTransitions[CSS.cssPrefixes[i] + "transition"] !== "") {
                                elemTransitions[CSS.cssPrefixes[i] + "transition"] += ",";
                            }
                            var transformPropertyString = CSS.cssPrefixes[i] + "transform" + " " + secondsTransformDuration + ((settings.transformTimingFunction) ? (" " + settings.transformTimingFunction) : " linear");
                            elemTransitions[CSS.cssPrefixes[i] + "transition"] += transformPropertyString;
                        }
                    }
                    if (!!settings.oldTarget && !!settings.oldTarget.$element) {
                        settings.oldTarget.$element.css(elemTransitions);
                    }
                    if (!!settings.newTarget && !!settings.newTarget.$element) {
                        settings.newTarget.$element.css(elemTransitions).css("visibility", "visible");
                    }
                }, 100);
                return df.promise();
            };
            /**
             * startEffect() helper API.
             * implemented by jQuery animation.
             *
             * @private
             * @param  {Object} TransitionSettings object.
             * @return jQueryPromise object.
             */
            Transition.startEffectByTimerAnimation = function (settings) {
                var df = $.Deferred();
                Transition.setTransitionProperty(settings.oldTarget, "start");
                Transition.setTransitionProperty(settings.newTarget, "start");
                var prmsOld = SlideShow.TimerAnimationInfo.start(settings.oldTarget, settings.fadeDuration, settings.transformDuration);
                var prmsNew = SlideShow.TimerAnimationInfo.start(settings.newTarget, settings.fadeDuration, settings.transformDuration);
                $.when(prmsOld, prmsNew).done(function () {
                    df.resolve();
                }).fail(function () {
                    console.error(TAG + "failed timer animation.");
                    df.reject();
                });
                return df.promise();
            };
            /**
             * Set css properties to target.
             *
             * @private
             * @param  {Object} TransitionTarget object.
             * @param  {String} point of transtion identifier. {"start"/"end"}
             * @return {Object} Target jQuery object.
             */
            Transition.setTransitionProperty = function (target, point) {
                if (!target || !target.$element) {
                    return null;
                }
                switch (point) {
                    case "start":
                        if (target.fade && target.fade.start) {
                            target.$element.css(target.fade.start);
                        }
                        if (target.transform && target.transform.start) {
                            target.$element.css(target.transform.start);
                        }
                        break;
                    case "end":
                        if (target.fade && target.fade.end) {
                            target.$element.css(target.fade.end);
                        }
                        if (target.transform && target.transform.end) {
                            target.$element.css(target.transform.end);
                        }
                        break;
                    default:
                        console.error(TAG + "no support point identifier. : " + point);
                        return null;
                }
                return target.$element;
            };
            Transition.s_imageOffset = 50;
            return Transition;
        })();
        SlideShow.Transition = Transition;
    })(SlideShow = CDP.SlideShow || (CDP.SlideShow = {}));
})(CDP || (CDP = {}));



/* tslint:disable:no-string-literal max-line-length */
var CDP;
(function (CDP) {
    var SlideShow;
    (function (SlideShow) {
        var CSS = CDP.Tools.CSS;
        var touchEvent = CDP.Tools.touchEvent;
        var Touch = CDP.Tools.Touch;
        var TAG = "[CDP.SlideShow.Player] ";
        /**
         * @class _Config
         * @brief config parameters for development.
         */
        var _Config;
        (function (_Config) {
            _Config.ENABLE_TOUCH_LOG = false; // for touch event trace.
            _Config.EXEC_STEP_DELAY_TIME = 100; // step up/down timeout
        })(_Config || (_Config = {}));
        //___________________________________________________________________________________________________________________//
        ///////////////////////////////////////////////////////////////////////
        // closure methods
        // event logger for touch event
        function touchEventLog(msg) {
            if (_Config.ENABLE_TOUCH_LOG) {
                console.log(TAG + msg);
            }
        }
        //___________________________________________________________________________________________________________________//
        /**
         * @class Player
         * @brief Slide Show core logic.
         */
        var Player = (function () {
            function Player() {
                this._settings = null;
                this._imgContainer = null;
                this._preloadImages = null;
                this._preloadCanceler = null;
                this._$viewport = null;
                this._transitionList = [];
                this._isPlaying = false;
                this._isTransitioning = false;
                this._isDragStarted = false;
                this._isPinching = false;
                this._errorCount = 0; //!< error counter. add 2014/02/17
                // used on sidepeek mode only
                this._rightImage = null;
                this._leftImage = null;
                this._promise = null;
                this._resizeHandler = null;
            }
            /**
             * Initialize
             *
             * @param  {Object} image data
             * @param  {Array} transition list
             * @param  {Object} viewport element
             * @param  {Object} setting option
             * @return {Object} jQueryPromise object.
             */
            Player.prototype.init = function (imageData, transitionList, viewport, options) {
                var _this = this;
                var df = $.Deferred();
                // setup settings
                this._settings = $.extend({}, Player._defaultOptions, options);
                this._imgContainer = new CDP.Tools.InfinityContainer();
                this._trIndx = 0;
                this._errorCount = 0;
                this._snapDuration = 200;
                this._isPlaying = false;
                this._isTransitioning = false;
                this._isDragStarted = false;
                this._rightImage = null;
                this._leftImage = null;
                this._isPinching = false;
                this._currentTranslateX = 0;
                this._currentTranslateY = 0;
                this._currentScale = 1;
                this._transitionList = transitionList;
                this._$viewport = viewport;
                this._preloadImages = {};
                this._preloadCanceler = {};
                this._resizeHandler = _.bind(this.resizeImages, this);
                // resize event bind.
                $(window).on("resize", this._resizeHandler);
                this._imgContainer.init(imageData, options).then(function () {
                    //! touch有効なときのみ、targetを指定する必要あり。
                    //! 中でpreventDefaultをcallしているため。
                    if (_this._settings.enableTouch) {
                        Touch.setTarget(_this._$viewport);
                    }
                    _this.subscribeToEvents();
                    return _this.initPreloadedImages();
                }).then(function () {
                    if (_this._settings.showFirstImageImmediately) {
                        return _this.showCurrentImage();
                    }
                }).then(function () {
                    df.resolve();
                }).fail(function () {
                    console.error(TAG + "Player.init(), failed.");
                    df.resolve();
                });
                return this.managePromise(df);
            };
            /**
             * Terminate SlideShow object.
             *
             */
            Player.prototype.terminate = function () {
                if (this._isPlaying) {
                    this.notifyStateChanged("state:play-state-changed", this._isPlaying);
                }
                Touch.removeTarget(this._$viewport); //! TODO: 以下のoffでevent handlerをunbindしているので不要かも
                (this._$viewport).off();
                this.cleanViewPort(this._$viewport);
                this._$viewport.children().remove();
                for (var key in this._preloadImages) {
                    if ("outerleft" !== key && "outerright" !== key) {
                        this.deletePreloadedImage(key);
                    }
                }
                $(window).off("resize", this._resizeHandler);
                this._isPlaying = false;
                this._isTransitioning = false;
                this._isDragStarted = false;
                this._rightImage = null;
                this._leftImage = null;
                this._isPinching = false;
                this._preloadImages = {};
                this._preloadCanceler = {};
                this._imgContainer = null;
                this._transitionList = [];
                this._$viewport = null;
            };
            /**
             * Validate this SlideShow object.
             *
             * @return {Boolean} true: valid / false: invalid.
             */
            Player.prototype.valid = function () {
                if (!this._imgContainer) {
                    return false;
                }
                return this._imgContainer.valid();
            };
            /**
             * Check async loading method.
             *
             * @return {Boolean} true: now loading / false: idle.
             */
            Player.prototype.isLoading = function () {
                if (!this.valid()) {
                    return false;
                }
                return this._imgContainer.isInAsyncProc();
            };
            /**
             * Wait load condition.
             *
             * @return {Object} jQueryPromise object.
             */
            Player.prototype.waitLoadComplete = function () {
                if (!this.valid()) {
                    return $.Deferred().resolve();
                }
                return this._imgContainer.waitAsyncProc();
            };
            /**
             * Returns viewport element.
             *
             * @return {Object} jQuery object.
             */
            Player.prototype.getViewport = function () {
                return this._$viewport;
            };
            /**
             * Returns current image index.
             *
             * @return {Number} index.
             */
            Player.prototype.getCurrentImageIndex = function () {
                if (!this.valid()) {
                    return 0;
                }
                return this._imgContainer.getIndex();
            };
            /**
             * Set current image index.
             *
             * @param  {Number} index.
             * @return {Object} jQueryPromise object.
             */
            Player.prototype.setCurrentImageIndex = function (index) {
                var _this = this;
                if (!this.valid()) {
                    return $.Deferred().reject();
                }
                var df = $.Deferred();
                this._isPlaying = false;
                this.notifyStateChanged("state:play-state-changed", this._isPlaying);
                this.cleanViewPort(this._$viewport);
                this._imgContainer.seek(index).promise.then(function () {
                    _this.cleanViewPort(_this._$viewport);
                    return _this.initPreloadedImages();
                }).then(function () {
                    return _this.showCurrentImage();
                }).then(function () {
                    _this.notifyStateChanged("state:playback-image-changed", _this._imgContainer.getIndex());
                    df.resolve();
                }).fail(function () {
                    console.error(TAG + "setCurrentImageIndex() failed.");
                    df.reject();
                });
                return this.managePromise(df);
            };
            /**
             * Returns current image array element.
             *
             * @return {Object} current data.
             */
            Player.prototype.getCurrentImageData = function () {
                if (!this.valid()) {
                    return 0;
                }
                var cursor = this._imgContainer.getCurrentCursorArray();
                return cursor.getData();
            };
            /**
             * Remove current image array element.
             *
             * @return {Object} jQueryPromise object.
             */
            Player.prototype.removeCurrentImage = function () {
                var _this = this;
                var df = $.Deferred();
                if (!this.valid()) {
                    return df.reject();
                }
                else if (this._isPlaying) {
                    console.error(TAG + "cannot call removeCurrentImage() when playing.");
                    return df.reject();
                }
                if (!this._imgContainer.remove()) {
                    console.error(TAG + "this._imgContainer.remove() failed.");
                    return df.reject();
                }
                else if (this._imgContainer.size() <= 0) {
                    df.resolve();
                }
                else {
                    this._imgContainer.waitAsyncProc().then(function () {
                        _this.cleanViewPort(_this._$viewport);
                        return _this.initPreloadedImages();
                    }).then(function () {
                        return _this.showCurrentImage();
                    }).then(function () {
                        _this.notifyStateChanged("state:playback-image-changed", _this._imgContainer.getIndex());
                        df.resolve();
                    }).fail(function () {
                        console.error(TAG + "removeCurrentImage() failed.");
                        df.reject();
                    });
                }
                return this.managePromise(df);
            };
            /**
             * Returns image data array length.
             *
             * @return {Number} data size.
             */
            Player.prototype.getImageDataCount = function () {
                if (!this.valid()) {
                    return 0;
                }
                return this._imgContainer.size();
            };
            /**
             * Returns image data raw container object.
             * advanced method.
             *
             * @return {Object} Tools.InfinityContainer object.
             */
            Player.prototype.getImageDataContainer = function () {
                if (!this.valid()) {
                    return null;
                }
                return this._imgContainer;
            };
            /**
             * Returns if slideshow is playing or not.
             *
             * @return {Boolean} true: playing / false: stopped.
             */
            Player.prototype.isPlaying = function () {
                return this._isPlaying;
            };
            /**
             * Pause slideshow and shows next image.
             *
             * @param {Object} current element.
             * @param {Function} callback.
             * @param {Number} duration.
             */
            Player.prototype.stepUp = function (currentElement, callbackStep, durationOverride) {
                var _this = this;
                this.waitAsyncProc().always(function () {
                    if (_this._isPlaying) {
                        _this.pause();
                    }
                    var duration = (typeof durationOverride === "number") ? durationOverride : _this._snapDuration;
                    var currElem = currentElement || $(_this._$viewport).children(":first");
                    _this.setSideImages(SlideShow.Transition.imageOffset);
                    setTimeout(function () {
                        CSS.moveImage(0, 0, 1, 1, _this._rightImage, duration, function () {
                            // clear references
                            CSS.clearTransformsTransitions(currElem);
                            CSS.clearTransformsTransitions(_this._leftImage);
                            $(currElem).remove();
                            $(_this._leftImage).remove();
                            _this._leftImage = null;
                            _this._rightImage = null;
                            // move next
                            _this.moveNext().then(function () {
                                if (typeof callbackStep === "function") {
                                    callbackStep();
                                }
                                _this.notifyStateChanged("state:playback-image-changed", _this._imgContainer.getIndex());
                            }, function () {
                                console.error(TAG + "moveNext() failed in stepUp()");
                            });
                        });
                        var leftOffset = ($(_this._$viewport).width() + SlideShow.Transition.imageOffset) * (-1);
                        CSS.moveImage(leftOffset, 0, 1, 1, currElem, duration);
                    }, _this._isTransitioning ? 0 : _Config.EXEC_STEP_DELAY_TIME);
                });
            };
            /**
             * Pause slideshow and shows previous image.
             *
             * @param {Object} current element
             * @param {Function} callback
             * @param {Number} duration
             */
            Player.prototype.stepDown = function (currentElement, callbackStep, durationOverride) {
                var _this = this;
                this.waitAsyncProc().always(function () {
                    if (_this._isPlaying) {
                        _this.pause();
                    }
                    var duration = (typeof durationOverride === "number") ? durationOverride : _this._snapDuration;
                    var currElem = currentElement || $(_this._$viewport).children(":first");
                    _this.setSideImages(SlideShow.Transition.imageOffset);
                    setTimeout(function () {
                        CSS.moveImage(0, 0, 1, 1, _this._leftImage, duration, function () {
                            // clear references
                            CSS.clearTransformsTransitions(currElem);
                            CSS.clearTransformsTransitions(_this._rightImage);
                            $(currElem).remove();
                            $(_this._rightImage).remove();
                            _this._leftImage = null;
                            _this._rightImage = null;
                            // move previous
                            _this.movePrevious().then(function () {
                                if (typeof callbackStep === "function") {
                                    callbackStep();
                                }
                                _this.notifyStateChanged("state:playback-image-changed", _this._imgContainer.getIndex());
                            }, function () {
                                console.error(TAG + "movePrevious() failed in stepDown()");
                            });
                        });
                        var rightOffset = $(_this._$viewport).width() + SlideShow.Transition.imageOffset;
                        CSS.moveImage(rightOffset, 0, 1, 1, currElem, duration);
                    }, _this._isTransitioning ? 0 : _Config.EXEC_STEP_DELAY_TIME);
                });
            };
            /**
             * Plays slideshow, loops through images and transitions
             */
            Player.prototype.play = function () {
                var _this = this;
                this.waitAsyncProc().always(function () {
                    if (_this._isPlaying) {
                        return;
                    }
                    _this._isPlaying = true;
                    _this.notifyStateChanged("state:play-state-changed", _this._isPlaying);
                    var transitionCall = function (viewport, newElem, start) {
                        if (!_this._isPlaying) {
                            return;
                        }
                        // call image callback as soon as it shows in the viewport
                        _this.notifyStateChanged("state:playback-image-changed", _this._imgContainer.getIndex());
                        // for first frame clean up.
                        if (!!start) {
                            _this.cleanViewPort(viewport);
                        }
                        var settings = null;
                        switch (_this._transitionList[_this._trIndx].type) {
                            case "slidein":
                                settings = SlideShow.Transition.slideIn(viewport, newElem, _this._transitionList[_this._trIndx].config, start);
                                break;
                            case "fadein":
                                settings = SlideShow.Transition.fadeIn(viewport, newElem, _this._transitionList[_this._trIndx].config, start);
                                break;
                            case "kenburn":
                                settings = SlideShow.Transition.kenBurn(viewport, newElem, _this._transitionList[_this._trIndx].config, start);
                                break;
                            case "fixed-fadein-zoomout-inscribed":
                                settings = SlideShow.Transition.fixedFadeInZoomOutInscribed(viewport, newElem, _this._transitionList[_this._trIndx].config, start);
                                break;
                            case "fixed-fadein-zoomout-circumscribed":
                                settings = SlideShow.Transition.fixedFadeInZoomOutCircumscribed(viewport, newElem, _this._transitionList[_this._trIndx].config, start);
                                break;
                            case "custom-effect":
                                settings = SlideShow.Transition.customEffect(viewport, newElem, _this._transitionList[_this._trIndx].config, start);
                                break;
                            default:
                                console.warn(TAG + "unknown transition type: " + _this._transitionList[_this._trIndx].type);
                                settings = SlideShow.Transition.fadeIn(viewport, newElem, _this._transitionList[_this._trIndx].config, start);
                                break;
                        }
                        // for each callbacks, will need to adjust indeces and 
                        // preload object first (moveNextTransition, moveNext) before 
                        // calling transitionCall
                        _this.transition(settings, function () {
                            if (!_this._isPlaying) {
                                return;
                            }
                            else if (_this._imgContainer.isLast()) {
                                console.log(TAG + "reached last content.");
                                _this.pause();
                                return;
                            }
                            _this.moveNextTransition();
                            _this.moveNext().then(function () {
                                _this.waitForCurrentImageReady().always(function () {
                                    transitionCall(viewport, $(_this._preloadImages[_this._imgContainer.getIndex()]).clone()[0]);
                                });
                            }, function () {
                                console.error(TAG + "moveNext() failed in transitionCall() callback.");
                            });
                        });
                    };
                    // play from current image.
                    _this.waitForCurrentImageReady().always(function () {
                        transitionCall(_this._$viewport, $(_this._preloadImages[_this._imgContainer.getIndex()]).clone()[0], true);
                    });
                });
            };
            /**
             * Stops transitions and resets the indeces.
             */
            Player.prototype.stop = function () {
                var _this = this;
                var df = $.Deferred();
                if (!this._isPlaying) {
                    return df.resolve();
                }
                this._isPlaying = false;
                this.notifyStateChanged("state:play-state-changed", this._isPlaying);
                this._trIndx = 0;
                this._imgContainer.first().promise.then(function () {
                    _this.cleanViewPort(_this._$viewport);
                    return _this.initPreloadedImages();
                }).then(function () {
                    return _this.showCurrentImage();
                }).then(function () {
                    _this.notifyStateChanged("state:playback-image-changed", _this._imgContainer.getIndex());
                    df.resolve();
                }).fail(function () {
                    console.error(TAG + "stop() failed.");
                    df.reject();
                });
                return this.managePromise(df);
            };
            /**
             * Stops transitions but do not reset indeces.
             */
            Player.prototype.pause = function () {
                if (!this._isPlaying) {
                    return;
                }
                this._isPlaying = false;
                this.notifyStateChanged("state:play-state-changed", this._isPlaying);
                this.cleanViewPort(this._$viewport);
                var firstChild = $(this._$viewport).children(":first");
                if (firstChild) {
                    CSS.clearTransformsTransitions(firstChild);
                }
            };
            /**
             * Stops then play slideshow from beginning.
             */
            Player.prototype.restart = function () {
                var _this = this;
                this.stop().then(function () {
                    _this.play();
                }, function () {
                    console.error(TAG + "stop() failed.");
                });
            };
            /**
             * Set touch event enable setting.
             *
             * @param {Boolean} true: enable / false: disable.
             */
            Player.prototype.enableTouchEvent = function (enable) {
                this._settings.enableTouch = enable;
                if (enable) {
                    Touch.setTarget(this._$viewport);
                }
                else {
                    Touch.removeTarget(this._$viewport);
                }
            };
            /**
             * Check async condition method.
             *
             * @return {Boolean} true: now async proccess / false: idle.
             */
            Player.prototype.isInAsyncProc = function () {
                if (!this._promise || "pending" !== this._promise.state()) {
                    return false;
                }
                else {
                    return true;
                }
            };
            /**
             * Wait async condition.
             *
             * @return {Object} jQueryPromise object.
             */
            Player.prototype.waitAsyncProc = function () {
                var _this = this;
                var df = $.Deferred();
                var check = function () {
                    if (_this.isInAsyncProc()) {
                        _this._promise.always(function () {
                            setTimeout(check);
                        });
                    }
                    else {
                        df.resolve();
                    }
                };
                setTimeout(check);
                return df.promise();
            };
            /**
             * Manage for JQueryPromise<any> life cicle.
             *
             * @private
             * @return {Object} jQueryPromise object.
             */
            Player.prototype.managePromise = function (df) {
                var _this = this;
                var setup = function () {
                    _this._promise = df;
                    _this._promise.always(function () {
                        _this._promise = null;
                    });
                };
                if (this.isInAsyncProc()) {
                    this.waitAsyncProc().always(function () {
                        setup();
                    });
                }
                else {
                    setup();
                }
                return df.promise();
            };
            /**
             * Notify state change callback.
             *
             * @private
             */
            Player.prototype.notifyStateChanged = function (state, info) {
                if (typeof this._settings.stateChangedCallback === "function") {
                    this._settings.stateChangedCallback(state, info);
                }
            };
            /**
             * Initialize preloaded images array base on preloaded count value.
             *
             * @private
             */
            Player.prototype.initPreloadedImages = function () {
                var _this = this;
                var df = $.Deferred();
                var rhsDf = $.Deferred();
                var lhsDf = $.Deferred();
                var lhsCount = 0;
                var rhsCount = 0;
                var initialStartIndex = this._imgContainer.getIndex();
                var nextRightIndex = initialStartIndex;
                var nextLeftIndex = initialStartIndex;
                // right side loading
                var rightSideLoad = function () {
                    if (_this._settings.preloadCount <= rhsCount) {
                        _this._imgContainer.waitAsyncProc().then(function () {
                            rhsDf.resolve();
                        }, function () {
                            console.error(TAG + "preload right side, wait async proc failed.");
                            rhsDf.reject();
                        });
                    }
                    else {
                        rhsCount++;
                        nextRightIndex++;
                        if (_this._imgContainer.size() <= nextRightIndex) {
                            nextRightIndex = 0;
                        }
                        var result = _this._imgContainer.seek(nextRightIndex);
                        if (!result.succeeded) {
                            console.error(TAG + "preload right side failed.");
                            rhsDf.reject();
                        }
                        result.promise.then(function () {
                            return _this.prepareImageDiv(nextRightIndex);
                        }).then(function (div) {
                            _this._preloadImages[nextRightIndex] = div;
                            _this._preloadImages["outerright"] = nextRightIndex;
                            setTimeout(rightSideLoad, 0);
                        }).fail(function () {
                            console.error(TAG + "preload right side failed.");
                            rhsDf.reject();
                        });
                    }
                    return rhsDf.promise();
                };
                // left side loading.
                var leftSideLoad = function () {
                    if (_this._settings.preloadCount <= lhsCount) {
                        _this._imgContainer.waitAsyncProc().then(function () {
                            lhsDf.resolve();
                        }, function () {
                            console.error(TAG + "preload left side, wait async proc failed.");
                            lhsDf.reject();
                        });
                    }
                    else {
                        lhsCount++;
                        nextLeftIndex--;
                        if (nextLeftIndex < 0) {
                            nextLeftIndex = _this._imgContainer.size() - 1;
                        }
                        var result = _this._imgContainer.seek(nextLeftIndex);
                        if (!result.succeeded) {
                            console.error(TAG + "preload left side failed.");
                            lhsDf.reject();
                        }
                        result.promise.then(function () {
                            return _this.prepareImageDiv(nextLeftIndex);
                        }).then(function (div) {
                            _this._preloadImages[nextLeftIndex] = div;
                            _this._preloadImages["outerleft"] = nextLeftIndex;
                            setTimeout(leftSideLoad, 0);
                        }).fail(function () {
                            console.error(TAG + "preload left side failed.");
                            lhsDf.reject();
                        });
                    }
                    return lhsDf.promise();
                };
                for (var key in this._preloadImages) {
                    if ("outerleft" !== key && "outerright" !== key) {
                        this.deletePreloadedImage(key);
                    }
                }
                this._preloadImages = {};
                this.prepareImageDiv(initialStartIndex).then(function (div) {
                    _this._preloadImages[initialStartIndex] = div;
                }).then(function () {
                    return rightSideLoad();
                }).then(function () {
                    return leftSideLoad();
                }).then(function () {
                    return _this._imgContainer.seek(initialStartIndex).promise;
                }).then(function () {
                    df.resolve();
                }).fail(function () {
                    console.error(TAG + "failed preload images.");
                    df.reject();
                });
                return df.promise();
            };
            /**
             * Delete preloaded image.
             *
             * @private
             * @param index {Number} [in] index as key.
             */
            Player.prototype.deletePreloadedImage = function (index) {
                if (this._preloadImages[index]) {
                    $(this._preloadImages[index]).remove();
                    delete this._preloadImages[index];
                }
                if (this._preloadCanceler[index]) {
                    var promise = this._preloadCanceler[index];
                    promise.abort();
                    delete this._preloadCanceler[index];
                }
            };
            /**
             * Shows current image in the view port.
             *
             * @private
             * @return {Object} jQueryPromise object.
             */
            Player.prototype.showCurrentImage = function () {
                var df = $.Deferred();
                var settings = SlideShow.Transition.fadeIn(this._$viewport, this._preloadImages[this._imgContainer.getIndex()], { duration: 50, focusDuration: 50 }, true);
                this.transition(settings, function () {
                    df.resolve();
                });
                return df.promise();
            };
            /**
             * Cleans the viewport, removes the left and right images,
             * and make sure there"s only 1 image in the viewport.
             *
             * @private
             * @param {Object} viewport element.
             */
            Player.prototype.cleanViewPort = function (viewport) {
                // reset div"s css and
                // make sure there"s only 1 image in the viewport
                if (this._rightImage) {
                    CSS.clearTransformsTransitions(this._rightImage);
                    $(this._rightImage).css({
                        opacity: "",
                        position: "absolute",
                        top: "0px",
                        bottom: "0px",
                        left: "0px",
                        right: "0px"
                    }).remove();
                    this._rightImage = null;
                }
                if (this._leftImage) {
                    CSS.clearTransformsTransitions(this._leftImage);
                    $(this._leftImage).css({
                        opacity: "",
                        position: "absolute",
                        top: "0px",
                        bottom: "0px",
                        left: "0px",
                        right: "0px"
                    }).remove();
                    this._leftImage = null;
                }
                $(viewport).children().css({
                    opacity: "",
                    position: "absolute",
                    top: "0px",
                    bottom: "0px",
                    left: "0px",
                    right: "0px"
                });
                var children = $(viewport).children();
                if (children.length < 2) {
                    return;
                }
                for (var i = 0; i < (children.length - 1); i++) {
                    $(children[i]).remove();
                }
            };
            /**
             * Reposition the element by adjusting it"s x/y translate values so it snaps on the edge.
             *
             * @private
             * @param {Object} element.
             * @param {String} values can be "x", "y", or "xy".
             */
            Player.prototype.reposition = function (element, axis) {
                var _this = this;
                var currY = CSS.getCssMatrixValue(element, "translateY");
                var currX = CSS.getCssMatrixValue(element, "translateX");
                var scale = typeof this._currentScale === "number" ? this._currentScale : 1;
                var offsetXBeforeShow = (($(element).find("img").width() * scale) - ($(this._$viewport).width())) / 2;
                var offsetYBeforeShow = (($(element).find("img").height() * scale) - ($(this._$viewport).height())) / 2;
                var paddingY = currY > 0 ? offsetYBeforeShow : offsetYBeforeShow * (-1);
                var paddingX = offsetXBeforeShow > 0 ? offsetXBeforeShow : 0;
                var newX = 0;
                var newY = 0;
                paddingX = currX < 0 ? paddingX * (-1) : paddingX;
                switch (axis) {
                    case "x":
                        newX = paddingX;
                        newY = currY;
                        break;
                    case "y":
                        newX = currX;
                        newY = ($(element).find("img").height() * scale) > ($(this._$viewport).height()) ? paddingY : 0;
                        break;
                    case "xy":
                        newX = paddingX;
                        newY = ($(element).find("img").height() * scale) > ($(this._$viewport).height()) ? paddingY : 0;
                        break;
                }
                CSS.moveImage(newX, newY, scale, scale, element, this._snapDuration, function () {
                    _this.cleanViewPort(_this._$viewport);
                    _this._isTransitioning = false;
                });
            };
            /**
             * Resize current image and preload caches.
             * window resize handler.
             *
             * @private
             */
            Player.prototype.resizeImages = function () {
                var _this = this;
                var _resizeImage = function (imageDiv) {
                    var $img = $(imageDiv).find("img").first();
                    if ($img.attr(Player.DATA_IMG_LOAD_SUCCEEDED)) {
                        _this.centerImage($img[0], _this._$viewport);
                    }
                };
                var currentImage = this._$viewport.children(":first");
                _resizeImage(currentImage);
                for (var key in this._preloadImages) {
                    if ("outerleft" !== key && "outerright" !== key) {
                        _resizeImage(this._preloadImages[key]);
                    }
                }
            };
            /**
             * Apply css attributes to an image element so it is centered.
             *
             * @private
             * @param {Object} image element.
             * @param {Object} viewport element where the image will be shown.
             */
            Player.prototype.centerImage = function (img, viewport) {
                // resize the image"s dimensions so it"s not greater than the viewport"s
                // then center the image within the element
                var viewHeight = $(viewport).height();
                var viewWidth = $(viewport).width();
                var origHeight = img.height;
                var origWidth = img.width;
                var newHeight = img.height;
                var newWidth = img.width;
                var shrinkPercentage = 1.0;
                // if the actual image is smaller than viewer port,
                // scale it then adjust
                if (newHeight < viewHeight && newWidth < viewWidth) {
                    newWidth = Math.floor((viewHeight / newHeight) * newWidth);
                    newHeight = viewHeight;
                }
                // adjust the image
                if (newHeight > viewHeight) {
                    shrinkPercentage = (origHeight - viewHeight) / origHeight;
                    newHeight = viewHeight;
                    newWidth = Math.floor(origWidth - (origWidth * shrinkPercentage));
                }
                if (newWidth > viewWidth) {
                    shrinkPercentage = (origWidth - viewWidth) / origWidth;
                    newHeight = Math.floor(origHeight - (origHeight * shrinkPercentage));
                    newWidth = viewWidth;
                }
                // reset css in case of resize like
                // change on dimensions and aspect ratios
                $(img).css({
                    top: "",
                    left: "",
                    bottom: "",
                    right: "",
                    "margin-left": "",
                    "margin-top": ""
                });
                // center the image
                var isFitHeight = (newHeight === viewHeight);
                var sideA = isFitHeight ? "top" : "left";
                var sideB = isFitHeight ? "bottom" : "right";
                var sideOffset = isFitHeight ? "left" : "top";
                var sideMargin = isFitHeight ? "margin-left" : "margin-top";
                var sideMarginValue = isFitHeight ? "-" + newWidth / 2 + "px" : "-" + newHeight / 2 + "px";
                var imgCssProperties = {
                    position: "absolute",
                    height: newHeight + "px",
                    width: newWidth + "px"
                };
                imgCssProperties[sideA] = "0px";
                imgCssProperties[sideB] = "0px";
                imgCssProperties[sideOffset] = "50%";
                imgCssProperties[sideMargin] = sideMarginValue;
                $(img).css(imgCssProperties);
            };
            /**
             * Apply spinner or loading message to an element.
             *
             * @private
             * @param {Object} viewport element where the image will be shown.
             * @param {Object} element.
             */
            Player.prototype.setSpinner = function (viewport, element) {
                var spinnerDiv = document.createElement("div");
                var loading = document.createElement("p");
                $(loading).text("Loading...");
                var loadingProps = {
                    "font-size": "large",
                    color: "gray",
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    padding: "0px",
                    "margin-left": "-40px",
                    "margin-top": "-20px"
                };
                $(loading).css(loadingProps);
                var spinnerProps = {
                    width: $(viewport).width(),
                    height: $(viewport).height()
                };
                $(spinnerDiv).css(spinnerProps);
                $(spinnerDiv).append(loading);
                $(element).append(spinnerDiv);
            };
            /**
             * Prepare Image Div from _imgContainer.
             * this method wraps for _imgContainer's async or sync accessor
             *
             * @private
             * @param index {Number} [in] image index.
             * @return {jQueryPromise} done(div: HTMLElement).
             */
            Player.prototype.prepareImageDiv = function (index) {
                var _this = this;
                var df = $.Deferred();
                var imageDiv;
                if (!this._imgContainer || !this._imgContainer.valid()) {
                    console.error(TAG + "_imgContainer, not ready.");
                    return df.reject();
                }
                if (!this._imgContainer.hasAsyncAccesser()) {
                    // case of sync asccessor
                    df.resolve(this.getImageDiv(this._$viewport, this._imgContainer.get(index)));
                }
                else {
                    // case of async asccessor
                    imageDiv = document.createElement("div");
                    $(imageDiv).css("background-color", "black");
                    if (typeof this._settings.setSpinnerCallback === "function") {
                        this._settings.setSpinnerCallback(this._$viewport, imageDiv);
                    }
                    else {
                        this.setSpinner(this._$viewport, imageDiv);
                    }
                    // spinner 作成時点で返却
                    df.resolve(imageDiv);
                    // promise 返却を優先するため post する
                    setTimeout(function () {
                        var promise = _this._imgContainer.get(index);
                        _this._preloadCanceler[index] = promise;
                        promise.then(function (url, info) {
                            if (_this._preloadImages[index]) {
                                _this.getImageDiv(_this._$viewport, url, imageDiv);
                            }
                            imageDiv = null;
                        }).fail(function () {
                            console.error(TAG + "_imgContainer.get(), failed.");
                            _this._errorCount++;
                            imageDiv = null;
                        });
                    }, 0);
                }
                return df.promise();
            };
            /**
             * Put an image within a div as soon as it loads, centers it
             * then returns the div containing the image.
             *
             * @private
             * @param {Object} viewport element where the image will be shown.
             * @param {String} image source url.
             * @param {Object} image div if prepare from caller.
             * @return {Object} div containing the image.
             */
            Player.prototype.getImageDiv = function (viewport, imgUrl, imageDiv) {
                var _this = this;
                if (null == imgUrl) {
                    console.error(TAG + "imgUrl is null.");
                    imgUrl = "pmo.slideshow.unreached";
                }
                if (!imageDiv) {
                    imageDiv = document.createElement("div");
                    $(imageDiv).css("background-color", "black");
                    if (typeof this._settings.setSpinnerCallback === "function") {
                        this._settings.setSpinnerCallback(viewport, imageDiv);
                    }
                    else {
                        this.setSpinner(viewport, imageDiv);
                    }
                }
                (function (imgDiv) {
                    var img = new Image();
                    var _self = _this;
                    // wait for image to load before animating
                    $(img).on("load", function () {
                        _self.centerImage(this, viewport);
                        // remove the spinner and show the image
                        var $img = $(this);
                        $img.parent().children("div").remove();
                        $img.css("display", "inline").attr(Player.DATA_IMG_LOAD_SUCCEEDED, "true");
                    }).on("error", function () {
                        console.error(TAG + "image load failed.");
                        var thisImage = this;
                        // add faild mark.
                        $(thisImage).attr(Player.DATA_IMG_LOAD_FAILED, "true");
                        _self._errorCount++; // add 2014/02/17
                    }).css("display", "none");
                    $(imgDiv).append(img);
                    // load the image
                    img.src = imgUrl;
                    if (img.complete) {
                        console.log(TAG + "image ready. [img.complete === true]");
                        $(img).load();
                    }
                    img = null; // avoid circular reference.
                })(imageDiv);
                return imageDiv;
            };
            /**
             * Wait for current preload image load complete.
             *
             * @private
             * @return {Object} jQueryPromise.
             */
            Player.prototype.waitForCurrentImageReady = function () {
                var _this = this;
                var df = $.Deferred();
                var proc = function () {
                    setTimeout(function () {
                        var imageDiv = _this._preloadImages[_this._imgContainer.getIndex()];
                        if ($(imageDiv).find("img").first().attr(Player.DATA_IMG_LOAD_SUCCEEDED)) {
                            df.resolve();
                            return;
                        }
                        else if ($(imageDiv).find("img").first().attr(Player.DATA_IMG_LOAD_FAILED)) {
                            // add 2014/02/17
                            // special implement to just avoid eternal waiting in this case.
                            if (_this._settings.allowedErrorMax < _this._errorCount) {
                                console.log(TAG + "reached error maximum count.");
                                _this.stop().always(function () {
                                    _this._errorCount = 0;
                                    _this.notifyStateChanged("error:max-error-count");
                                });
                                df.reject();
                                return;
                            }
                            // if failed, try to show next image immediately. 
                            _this.moveNext().always(function () {
                                proc();
                            });
                        }
                        else {
                            proc();
                        }
                    }, 100);
                };
                proc();
                return df.promise();
            };
            /**
             * Moves image index and transition index forward.
             *
             * @private
             */
            Player.prototype.moveIndecesForward = function () {
                this._trIndx++;
                if (this._trIndx === this._transitionList.length) {
                    this._trIndx = 0;
                }
                this._imgContainer.next();
            };
            /**
             * Moves transition index forward.
             *
             * @private
             */
            Player.prototype.moveNextTransition = function () {
                this._trIndx++;
                if (this._trIndx === this._transitionList.length) {
                    this._trIndx = 0;
                }
            };
            /**
             * Move next container.
             *
             * @private
             */
            Player.prototype.moveNext = function () {
                var _this = this;
                var df = $.Deferred();
                // adjust indeces
                var result = this._imgContainer.next();
                if (!result.succeeded) {
                    console.error(TAG + "_imgContainer.next(), failed.");
                    return df.reject();
                }
                result.promise.then(function () {
                    return _this.movePreloadToRight();
                }).then(function () {
                    df.resolve();
                }).fail(function () {
                    console.error(TAG + "movePrevious(), failed.");
                    df.reject();
                });
                return df.promise();
            };
            /**
             * Moves preloadedImages index to the right.
             *
             * @private
             */
            Player.prototype.movePreloadToRight = function () {
                var _this = this;
                var df = $.Deferred();
                var nextRightIndex = this._preloadImages["outerright"] + 1;
                if (this._imgContainer.size() <= nextRightIndex) {
                    nextRightIndex = 0;
                }
                /*
                 * make sure the image is not preloaded already or
                 * it actuall exists in the image array before adding it
                 * need to do this to prevent unneccessary adding/removal espcially
                 * when the preload count supplied is greater than images count
                 */
                if (!(this._preloadImages[nextRightIndex])) {
                    this.prepareImageDiv(nextRightIndex).then(function (div) {
                        _this._preloadImages[nextRightIndex] = div;
                        // set the new outer right index
                        _this._preloadImages["outerright"] = nextRightIndex;
                        var outerLeftIndex = _this._preloadImages["outerleft"];
                        var newOuterLeftIndex = outerLeftIndex + 1;
                        if (_this._imgContainer.size() <= newOuterLeftIndex) {
                            newOuterLeftIndex = 0;
                        }
                        // adjust the outer left index tracker
                        _this.deletePreloadedImage(outerLeftIndex);
                        _this._preloadImages["outerleft"] = newOuterLeftIndex;
                        df.resolve();
                    }, function () {
                        console.error(TAG + "prepareImageDiv(), failed.");
                        df.reject();
                    });
                }
                else {
                    df.resolve();
                }
                return df.promise();
            };
            /**
             * Move previous container.
             *
             * @private
             */
            Player.prototype.movePrevious = function () {
                var _this = this;
                var df = $.Deferred();
                // adjust indeces
                var result = this._imgContainer.previous();
                if (!result.succeeded) {
                    console.error(TAG + "_imgContainer.previous(), failed.");
                    return df.reject();
                }
                result.promise.then(function () {
                    return _this.movePreloadToLeft();
                }).then(function () {
                    df.resolve();
                }).fail(function () {
                    console.error(TAG + "movePrevious(), failed.");
                    df.reject();
                });
                return df.promise();
            };
            /**
             * Moves preloadedImages index to the left.
             *
             * @private
             */
            Player.prototype.movePreloadToLeft = function () {
                var _this = this;
                var df = $.Deferred();
                var nextLeftIndex = this._preloadImages["outerleft"] - 1;
                if (nextLeftIndex < 0) {
                    nextLeftIndex = this._imgContainer.size() - 1;
                }
                /*
                 * make sure the image is not preloaded already or
                 * it actuall exists in the image array before adding it
                 * need to do this to prevent unneccessary adding/removal espcially
                 * when the preload count supplied is greater than images count
                 */
                if (!(this._preloadImages[nextLeftIndex])) {
                    this.prepareImageDiv(nextLeftIndex).then(function (div) {
                        _this._preloadImages[nextLeftIndex] = div;
                        // set the new outer left index
                        _this._preloadImages["outerleft"] = nextLeftIndex;
                        var outerRightIndex = _this._preloadImages["outerright"];
                        var newOuterRightIndex = outerRightIndex - 1;
                        if (newOuterRightIndex < 0) {
                            newOuterRightIndex = _this._imgContainer.size() - 1;
                        }
                        // adjust the outer right index tracker
                        _this.deletePreloadedImage(outerRightIndex);
                        _this._preloadImages["outerright"] = newOuterRightIndex;
                        df.resolve();
                    }, function () {
                        console.error(TAG + "prepareImageDiv(), failed.");
                        df.reject();
                    });
                }
                else {
                    df.resolve();
                }
                return df.promise();
            };
            /**
             * Returns the next image element stored in the preloaded array.
             *
             * @private
             * @return {Object} div element containing the image.
             */
            Player.prototype.getNext = function () {
                var nextIndex = this._imgContainer.getIndex() + 1;
                if (this._imgContainer.size() <= nextIndex) {
                    if (this._imgContainer.isRepeatable()) {
                        nextIndex = 0;
                    }
                    else {
                        return null;
                    }
                }
                var nextImage = this._preloadImages[nextIndex];
                CSS.clearTransformsTransitions(nextImage);
                $(nextImage).css({
                    position: "absolute",
                    top: "0px",
                    bottom: "0px",
                    left: "0px",
                    right: "0px"
                });
                return nextImage;
            };
            /**
             * Returns the previous image element stored in the preloaded array.
             *
             * @private
             * @return {Object} div element containing the image.
             */
            Player.prototype.getPrevious = function () {
                var previousIndex = this._imgContainer.getIndex() - 1;
                if (previousIndex < 0) {
                    if (this._imgContainer.isRepeatable()) {
                        previousIndex = this._imgContainer.size() - 1;
                    }
                    else {
                        return null;
                    }
                }
                var previousImage = this._preloadImages[previousIndex];
                CSS.clearTransformsTransitions(previousImage);
                $(previousImage).css({
                    position: "absolute",
                    top: "0px",
                    bottom: "0px",
                    left: "0px",
                    right: "0px"
                });
                return previousImage;
            };
            /**
             * Sets the images on both sides when trying to drag the center image.
             *
             * @private
             */
            Player.prototype.setSideImages = function (offset) {
                if (!this._rightImage) {
                    var rightOffset = $(this._$viewport).width() + offset;
                    this._rightImage = this.getNext();
                    CSS.moveImage(rightOffset, 0, 1, 1, this._rightImage, 0);
                    $(this._$viewport).append(this._rightImage);
                }
                if (!this._leftImage) {
                    var leftOffset = ($(this._$viewport).width() + offset) * (-1);
                    this._leftImage = this.getPrevious();
                    CSS.moveImage(leftOffset, 0, 1, 1, this._leftImage, 0);
                    $(this._$viewport).append(this._leftImage);
                }
            };
            /**
             * Start transition.
             * transtion entry function.
             *
             * @private
             * @param {Object} TransitionSettings object.
             * @param {Function} function callback.
             */
            Player.prototype.transition = function (settings, callback) {
                var _this = this;
                // start transition
                SlideShow.Transition.startEffect(settings).always(function () {
                    _this.cleanViewPort(settings.viewport);
                    settings.newTarget.$element.off(CSS.transitionEnd);
                    setTimeout(function () {
                        callback();
                    }, settings.focusDuration);
                });
            };
            /**
             * Subscribe to touch and mouse events.
             * [Note] replace newer touch.js logic in 2014/04/25.
             *        We should call preventDefault() if needed, in any event callbacks.
             *
             * @private
             */
            Player.prototype.subscribeToEvents = function () {
                var _this = this;
                this._$viewport.on(touchEvent("doubletap"), function () {
                    if (!_this._settings.enableTouch || _this._isPlaying || _this._isPinching || _this._isTransitioning) {
                        return;
                    }
                    touchEventLog("Touch handled: [doubletap]");
                    var element = $(_this._$viewport).children(":first");
                    var currScale = CSS.getCssMatrixValue(element, "scaleX");
                    if (currScale !== 1) {
                        _this._isTransitioning = true;
                        CSS.moveImage(0, 0, 1, 1, element, _this._snapDuration, function () {
                            _this._currentScale = 1;
                            _this._isTransitioning = false;
                        });
                    }
                    else {
                        var transX = CSS.getCssMatrixValue(element, "translateX");
                        var transY = CSS.getCssMatrixValue(element, "translateY");
                        var defaultZoomScale = 3; // TODO: 画像サイズに合わせて拡大する必要がある。倍率ではない。
                        _this._isTransitioning = true;
                        CSS.moveImage(transX, transY, defaultZoomScale, defaultZoomScale, element, _this._snapDuration, function () {
                            _this._currentScale = CSS.getCssMatrixValue(element, "scaleX");
                            _this._isTransitioning = false;
                        });
                    }
                });
                this._$viewport.on(touchEvent("pinchstart"), function () {
                    if (!_this._settings.enableTouch || _this._isPlaying) {
                        return;
                    }
                    touchEventLog("Touch handled: [pinchstart]");
                    _this._isPinching = true;
                    var element = $(_this._$viewport).children(":first");
                    _this._currentScale = CSS.getCssMatrixValue(element, "scaleX");
                });
                this._$viewport.on(touchEvent("pinchout"), function (event, dragDistance) {
                    _this._isDragStarted = false;
                    var scaleFactor = (dragDistance / 100);
                    var scaleVal = _this._currentScale + scaleFactor;
                    if (!_this._settings.enableTouch || _this._isTransitioning || !_this._isPinching) {
                        return;
                    }
                    touchEventLog("Touch handled: [pinchout]");
                    if (_this._isPlaying) {
                        _this.pause();
                    }
                    _this.cleanViewPort(_this._$viewport);
                    var element = $(_this._$viewport).children(":first");
                    var offsetX = CSS.getCssMatrixValue(element, "translateX");
                    var offsetY = CSS.getCssMatrixValue(element, "translateY");
                    CSS.moveImage(offsetX, offsetY, scaleVal, scaleVal, element, 0);
                });
                this._$viewport.on(touchEvent("pinchin"), function (event, dragDistance) {
                    _this._isDragStarted = false;
                    var minScale = 0.7;
                    var scaleFactor = (dragDistance / 100);
                    var scaleVal = _this._currentScale - scaleFactor;
                    if (!_this._settings.enableTouch || _this._isTransitioning || !_this._isPinching || scaleVal < minScale) {
                        return;
                    }
                    touchEventLog("Touch handled: [pinchin]");
                    if (_this._isPlaying) {
                        _this.pause();
                    }
                    _this.cleanViewPort(_this._$viewport);
                    var element = $(_this._$viewport).children(":first");
                    var offsetX = CSS.getCssMatrixValue(element, "translateX");
                    var offsetY = CSS.getCssMatrixValue(element, "translateY");
                    CSS.moveImage(offsetX, offsetY, scaleVal, scaleVal, element, 0);
                });
                this._$viewport.on(touchEvent("pinchend"), function () {
                    if (!_this._settings.enableTouch || _this._isPlaying) {
                        return;
                    }
                    touchEventLog("Touch handled: [pinchend]");
                    var element = $(_this._$viewport).children(":first");
                    _this._currentScale = CSS.getCssMatrixValue(element, "scaleX");
                    _this._isPinching = false;
                });
                this._$viewport.on(touchEvent("dragstart"), function () {
                    if (!_this._settings.enableTouch || _this._isTransitioning || _this._isDragStarted || _this._isPinching) {
                        return;
                    }
                    if (_this._isPlaying) {
                        // change.
                        //						this.pause();
                        return;
                    }
                    touchEventLog("Touch handled: [dragstart]");
                    var element = $(_this._$viewport).children(":first");
                    _this._currentTranslateX = CSS.getCssMatrixValue(element, "translateX");
                    _this._currentTranslateY = CSS.getCssMatrixValue(element, "translateY");
                    _this.cleanViewPort(_this._$viewport);
                    _this.setSideImages(SlideShow.Transition.imageOffset);
                    _this._isDragStarted = true;
                });
                this._$viewport.on(touchEvent("drag"), function (event, touchX, touchY, deltaX, deltaY) {
                    if (!_this._settings.enableTouch || _this._isTransitioning || !_this._isDragStarted || _this._isPinching) {
                        return;
                    }
                    touchEventLog("Touch handled: [drag]");
                    var element = $(_this._$viewport).children(":first");
                    var scale = typeof _this._currentScale === "number" ? _this._currentScale : 1;
                    var newMoveX = deltaX + _this._currentTranslateX;
                    var newMoveY = scale !== 1 ? deltaY : 0;
                    newMoveY = newMoveY + _this._currentTranslateY;
                    CSS.moveImage(newMoveX, newMoveY, scale, scale, element, 0);
                    var offsetXBeforeShow = (($(element).find("img").width() * scale) - ($(_this._$viewport).width())) / 2;
                    var currentOffsetX = Math.abs(CSS.getCssMatrixValue(element, "translateX"));
                    if (currentOffsetX >= offsetXBeforeShow) {
                        var padding = offsetXBeforeShow > 0 ? offsetXBeforeShow : 0;
                        var rightOffset = $(_this._$viewport).width() + deltaX + SlideShow.Transition.imageOffset + _this._currentTranslateX + padding;
                        var leftOffset = (($(_this._$viewport).width() + SlideShow.Transition.imageOffset + padding) * (-1)) + deltaX + _this._currentTranslateX;
                        CSS.moveImage(rightOffset, 0, 1, 1, _this._rightImage, 0);
                        CSS.moveImage(leftOffset, 0, 1, 1, _this._leftImage, 0);
                    }
                });
                this._$viewport.on(touchEvent("swipe"), function (event, swipeValue, newOffsetX) {
                    if (!_this._settings.enableTouch || _this._isTransitioning || _this._isPinching) {
                        return;
                    }
                    touchEventLog("Touch handled: [swipe]");
                    _this._isTransitioning = true;
                    if (_this._isPlaying) {
                        _this.pause();
                    }
                    var element = $(_this._$viewport).children(":first");
                    var swipeOffset = $(_this._$viewport).width() / 3;
                    var sidePeekElem = swipeValue === "swipeleft" ? _this._rightImage : _this._leftImage;
                    var sideMoveValue = CSS.isTransitionSupported ? CSS.getCssMatrixValue(sidePeekElem, "translateX") : parseInt($(sidePeekElem).css("left"), 10);
                    var sidePeekWidth = $(_this._$viewport).width() - Math.abs(sideMoveValue);
                    var scale = typeof _this._currentScale === "number" ? _this._currentScale : 1;
                    var offsetYBeforeShow = (($(element).find("img").height() * scale) - ($(_this._$viewport).height())) / 2;
                    var currY = CSS.getCssMatrixValue(element, "translateY");
                    if (sidePeekElem && ((sidePeekWidth > swipeOffset && scale !== 1) || scale === 1)) {
                        if (swipeValue === "swipeleft") {
                            _this.stepUp(element, function () {
                                _this._isTransitioning = false;
                                _this._currentScale = 1;
                            });
                        }
                        else if (swipeValue === "swiperight") {
                            _this.stepDown(element, function () {
                                _this._isTransitioning = false;
                                _this._currentScale = 1;
                            });
                        }
                        else {
                            _this._isTransitioning = false;
                        }
                    }
                    else if (Math.abs(sidePeekWidth) !== SlideShow.Transition.imageOffset && scale === 1) {
                        if (Math.abs(currY) >= offsetYBeforeShow) {
                            _this.reposition(element, "xy");
                        }
                        else {
                            _this.reposition(element, "x");
                        }
                    }
                    else {
                        _this._isTransitioning = false;
                    }
                });
                this._$viewport.on(touchEvent("dragend"), function (event, endX, endY, newOffsetX, newOffsetY) {
                    if (!_this._settings.enableTouch || !_this._isDragStarted || _this._isPinching) {
                        return;
                    }
                    touchEventLog("Touch handled: [dragend]");
                    // animation callback cleanup did not happen, so clean it here
                    if (newOffsetX === 0 && _this._currentTranslateX === 0) {
                        _this.cleanViewPort(_this._$viewport);
                    }
                    _this._isDragStarted = false;
                    var element = $(_this._$viewport).children(":first");
                    _this._currentTranslateX = CSS.getCssMatrixValue(element, "translateX");
                    _this._currentTranslateY = CSS.getCssMatrixValue(element, "translateY");
                });
                //$(window).on("keydown", (event) => {
                //	if (!this._settings.enableTouch || this._isTransitioning || this._isDragStarted || this._isPinching) {
                //		return;
                //	}
                //	if (this._isPlaying) {
                //		this.pause();
                //	}
                //	var element = $(this._$viewport).children(":first");
                //	// bind for left/right arrow press
                //	if (event.keyCode === 37) {
                //		this._isTransitioning = true;
                //		this.stepDown(element, () => {
                //			this._isTransitioning = false;
                //			this._currentScale = 1;
                //		});
                //	} else if (event.keyCode === 39) {
                //		this._isTransitioning = true;
                //		this.stepUp(element, () => {
                //			this._isTransitioning = false;
                //			this._currentScale = 1;
                //		});
                //	}
                //});
            };
            Player.DATA_IMG_LOAD_SUCCEEDED = "data-image-load-succeeded";
            Player.DATA_IMG_LOAD_FAILED = "data-image-load-faild";
            Player._defaultOptions = {
                // SlideShow settings.
                preloadCount: 4,
                enableTouch: true,
                showFirstImageImmediately: true,
                setSpinnerCallback: null,
                stateChangedCallback: function (event, info) {
                },
                // event: "state:playback-image-changed", info: content index.
                //        "state:play-state-changed", info: play state.
                //        "error:max-error-count", info: undefined.
                // InfinityContainer settings.
                propAccesser: null,
                globalContainerMax: null,
                localContainerMax: null,
                setupContainer: null,
                repeat: false,
                firstContainerStart: 0,
                firstContainerEnd: null,
                firstContainerPosition: 0,
                allowedErrorMax: 100,
            };
            return Player;
        })();
        SlideShow.Player = Player;
    })(SlideShow = CDP.SlideShow || (CDP.SlideShow = {}));
})(CDP || (CDP = {}));

    return CDP.SlideShow;
}));

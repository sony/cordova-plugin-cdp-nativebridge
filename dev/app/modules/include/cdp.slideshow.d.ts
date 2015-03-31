/// <reference path="jquery.d.ts" />
/// <reference path="cdp.tools.proxy.d.ts" />
/// <reference path="cdp.tools.container.d.ts" />
declare module CDP {
    module SlideShow {
        interface TransitionProperty {
            start?: any;
            end?: any;
        }
        interface TransitionTarget {
            $element: JQuery;
            fade?: TransitionProperty;
            transform?: TransitionProperty;
        }
        interface TransitionSettings {
            viewport: JQuery;
            oldTarget?: TransitionTarget;
            newTarget: TransitionTarget;
            fadeDuration?: number;
            fadeTimingFunction?: string;
            transformDuration?: number;
            transformTimingFunction?: string;
            focusDuration: number;
        }
        interface TimerAnimationParam {
            start: number;
            end: number;
            distance: number;
        }
    }
}
declare module CDP {
    module SlideShow {
        /**
         * @class TimerAnimationInfo
         * @brief Slide Show internal class.
         */
        class TimerAnimationInfo {
            private _enableFade;
            private _opacity;
            private _enableTransform;
            private _scaleX;
            private _scaleY;
            private _translateX;
            private _translateY;
            private _cssPrefixes;
            constructor(_enableFade: boolean, _opacity: TimerAnimationParam, _enableTransform: boolean, _scaleX: TimerAnimationParam, _scaleY: TimerAnimationParam, _translateX: TimerAnimationParam, _translateY: TimerAnimationParam, _cssPrefixes: any);
            getFadeProperty(rev: number): any;
            getTransformProperty(rev: number): any;
            /**
             * Start timer animation.
             *
             * @private
             * @param  {Object} TransitionTarget object.
             * @param  {Number} fade duration.
             * @param  {Number} transform duration.
             */
            static start(target: TransitionTarget, fadeDuration: number, trasformDuration: number): JQueryPromise<any>;
            /**
             * Create timer animation information object.
             *
             * @private
             * @param  {Object} TransitionTarget object.
             * @param  {Number} fade duration.
             * @param  {Number} transform duration.
             * @return {Object} TimerAnimationInfo object.
             */
            private static createTimerAnimationInfo(target, fadeDuration, transformDuration);
        }
    }
}
declare module CDP {
    module SlideShow {
        /**
         * @class Transition
         * @brief Slide Show transition logic utility class
         */
        class Transition {
            private static s_imageOffset;
            static imageOffset: number;
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
            static slideIn(viewport: JQuery, newElem: JQuery, config: any, start: boolean): TransitionSettings;
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
            static fadeIn(viewport: JQuery, newElem: JQuery, config: any, start: boolean): TransitionSettings;
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
            static kenBurn(viewport: JQuery, newElem: JQuery, config: any, start: boolean): TransitionSettings;
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
            static fixedFadeInZoomOutInscribed(viewport: JQuery, newElem: JQuery, config: any, start: boolean): TransitionSettings;
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
            static fixedFadeInZoomOutCircumscribed(viewport: JQuery, newElem: JQuery, config: any, start: boolean): TransitionSettings;
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
            private static fixedFadeInZoomOutCommon(viewport, newElem, config, start, compare);
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
            static customEffect(viewport: JQuery, newElem: JQuery, config: any, start: boolean): TransitionSettings;
            /**
             * Start animation common API.
             * If browser doesn"t support css transition, fall back to use jQuery animation.
             *
             * @private
             * @param  {Object} TransitionSettings object.
             * @return jQueryPromise object.
             */
            static startEffect(settings: TransitionSettings): JQueryPromise<any>;
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
            private static initViewport(viewport, newElem);
            /**
             * Create fade transition property object.
             *
             * @private
             * @param  {Number} start opacity value.
             * @param  {Number} end opacity value.
             * @return {Object} TransitionProperty object.
             */
            private static createFadeProperty(opacityStart, opacityEnd);
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
            private static createTransformProperty(scaleStart, traslateXStart, translateYStart, scaleEnd, traslateXEnd, translateYEnd);
            /**
             * Create property object for Hardware Accelerator.
             *
             * @private
             * @param {Object} dom element that will be animated.
             * @return TransitionProperty object.
             */
            private static createHardwareAcceleratorProperty(element?);
            /**
             * startEffect() helper API.
             * implemented by css transtion property.
             *
             * @private
             * @param  {Object} TransitionSettings object.
             * @return jQueryPromise object.
             */
            private static startEffectByCssTransition(settings);
            /**
             * startEffect() helper API.
             * implemented by jQuery animation.
             *
             * @private
             * @param  {Object} TransitionSettings object.
             * @return jQueryPromise object.
             */
            private static startEffectByTimerAnimation(settings);
            /**
             * Set css properties to target.
             *
             * @private
             * @param  {Object} TransitionTarget object.
             * @param  {String} point of transtion identifier. {"start"/"end"}
             * @return {Object} Target jQuery object.
             */
            private static setTransitionProperty(target, point);
        }
    }
}
declare module CDP {
    module SlideShow {
        /**
         * @class Player
         * @brief Slide Show core logic.
         */
        class Player {
            private static DATA_IMG_LOAD_SUCCEEDED;
            private static DATA_IMG_LOAD_FAILED;
            private static _defaultOptions;
            private _settings;
            private _imgContainer;
            private _preloadImages;
            private _preloadCanceler;
            private _$viewport;
            private _transitionList;
            private _trIndx;
            private _isPlaying;
            private _isTransitioning;
            private _isDragStarted;
            private _isPinching;
            private _snapDuration;
            private _currentScale;
            private _currentTranslateX;
            private _currentTranslateY;
            private _errorCount;
            private _rightImage;
            private _leftImage;
            private _promise;
            private _resizeHandler;
            /**
             * Initialize
             *
             * @param  {Object} image data
             * @param  {Array} transition list
             * @param  {Object} viewport element
             * @param  {Object} setting option
             * @return {Object} jQueryPromise object.
             */
            init(imageData: any[], transitionList: any[], viewport: JQuery, options?: any): JQueryPromise<any>;
            /**
             * Terminate SlideShow object.
             *
             */
            terminate(): void;
            /**
             * Validate this SlideShow object.
             *
             * @return {Boolean} true: valid / false: invalid.
             */
            valid(): boolean;
            /**
             * Check async loading method.
             *
             * @return {Boolean} true: now loading / false: idle.
             */
            isLoading(): boolean;
            /**
             * Wait load condition.
             *
             * @return {Object} jQueryPromise object.
             */
            waitLoadComplete(): JQueryPromise<any>;
            /**
             * Returns viewport element.
             *
             * @return {Object} jQuery object.
             */
            getViewport(): JQuery;
            /**
             * Returns current image index.
             *
             * @return {Number} index.
             */
            getCurrentImageIndex(): number;
            /**
             * Set current image index.
             *
             * @param  {Number} index.
             * @return {Object} jQueryPromise object.
             */
            setCurrentImageIndex(index: number): JQueryPromise<any>;
            /**
             * Returns current image array element.
             *
             * @return {Object} current data.
             */
            getCurrentImageData(): any;
            /**
             * Remove current image array element.
             *
             * @return {Object} jQueryPromise object.
             */
            removeCurrentImage(): JQueryPromise<any>;
            /**
             * Returns image data array length.
             *
             * @return {Number} data size.
             */
            getImageDataCount(): number;
            /**
             * Returns image data raw container object.
             * advanced method.
             *
             * @return {Object} Tools.InfinityContainer object.
             */
            getImageDataContainer(): Tools.InfinityContainer;
            /**
             * Returns if slideshow is playing or not.
             *
             * @return {Boolean} true: playing / false: stopped.
             */
            isPlaying(): boolean;
            /**
             * Pause slideshow and shows next image.
             *
             * @param {Object} current element.
             * @param {Function} callback.
             * @param {Number} duration.
             */
            stepUp(currentElement?: JQuery, callbackStep?: () => void, durationOverride?: number): void;
            /**
             * Pause slideshow and shows previous image.
             *
             * @param {Object} current element
             * @param {Function} callback
             * @param {Number} duration
             */
            stepDown(currentElement?: JQuery, callbackStep?: () => void, durationOverride?: number): void;
            /**
             * Plays slideshow, loops through images and transitions
             */
            play(): void;
            /**
             * Stops transitions and resets the indeces.
             */
            stop(): JQueryPromise<any>;
            /**
             * Stops transitions but do not reset indeces.
             */
            pause(): void;
            /**
             * Stops then play slideshow from beginning.
             */
            restart(): void;
            /**
             * Set touch event enable setting.
             *
             * @param {Boolean} true: enable / false: disable.
             */
            enableTouchEvent(enable: boolean): void;
            /**
             * Check async condition method.
             *
             * @return {Boolean} true: now async proccess / false: idle.
             */
            isInAsyncProc(): boolean;
            /**
             * Wait async condition.
             *
             * @return {Object} jQueryPromise object.
             */
            waitAsyncProc(): JQueryPromise<any>;
            /**
             * Manage for JQueryPromise<any> life cicle.
             *
             * @private
             * @return {Object} jQueryPromise object.
             */
            private managePromise(df);
            /**
             * Notify state change callback.
             *
             * @private
             */
            private notifyStateChanged(state, info?);
            /**
             * Initialize preloaded images array base on preloaded count value.
             *
             * @private
             */
            private initPreloadedImages();
            /**
             * Delete preloaded image.
             *
             * @private
             * @param index {Number} [in] index as key.
             */
            private deletePreloadedImage(index);
            /**
             * Shows current image in the view port.
             *
             * @private
             * @return {Object} jQueryPromise object.
             */
            private showCurrentImage();
            /**
             * Cleans the viewport, removes the left and right images,
             * and make sure there"s only 1 image in the viewport.
             *
             * @private
             * @param {Object} viewport element.
             */
            private cleanViewPort(viewport);
            /**
             * Reposition the element by adjusting it"s x/y translate values so it snaps on the edge.
             *
             * @private
             * @param {Object} element.
             * @param {String} values can be "x", "y", or "xy".
             */
            private reposition(element, axis);
            /**
             * Resize current image and preload caches.
             * window resize handler.
             *
             * @private
             */
            private resizeImages();
            /**
             * Apply css attributes to an image element so it is centered.
             *
             * @private
             * @param {Object} image element.
             * @param {Object} viewport element where the image will be shown.
             */
            private centerImage(img, viewport);
            /**
             * Apply spinner or loading message to an element.
             *
             * @private
             * @param {Object} viewport element where the image will be shown.
             * @param {Object} element.
             */
            private setSpinner(viewport, element);
            /**
             * Prepare Image Div from _imgContainer.
             * this method wraps for _imgContainer's async or sync accessor
             *
             * @private
             * @param index {Number} [in] image index.
             * @return {jQueryPromise} done(div: HTMLElement).
             */
            private prepareImageDiv(index);
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
            private getImageDiv(viewport, imgUrl, imageDiv?);
            /**
             * Wait for current preload image load complete.
             *
             * @private
             * @return {Object} jQueryPromise.
             */
            private waitForCurrentImageReady();
            /**
             * Moves image index and transition index forward.
             *
             * @private
             */
            private moveIndecesForward();
            /**
             * Moves transition index forward.
             *
             * @private
             */
            private moveNextTransition();
            /**
             * Move next container.
             *
             * @private
             */
            private moveNext();
            /**
             * Moves preloadedImages index to the right.
             *
             * @private
             */
            private movePreloadToRight();
            /**
             * Move previous container.
             *
             * @private
             */
            private movePrevious();
            /**
             * Moves preloadedImages index to the left.
             *
             * @private
             */
            private movePreloadToLeft();
            /**
             * Returns the next image element stored in the preloaded array.
             *
             * @private
             * @return {Object} div element containing the image.
             */
            private getNext();
            /**
             * Returns the previous image element stored in the preloaded array.
             *
             * @private
             * @return {Object} div element containing the image.
             */
            private getPrevious();
            /**
             * Sets the images on both sides when trying to drag the center image.
             *
             * @private
             */
            private setSideImages(offset);
            /**
             * Start transition.
             * transtion entry function.
             *
             * @private
             * @param {Object} TransitionSettings object.
             * @param {Function} function callback.
             */
            private transition(settings, callback);
            /**
             * Subscribe to touch and mouse events.
             * [Note] replace newer touch.js logic in 2014/04/25.
             *        We should call preventDefault() if needed, in any event callbacks.
             *
             * @private
             */
            private subscribeToEvents();
        }
    }
}

/// <reference path="jquery.d.ts" />
/// <reference path="modernizr.custom.d.ts" />
/// <reference path="sylvester.d.ts" />
declare module CDP {
    module Tools {
        /**
         * @class CSS
         * @brief JavaScript で CSS を操作するときに使用するユーティリティクラス
         */
        class CSS {
            private static _is3dSupported;
            private static _isTransitionSupported;
            static is3dSupported: boolean;
            static isTransitionSupported: boolean;
            /**
             * "transitionend" のイベント名配列を返す
             *
             * @return {Array} transitionend イベント名
             */
            static transitionEnd: string;
            /**
             * css の vender 拡張 prefix を返す
             *
             * @return {Array} prefix
             */
            static cssPrefixes: string[];
            static cssHideBackFace: any;
            /**
             * Build css property string for scale and translate.
             *
             * @param  {Number} scale: scaling value, by using same value for x y coordinate.
             * @param  {Number} traslateX: x translate value, unit is pixel.
             * @param  {Number} traslateY: y translate value, unit is pixel.
             * @return {String} ex): "scale3d(1.5,1.5,1.0) translate3d(10px,20px,0px)"
             */
            static buildCssTransformString(scale: number, traslateX: number, translateY: number): string;
            /**
             * Build css property string for scale.
             *
             * @param  {Number} scale: scaling value, by using same value for x y coordinate.
             * @return {String} ex): "scale3d(1.5,1.5,1.0)"
             */
            static buildCssScaleString(scale: number): string;
            /**
             * Build css property string for translate.
             *
             * @param  {Number} traslateX: x translate value, unit is pixel.
             * @param  {Number} traslateY: y translate value, unit is pixel.
             * @return {String} ex): "translate3d(10px,20px,0px)"
             */
            static buildCssTranslateString(traslateX: number, translateY: number): string;
            /**
             * Gets matrix value.
             *
             * @private
             * @param {String} matrix index
             * @return {Number} value
             */
            static getCssMatrixValue(element: HTMLElement, type: string): number;
            static getCssMatrixValue(element: JQuery, type: string): number;
            /**
             * Clears the transformations, transitions, or animations.
             *
             * @private
             * @param {Object} element
             */
            static clearTransformsTransitions(element: HTMLElement): void;
            static clearTransformsTransitions(element: JQuery): void;
            /**
             * css transition property を削除する
             *
             * @param element {JQuery} [in] 対象の jQuery オブジェクト
             */
            static clearTransitions(element: HTMLElement): void;
            static clearTransitions(element: JQuery): void;
            /**
             * css fade transition property を付与する
             *
             * @param element {JQuery} [in] 対象の jQuery オブジェクト
             * @param msec    {Number} [in] フェードの時間
             * @param element {String} [in] フェードのタイミング関数 { https://developer.mozilla.org/ja/docs/Web/CSS/timing-function }
             */
            static setFadeProperty(element: HTMLElement, msec: number, timingFunction: string): void;
            static setFadeProperty(element: JQuery, msec: number, timingFunction: string): void;
            /**
             * Moves the element using css translate or translate3d.
             *
             * @param {Number} horizontal offset.
             * @param {Number} vertical offset.
             * @param {Number} scale x.
             * @param {Number} scale y.
             * @param {Object} element to move.
             * @param {Number} duration in milliseconds.
             * @param {Function} callback after the animation.
             */
            static moveImage(offsetX: number, offsetY: number, scaleX: number, scaleY: number, element: HTMLElement, duration: number, callback?: Function): void;
            static moveImage(offsetX: number, offsetY: number, scaleX: number, scaleY: number, element: JQuery, duration: number, callback?: Function): void;
            /**
             * Moves the element without using css translate.
             *
             * @param {Number} horizontal offset.
             * @param {Number} vertical offset.
             * @param {Object} element to move.
             * @param {Number} duration in milliseconds.
             * @param {Function} callback after the animation.
             */
            static moveImageNoTranslate(offsetX: number, offsetY: number, element: HTMLElement, duration: number, callback?: Function): void;
            static moveImageNoTranslate(offsetX: number, offsetY: number, element: JQuery, duration: number, callback?: Function): void;
            /**
             * Detects if the browser supports 3d tranforms.
             *
             * @private
             * @return {Boolean} true: has / false: doesn"t.
             */
            private static has3d();
            /**
             * Returns true if the browser supports css transitions
             * currently, this only returns false for IE9 and below.
             *
             * @private
             * @return {Boolean} true: supported / false: not supported.
             */
            private static supportsTransitions();
            /**
            * Apply transforms values to an element
            * @param {Object} jquery element
            * @param {Object} configuration options
            * @private
            */
            private static transformElement(element, config);
            private static transformElement(element, config);
            /**
             * function to use if 3d transformations are not supported. Fall back to 2D support.
             *
             * @param {Object} configurations and overrides
             * @return null
             */
            private static transformElement2D(config);
            /**
             * function to use if 3d transformations are supported
             *
             * @param {Object} configurations and overrides
             * @return null
             */
            private static transformElement3D(config);
        }
    }
}
declare module CDP {
    module Tools {
        /**
         * タッチイベント名を解決する
         *
         * @param plane {String} [in] plane イベント名を指定. ex) "swipe"
         * @return {String} 実際に使用するイベント名
         */
        function touchEvent(plane: string): string;
        module Touch {
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
            function setTarget(element: JQuery): void;
            /**
             * [PMO]
             * Unbind original events from target element.
             * @param  {JQuery} element [in]
             *       This dom element receives origEvents
             *       and then sends customEvents to handlers which are bind by Touch module user.
             */
            function removeTarget(element: JQuery): void;
            function _bindToElement(customEvent: any, element: any): void;
        }
    }
}

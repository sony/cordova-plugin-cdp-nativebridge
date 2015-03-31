

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["cdp.tools"], function () {
            return factory(root.CDP || (root.CDP = {}));
        });
    }
    else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}));
    }
}(this, function (CDP) {
    CDP.Tools = CDP.Tools || {};
    var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        Tools.INVALID_INDEX = -1;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));

var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var TAG = "[CDP.Tools.CursorArray] ";
        /**
         * @class CursorArray
         * @brief Provide cursor interface for Array object.
         *        NOTE: This class does not have metaphor for BOF and EOF.
         */
        var CursorArray = (function () {
            /**
             * constructor
             *
             * @param {Array}  target Target Array object.
             * @param {Object} accesser Property accesser function object.
             */
            function CursorArray(target, accesser) {
                this._array = null;
                this._index = Tools.INVALID_INDEX;
                this._accesser = null;
                this.setArray(target, accesser);
            }
            ///////////////////////////////////////////////////////////////////////
            // public methods
            /**
             * setArray
             * set array contents this CursorArray class.
             *
             * @param {Array}  target Target Array object.
             * @param {Object} accesser Property accesser function object.
             */
            CursorArray.prototype.setArray = function (target, propAccesser) {
                if (!(target instanceof Array) || 0 === target.length) {
                    console.error(TAG + "target is not valid array.");
                    this.reset();
                    return false;
                }
                else {
                    this.reset();
                    this._array = target;
                    this._index = 0; // set first content.
                    if (!!propAccesser) {
                        this._accesser = propAccesser;
                    }
                    return true;
                }
            };
            Object.defineProperty(CursorArray.prototype, "accesser", {
                //! get accesser property
                get: function () {
                    return this._accesser;
                },
                //! set accesser property
                set: function (propAccesser) {
                    this._accesser = propAccesser;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Check the object has async property accesser
             *
             * @return {Boolean} true: has / flase: doesn't have.
             */
            CursorArray.prototype.hasAsyncAccesser = function () {
                return this._accesser ? !!this._accesser.async : false;
            };
            /**
             * get
             *
             * @param {Number} index, array index.
             * @return Array value of index position.
             */
            CursorArray.prototype.get = function (index) {
                var element = this.getData(index);
                if (null != element && !!this._accesser) {
                    return this._accesser(element);
                }
                else {
                    return element;
                }
            };
            /**
             * getData
             * returns array element.
             *
             * @param {Number} index, array index.
             * @return Array value of index position.
             */
            CursorArray.prototype.getData = function (index) {
                if (!this.valid()) {
                    return null;
                }
                index = (null != index) ? index : this._index;
                if (Tools.INVALID_INDEX === index || index < 0 || this.size() - 1 < index) {
                    console.error(TAG + "invalid range. index: " + index);
                    return null;
                }
                return this._array[index];
            };
            /**
             * remove
             * Remove index element.
             *
             * @param @param {Number} index, array index.
             * @return {Boolean} true: succeeded / false: failed.
             */
            CursorArray.prototype.remove = function (index) {
                if (!this.valid()) {
                    return false;
                }
                index = (null != index) ? index : this._index;
                if (Tools.INVALID_INDEX === index || index < 0 || this.size() - 1 < index) {
                    console.error(TAG + "invalid range. index: " + index);
                    return false;
                }
                this._array.splice(index, 1);
                return true;
            };
            /**
             * size
             *
             * @return {Number} size of array
             */
            CursorArray.prototype.size = function () {
                if (!this.valid()) {
                    return 0;
                }
                else {
                    return this._array.length;
                }
            };
            /**
             * getIndex
             *
             * @return current index position value.
             */
            CursorArray.prototype.getIndex = function () {
                return this._index;
            };
            /**
             * getArray
             * Get raw Array object's 'shallow' copy.
             * NOTE: If you override array's element, reflected to original.
             *
             * @param  raw {Boolean} [in] true: raw array reference / false: shallow copy instance.
             * @return {Object} array object.
             */
            CursorArray.prototype.getArray = function (raw) {
                if (raw === void 0) { raw = false; }
                if (!this.valid()) {
                    return null;
                }
                if (raw) {
                    return this._array;
                }
                else {
                    return this._array.slice(0);
                }
            };
            /**
             * isFirst
             * Check index position of first.
             */
            CursorArray.prototype.isFirst = function () {
                if (!this.valid()) {
                    return false;
                }
                return 0 === this._index;
            };
            /**
             * isLast
             * Check index position of last.
             */
            CursorArray.prototype.isLast = function () {
                if (!this.valid()) {
                    return false;
                }
                return (this._array.length - 1) === this._index;
            };
            /**
             * seek
             * Jamp to index position.
             *
             * @param {Number} index Target index.
             * @return Array value of index position.
             */
            CursorArray.prototype.seek = function (index) {
                if (!this.valid()) {
                    return null;
                }
                if (0 <= index && index < this._array.length) {
                    this._index = index;
                    return this.get();
                }
                else {
                    console.error(TAG + "invalid index range.");
                    return null;
                }
            };
            /**
             * first
             * Move cursor first index.
             *
             * @return Array value of index position.
             */
            CursorArray.prototype.first = function () {
                return this.seek(0);
            };
            /**
             * last
             * Move cursor last index.
             *
             * @return Array value of index position.
             */
            CursorArray.prototype.last = function () {
                if (!this.valid()) {
                    return null;
                }
                return this.seek(this._array.length - 1);
            };
            /**
             * previous
             * Move cursor previous index.
             *
             * @return Array value of index position.
             */
            CursorArray.prototype.previous = function () {
                if (!this.valid()) {
                    return null;
                }
                if (this._index <= 0) {
                    return null;
                }
                else {
                    this._index--;
                    return this.get();
                }
            };
            /**
             * next
             * Move cursor next index.
             *
             * @return Array value of index position.
             */
            CursorArray.prototype.next = function () {
                if (!this.valid()) {
                    return null;
                }
                if (this._array.length - 1 <= this._index) {
                    return null;
                }
                else {
                    this._index++;
                    return this.get();
                }
            };
            /**
             * reset
             * reset CursorArray state.
             *
             */
            CursorArray.prototype.reset = function () {
                this._array = null;
                this._index = Tools.INVALID_INDEX;
            };
            /**
             * valid
             * valid CursorArray state.
             */
            CursorArray.prototype.valid = function () {
                return !!this._array;
            };
            return CursorArray;
        })();
        Tools.CursorArray = CursorArray;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));


var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var TAG = "[CDP.Tools.InfinityContainer] ";
        /**
         * @class InfinityContainer
         * @brief Provide infinity container operation.
         *        implemented by ring buffer archtecture.
         */
        var InfinityContainer = (function () {
            function InfinityContainer() {
                this._globalIndex = Tools.INVALID_INDEX;
                this._prevData = null;
                this._currentData = null;
                this._nextData = null;
                this._settings = null;
                this._prmsManager = null;
                this._reservedSeek = [];
            }
            InfinityContainer.prototype.init = function (firstContainer, options) {
                var container = null;
                var accesser = null;
                var defaultOptions = {
                    propAccesser: null,
                    globalContainerMax: null,
                    localContainerMax: null,
                    setupContainer: null,
                    repeat: false,
                    firstContainerStart: 0,
                    firstContainerEnd: null,
                    firstContainerPosition: 0,
                };
                this.reset();
                if (firstContainer instanceof Array) {
                    if (!!options && null != options.propAccesser) {
                        accesser = options.propAccesser;
                    }
                    container = new Tools.CursorArray(firstContainer, accesser);
                }
                else if (firstContainer instanceof Tools.CursorArray) {
                    container = firstContainer;
                }
                if (!container || !container.valid()) {
                    console.error(TAG + "invalid firstContainer.");
                    return $.Deferred().reject();
                }
                // setup settings
                this._settings = $.extend({}, defaultOptions, options);
                if (!this._settings.globalContainerMax) {
                    this._settings.globalContainerMax = container.size();
                }
                if (!this._settings.localContainerMax) {
                    this._settings.localContainerMax = container.size();
                }
                this._settings.firstContainerEnd = this._settings.firstContainerStart + container.size() - 1;
                this._currentData = {
                    container: container,
                    start: this._settings.firstContainerStart,
                    end: this._settings.firstContainerEnd,
                    dirty: false,
                };
                this._globalIndex = this._settings.firstContainerPosition;
                return this.manageState(this.prepareReservedContainers());
            };
            /**
             * valid
             * Validate this InfinityContainer object
             *
             */
            InfinityContainer.prototype.valid = function () {
                if (this.validContainer(this._currentData, true)) {
                    if (this._currentData.start <= this._globalIndex && this._globalIndex <= this._currentData.end) {
                        return true;
                    }
                }
                return false;
            };
            /**
             * isInAsyncProc
             * Check async condition method.
             *
             */
            InfinityContainer.prototype.isInAsyncProc = function () {
                if (0 < this._prmsManager.promises().length) {
                    return true;
                }
                else {
                    return false;
                }
            };
            /**
             * waitAsyncProc
             * Wait async condition.
             *
             */
            InfinityContainer.prototype.waitAsyncProc = function () {
                var _this = this;
                var df = $.Deferred();
                var check = function () {
                    var promises = _this._prmsManager.promises();
                    if (0 < promises.length) {
                        Tools.wait(promises).always(function () {
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
             * Check the object has async property accesser
             *
             * @return {Boolean} true: has / flase: doesn't have.
             */
            InfinityContainer.prototype.hasAsyncAccesser = function () {
                if (!this.valid()) {
                    return false;
                }
                return this._currentData.container.hasAsyncAccesser();
            };
            /**
             * get
             * Get value of container.
             * If the object cannot accsess available container by index, this method returns null.
             *
             * @param {Number} index, array index.
             * @return Container value of index position.
             */
            InfinityContainer.prototype.get = function (index) {
                if (!this.validContainer(this._currentData, true)) {
                    return null;
                }
                var accessIndex = (null != index) ? index : this._globalIndex;
                var range = this.checkIterateRange(accessIndex);
                if (range.canSync) {
                    return range.container.container.seek(range.localIndex);
                }
                else {
                    console.error(TAG + "cannot sync access, invalid range. index[current:set] = [" + this._globalIndex + ":" + accessIndex + "]");
                    return null;
                }
            };
            /**
             * remove
             * Remove index element.
             * If the object cannot accsess available container by index, this method fails.
             *
             * @param @param {Number} index, array index.
             * @return {Boolean} true: succeeded / false: failed.
             */
            InfinityContainer.prototype.remove = function (index) {
                var _this = this;
                if (!this.validContainer(this._currentData, true)) {
                    return false;
                }
                var accessIndex = (null != index) ? index : this._globalIndex;
                var shift = function (lhs, rhs) {
                    if (_this.validContainer(lhs, true) && _this.validContainer(rhs, true) && lhs.end < rhs.start) {
                        var element = rhs.container.getArray(true).shift();
                        lhs.container.getArray(true).push(element);
                        rhs.dirty = true;
                        lhs.dirty = (lhs.container.size() !== _this._settings.localContainerMax);
                    }
                    else {
                        lhs.dirty = true;
                    }
                };
                var ensure = function () {
                    var check = function (target) {
                        if (_this.validContainer(target, true)) {
                            if (target.container.size() <= 0) {
                                return false;
                            }
                        }
                        return true;
                    };
                    if (!check(_this._prevData)) {
                        _this._prevData = _this.resetContainer();
                    }
                    if (!_this.valid() || !check(_this._currentData)) {
                        _this._currentData = _this.resetContainer();
                    }
                    if (!check(_this._nextData)) {
                        _this._nextData = _this.resetContainer();
                    }
                };
                var revise = function (target) {
                    switch (target) {
                        case "backward":
                            shift(_this._prevData, _this._currentData);
                            shift(_this._currentData, _this._nextData);
                            break;
                        case "":
                            shift(_this._currentData, _this._nextData);
                            break;
                        case "forward":
                            _this._nextData.dirty = true;
                            break;
                        default:
                            break;
                    }
                    ensure();
                    if (!_this.validContainer(_this._currentData, true)) {
                        _this.manageState(_this.requeryContainers(_this._globalIndex));
                    }
                    else if (!_this.validContainer(_this._prevData) && !_this.validContainer(_this._nextData, true)) {
                        _this.manageState(_this.prepareReservedContainers());
                    }
                    else if (!_this.validContainer(_this._prevData)) {
                        _this.manageState(_this.prepareBackwardContainer());
                    }
                    else if (!_this.validContainer(_this._nextData, true)) {
                        _this.manageState(_this.prepareForwardContainer());
                    }
                };
                var updateRelatedContainer = function (range) {
                    var hasReserved = _this._currentData.start !== 0 || _this._currentData.end !== _this._settings.globalContainerMax;
                    if (hasReserved) {
                        revise(range.shift);
                    }
                    else {
                        _this._currentData.end--;
                    }
                };
                var range = this.checkIterateRange(accessIndex);
                if (range.canSync) {
                    if (range.container.container.remove(range.localIndex)) {
                        this._settings.globalContainerMax--;
                        if (this._settings.globalContainerMax <= this._globalIndex) {
                            this._globalIndex = this._settings.globalContainerMax - 1;
                        }
                        if (0 < this._settings.globalContainerMax) {
                            updateRelatedContainer(range);
                        }
                        else {
                            this._prevData = this.resetContainer();
                            this._currentData = this.resetContainer();
                            this._nextData = this.resetContainer();
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    console.error(TAG + "cannot sync access, invalid range. index[current:set] = [" + this._globalIndex + ":" + accessIndex + "]");
                    return false;
                }
            };
            /**
             * size
             * Get all container size.
             *
             */
            InfinityContainer.prototype.size = function () {
                return this._settings.globalContainerMax;
            };
            /**
             * getIndex
             * Get all container index position value.
             *
             */
            InfinityContainer.prototype.getIndex = function () {
                return this._globalIndex;
            };
            /**
             * getCurrentCursorArray
             * Get current raw CursorArray Object.
             *
             */
            InfinityContainer.prototype.getCurrentCursorArray = function () {
                if (!this.valid()) {
                    return null;
                }
                this._currentData.container.seek(this._globalIndex - this._currentData.start);
                return this._currentData.container;
            };
            /**
             * getCurrentArray
             * Get current raw Array Object.
             *
             */
            InfinityContainer.prototype.getCurrentArray = function () {
                if (!this.valid()) {
                    return null;
                }
                return this._currentData.container.getArray();
            };
            /**
             * setRepeat
             * Update repeat setting.
             *
             * @param {Boolean} enable, true:repeat, false:no repeat
             */
            InfinityContainer.prototype.setRepeat = function (enable) {
                this._settings.repeat = enable;
                if (this.validContainer(this._currentData) && (!this.validContainer(this._prevData) || !this.validContainer(this._nextData))) {
                    this.manageState(this.prepareReservedContainers());
                }
            };
            /**
             * isRepeatable
             * Check current repeat state.
             *
             * @return {Boolean} true: enbale/false: disable
             */
            InfinityContainer.prototype.isRepeatable = function () {
                return this._settings.repeat;
            };
            /**
             * isFirst
             * Check index position of first.
             *
             * @param {Boolean} ignoreRepeat, always detect content if repeat set.
             */
            InfinityContainer.prototype.isFirst = function (ignoreRepeat) {
                if (ignoreRepeat === void 0) { ignoreRepeat = false; }
                var repeat = !ignoreRepeat && this._settings.repeat;
                if (!this.valid() || repeat) {
                    return false;
                }
                return 0 === this._globalIndex;
            };
            /**
             * isLast
             * Check index position of last.
             *
             * @param {Boolean} ignoreRepeat, always detect content if repeat set.
             */
            InfinityContainer.prototype.isLast = function (ignoreRepeat) {
                if (ignoreRepeat === void 0) { ignoreRepeat = false; }
                var repeat = !ignoreRepeat && this._settings.repeat;
                if (!this.valid() || repeat) {
                    return false;
                }
                return (this._settings.globalContainerMax - 1) === this._globalIndex;
            };
            /**
             * seek
             * Jamp to index position.
             *
             * @param {Number} index Target index.
             * @return IterateResult object.
             *      {
             *          succeeded   : bool;
             *          promise     : JQueryPromise<any>;
             *          value       : any;
             *      }
             */
            InfinityContainer.prototype.seek = function (index) {
                var _this = this;
                var df = $.Deferred();
                var result = { succeeded: false, promise: null, value: null };
                if (!this.validContainer(this._currentData, true) || index < 0 || this._settings.globalContainerMax - 1 < index) {
                    console.error(TAG + "invalid state.");
                    result.promise = $.Deferred().reject();
                    return result;
                }
                result.promise = df.promise();
                result.succeeded = true;
                var range = this.checkIterateRange(index);
                if (range.canSync && !range.container.dirty) {
                    this._globalIndex = index;
                    result.value = range.container.container.seek(range.localIndex);
                    switch (range.shift) {
                        case "backward":
                            this.manageState(this.shiftBackwardContainer());
                            break;
                        case "forward":
                            this.manageState(this.shiftForwardContainer());
                            break;
                        default:
                            break;
                    }
                    result.promise = df.resolve(index);
                }
                else {
                    this._reservedSeek.push({ index: index, df: df });
                    var proc = function () {
                        _this.waitAsyncProc().always(function () {
                            var target;
                            // gurd reentrance
                            if (_this._reservedSeek.length <= 0) {
                                return;
                            }
                            target = _this._reservedSeek.shift();
                            // case of sync access ready.
                            var range = _this.checkIterateRange(target.index);
                            if (range.canSync && !range.container.dirty) {
                                _this._globalIndex = target.index;
                                switch (range.shift) {
                                    case "backward":
                                        _this.manageState(_this.shiftBackwardContainer());
                                        break;
                                    case "forward":
                                        _this.manageState(_this.shiftForwardContainer());
                                        break;
                                    default:
                                        break;
                                }
                                target.df.resolve(target.index);
                                if (0 < _this._reservedSeek.length) {
                                    setTimeout(proc, 0);
                                }
                                return;
                            }
                            else {
                                // case of requery container.
                                _this.manageState(_this.requeryContainers(target.index)).then(function () {
                                    _this._globalIndex = target.index;
                                    target.df.resolve(target.index);
                                    if (0 < _this._reservedSeek.length) {
                                        setTimeout(proc, 0);
                                    }
                                }).fail(function () {
                                    console.error(TAG + "queryContainer(), failed.");
                                    target.df.reject(target.index);
                                    if (0 < _this._reservedSeek.length) {
                                        setTimeout(proc, 0);
                                    }
                                });
                            }
                        });
                    };
                    // start sync call.
                    proc();
                }
                return result;
            };
            /**
             * first
             * Jamp to first index position.
             *
             * @return IterateResult object.
             *      {
             *          succeeded   : bool;
             *          promise     : JQueryPromise<any>;
             *          value       : any;
             *      }
             */
            InfinityContainer.prototype.first = function () {
                return this.seek(0);
            };
            /**
             * last
             * Jamp to last index position.
             *
             * @return IterateResult object.
             *      {
             *          succeeded   : bool;
             *          promise     : JQueryPromise<any>;
             *          value       : any;
             *      }
             */
            InfinityContainer.prototype.last = function () {
                return this.seek(this._settings.globalContainerMax - 1);
            };
            /**
             * previous
             * Move cursor previous index.
             *
             * @return IterateResult object.
             *      {
             *          succeeded   : bool;
             *          promise     : JQueryPromise<any>;
             *          value       : any;
             *      }
             */
            InfinityContainer.prototype.previous = function () {
                var nextIndex = this._globalIndex - 1;
                if (nextIndex < 0) {
                    if (this._settings.repeat) {
                        nextIndex = this._settings.globalContainerMax - 1;
                    }
                    else {
                        return { succeeded: false, promise: $.Deferred().reject(), value: null };
                    }
                }
                return this.seek(nextIndex);
            };
            /**
             * next
             * Move cursor next index.
             *
             * @return IterateResult object.
             *      {
             *          succeeded   : bool;
             *          promise     : JQueryPromise<any>;
             *          value       : any;
             *      }
             */
            InfinityContainer.prototype.next = function () {
                var nextIndex = this._globalIndex + 1;
                if (this._settings.globalContainerMax <= nextIndex) {
                    if (this._settings.repeat) {
                        nextIndex = 0;
                    }
                    else {
                        return { succeeded: false, promise: $.Deferred().reject(), value: null };
                    }
                }
                return this.seek(nextIndex);
            };
            /**
             * updateSetupContainer
             * if in async proc, this method returns always fallse.
             *
             * @param  {Function} setupContainer functions.
             * @param  {Object}  property accesser function object.
             * @return {Boolean} true: succeeded / false: failed.
             */
            InfinityContainer.prototype.updateSetupContainer = function (setupContainer, accesser) {
                if (!this.valid() || this.isInAsyncProc()) {
                    return false;
                }
                else if (typeof setupContainer !== "function") {
                    console.error(TAG + "invalid function type.");
                    return false;
                }
                this._settings.setupContainer = setupContainer;
                if (!!accesser) {
                    this.updateAccesser(this._prevData, accesser);
                    this.updateAccesser(this._currentData, accesser);
                    this.updateAccesser(this._nextData, accesser);
                }
                return true;
            };
            /**
             * clone
             * deep copy method including container members.
             *
             * @return {Boolean} true: succeeded / false: failed.
             */
            InfinityContainer.prototype.clone = function () {
                if (!this.valid()) {
                    return null;
                }
                var target = $.extend(true, {}, this);
                // deep copy for container stuff.
                target._prevData.container = $.extend(true, {}, this._prevData.container);
                target._currentData.container = $.extend(true, {}, this._currentData.container);
                target._nextData.container = $.extend(true, {}, this._nextData.container);
                return target;
            };
            ///////////////////////////////////////////////////////////////////////
            // private methods
            /**
             * reset
             * Cleanup this class.
             *
             */
            InfinityContainer.prototype.reset = function () {
                this._globalIndex = Tools.INVALID_INDEX;
                this._prevData = this.resetContainer();
                this._currentData = this.resetContainer();
                this._nextData = this.resetContainer();
                this._settings = null;
                this._prmsManager = new Tools.PromiseManager();
            };
            /**
             * resetContainer
             *
             * @return Create empty Container.
             */
            InfinityContainer.prototype.resetContainer = function () {
                return {
                    container: null,
                    start: Tools.INVALID_INDEX,
                    end: Tools.INVALID_INDEX,
                    dirty: false,
                };
            };
            /**
             * updateAccesser
             *
             * @param {Object} target Target Container object.
             * @param  {Object}  property accesser function object.
             * @return true:succeeded / false:failed.
             */
            InfinityContainer.prototype.updateAccesser = function (target, accesser) {
                if (!!target && !!target.container) {
                    target.container.accesser = accesser;
                    return true;
                }
                else {
                    return false;
                }
            };
            /**
             * Manage for async status.
             *
             */
            InfinityContainer.prototype.manageState = function (df) {
                return this._prmsManager.add(Tools.makePromise(df));
            };
            /**
             * validContainer
             * private method.
             *
             * @param {Object} target Target Container object.
             */
            InfinityContainer.prototype.validContainer = function (target, ignoreDirty) {
                if (ignoreDirty === void 0) { ignoreDirty = false; }
                if (!!target && !!target.container && Tools.INVALID_INDEX !== target.start && Tools.INVALID_INDEX !== target.end && target.start <= target.end) {
                    if (ignoreDirty) {
                        return true;
                    }
                    else {
                        return !target.dirty;
                    }
                }
                else {
                    return false;
                }
            };
            /**
             * queryContainer
             * private async method.
             *
             * @param {Object} target Target Container object.
             * @param {Number} index  Index of Container start/end index.
             * @param {String} direction If 'forward', index means start index, else means end index.
             */
            InfinityContainer.prototype.queryContainer = function (target, index, direction) {
                var df = $.Deferred();
                var start = Tools.INVALID_INDEX;
                var end = Tools.INVALID_INDEX;
                var newContainer = null;
                var oldAccesser = (this._currentData.container) ? this._currentData.container.accesser : null;
                if (!!this._settings.setupContainer) {
                    switch (direction) {
                        case "backward":
                            start = Math.floor(index / this._settings.localContainerMax) * this._settings.localContainerMax;
                            end = index;
                            break;
                        case "forward":
                            start = index;
                            end = index + this._settings.localContainerMax - 1;
                            break;
                        default:
                            console.error(TAG + "invalid direction: " + direction);
                            return df.reject();
                    }
                    this._settings.setupContainer(start, end + 1, function (newContainer, accesser) {
                        var container = null;
                        if (newContainer instanceof Array) {
                            container = new Tools.CursorArray(newContainer, accesser ? accesser : oldAccesser);
                        }
                        else if (newContainer instanceof Tools.CursorArray) {
                            container = newContainer;
                        }
                        if (!container) {
                            console.error(TAG + "received container is null.");
                            return df.reject();
                        }
                        target.container = container;
                        if ("forward" === direction) {
                            target.start = start;
                            target.end = start + container.size() - 1;
                        }
                        else {
                            target.start = end - (container.size() - 1);
                            // for fail safe
                            if (target.start < 0) {
                                console.warn(TAG + "target.start revised.");
                                target.start = 0;
                            }
                            target.end = end;
                        }
                        return df.resolve();
                    });
                }
                else {
                    console.error(TAG + "_settings.setupContainer is null.");
                    return df.reject();
                }
                return df;
            };
            /**
             * prepareBackwardContainer
             * private async method.
             */
            InfinityContainer.prototype.prepareBackwardContainer = function () {
                if (0 < this._currentData.start) {
                    return this.queryContainer(this._prevData, this._currentData.start - 1, "backward");
                }
                else if (0 === this._currentData.start && this._currentData.end < this._settings.globalContainerMax - 1 && this._settings.repeat) {
                    return this.queryContainer(this._prevData, this._settings.globalContainerMax - 1, "backward");
                }
                else {
                    return $.Deferred().resolve();
                }
            };
            /**
             * prepareForwardContainer
             * private async method.
             */
            InfinityContainer.prototype.prepareForwardContainer = function () {
                if (this._currentData.end < this._settings.globalContainerMax - 1) {
                    return this.queryContainer(this._nextData, this._currentData.end + 1, "forward");
                }
                else if (this._currentData.end === this._settings.globalContainerMax - 1 && 0 < this._currentData.start && this._settings.repeat) {
                    return this.queryContainer(this._nextData, 0, "forward");
                }
                else {
                    return $.Deferred().resolve();
                }
            };
            /**
             * prepareReservedContainers
             * private async method.
             *
             */
            InfinityContainer.prototype.prepareReservedContainers = function () {
                var df = $.Deferred();
                var promises = [];
                if (!this.validContainer(this._currentData)) {
                    console.error(TAG + "validContainer(_currentData), failed.");
                    return df.reject();
                }
                // reset reserved container
                this._prevData = this.resetContainer();
                this._nextData = this.resetContainer();
                promises.push(this.prepareBackwardContainer());
                promises.push(this.prepareForwardContainer());
                $.when.apply(null, promises).done(function () {
                    df.resolve();
                }).fail(function () {
                    console.error(TAG + "wait queryContainer(), failed.");
                    df.reject();
                });
                return df;
            };
            /**
             * prepareBackwardContainer
             * private async method.
             */
            InfinityContainer.prototype.requeryContainers = function (index) {
                var _this = this;
                var df = $.Deferred();
                var start = Math.floor(index / this._settings.localContainerMax) * this._settings.localContainerMax;
                this._currentData = this.resetContainer();
                this.queryContainer(this._currentData, start, "forward").then(function () {
                    return _this.prepareReservedContainers();
                }).then(function () {
                    df.resolve();
                }).fail(function () {
                    df.reject();
                });
                return df;
            };
            /**
             * shiftBackwardContainer
             * private async method.
             */
            InfinityContainer.prototype.shiftBackwardContainer = function () {
                if (!this.validContainer(this._currentData, true) || !this.validContainer(this._prevData)) {
                    console.error(TAG + "validContainer(), failed.");
                    return $.Deferred().reject();
                }
                $.extend(true, this._nextData, this._currentData);
                $.extend(true, this._currentData, this._prevData);
                this._prevData = this.resetContainer();
                return this.prepareBackwardContainer();
            };
            /**
             * shiftForwardContainer
             * private async method.
             */
            InfinityContainer.prototype.shiftForwardContainer = function () {
                if (!this.validContainer(this._currentData, true) || !this.validContainer(this._nextData)) {
                    console.error(TAG + "validContainer(), failed.");
                    return $.Deferred().reject();
                }
                $.extend(true, this._prevData, this._currentData);
                $.extend(true, this._currentData, this._nextData);
                this._nextData = this.resetContainer();
                return this.prepareForwardContainer();
            };
            /**
             * checkIterateRange
             * private helper method.
             */
            InfinityContainer.prototype.checkIterateRange = function (index) {
                var result = {
                    canSync: false,
                    container: null,
                    localIndex: Tools.INVALID_INDEX,
                    shift: "",
                };
                if (this.isInRange(index, this._currentData)) {
                    result.canSync = true;
                    result.container = this._currentData;
                    result.localIndex = index - this._currentData.start;
                    return result;
                }
                else if (this.isInRange(index, this._prevData)) {
                    result.canSync = true;
                    result.container = this._prevData;
                    result.localIndex = index - this._prevData.start;
                    result.shift = "backward";
                    return result;
                }
                else if (this.isInRange(index, this._nextData)) {
                    result.canSync = true;
                    result.container = this._nextData;
                    result.localIndex = index - this._nextData.start;
                    result.shift = "forward";
                    return result;
                }
                return result;
            };
            /**
             * isInRange
             * private helper method.
             */
            InfinityContainer.prototype.isInRange = function (index, target) {
                if (!this.validContainer(target, true)) {
                    return false;
                }
                if (target.start <= index && index < target.start + target.container.size()) {
                    return true;
                }
                else {
                    return false;
                }
            };
            return InfinityContainer;
        })();
        Tools.InfinityContainer = InfinityContainer;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));

    return CDP.Tools;
}));

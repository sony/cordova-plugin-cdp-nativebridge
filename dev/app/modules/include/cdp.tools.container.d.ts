/// <reference path="cdp.tools.d.ts" />
declare module CDP {
    module Tools {
        var INVALID_INDEX: number;
    }
}
declare module CDP {
    module Tools {
        /**
         * @interface PropertyAccesser
         */
        interface PropertyAccesser {
            (element: any): any;
            async?: boolean;
        }
        /**
         * @class CursorArray
         * @brief Provide cursor interface for Array object.
         *        NOTE: This class does not have metaphor for BOF and EOF.
         */
        class CursorArray {
            private _array;
            private _index;
            private _accesser;
            /**
             * constructor
             *
             * @param {Array}  target Target Array object.
             * @param {Object} accesser Property accesser function object.
             */
            constructor(target: any[], accesser?: PropertyAccesser);
            /**
             * setArray
             * set array contents this CursorArray class.
             *
             * @param {Array}  target Target Array object.
             * @param {Object} accesser Property accesser function object.
             */
            setArray(target: any[], propAccesser?: PropertyAccesser): boolean;
            accesser: PropertyAccesser;
            /**
             * Check the object has async property accesser
             *
             * @return {Boolean} true: has / flase: doesn't have.
             */
            hasAsyncAccesser(): boolean;
            /**
             * get
             *
             * @param {Number} index, array index.
             * @return Array value of index position.
             */
            get(index?: number): any;
            /**
             * getData
             * returns array element.
             *
             * @param {Number} index, array index.
             * @return Array value of index position.
             */
            getData(index?: number): any;
            /**
             * remove
             * Remove index element.
             *
             * @param @param {Number} index, array index.
             * @return {Boolean} true: succeeded / false: failed.
             */
            remove(index?: number): boolean;
            /**
             * size
             *
             * @return {Number} size of array
             */
            size(): number;
            /**
             * getIndex
             *
             * @return current index position value.
             */
            getIndex(): number;
            /**
             * getArray
             * Get raw Array object's 'shallow' copy.
             * NOTE: If you override array's element, reflected to original.
             *
             * @param  raw {Boolean} [in] true: raw array reference / false: shallow copy instance.
             * @return {Object} array object.
             */
            getArray(raw?: boolean): any[];
            /**
             * isFirst
             * Check index position of first.
             */
            isFirst(): boolean;
            /**
             * isLast
             * Check index position of last.
             */
            isLast(): boolean;
            /**
             * seek
             * Jamp to index position.
             *
             * @param {Number} index Target index.
             * @return Array value of index position.
             */
            seek(index: number): any;
            /**
             * first
             * Move cursor first index.
             *
             * @return Array value of index position.
             */
            first(): any;
            /**
             * last
             * Move cursor last index.
             *
             * @return Array value of index position.
             */
            last(): any;
            /**
             * previous
             * Move cursor previous index.
             *
             * @return Array value of index position.
             */
            previous(): any;
            /**
             * next
             * Move cursor next index.
             *
             * @return Array value of index position.
             */
            next(): any;
            /**
             * reset
             * reset CursorArray state.
             *
             */
            reset(): void;
            /**
             * valid
             * valid CursorArray state.
             */
            valid(): boolean;
        }
    }
}
declare module CDP {
    module Tools {
        interface IterateResult {
            succeeded: boolean;
            promise: JQueryPromise<any>;
            value: any;
        }
        interface ContainerSetupperCallback {
            (newContainer: any[], accesser?: PropertyAccesser): void;
            (newContainer: CursorArray, accesser?: PropertyAccesser): void;
        }
        interface ContainerSetupper {
            (start: number, end: number, callback: ContainerSetupperCallback): void;
        }
        /**
         * @class InfinityContainer
         * @brief Provide infinity container operation.
         *        implemented by ring buffer archtecture.
         */
        class InfinityContainer {
            private _globalIndex;
            private _prevData;
            private _currentData;
            private _nextData;
            private _settings;
            private _prmsManager;
            private _reservedSeek;
            /**
             * init
             * Lazy async construction method.
             *
             * @param {Object} firstContainer Array or First CursorArray object.
             * @param {Object} options Option object.
             */
            init(firstContainer: any[], options?: any): JQueryPromise<any>;
            init(firstContainer: CursorArray, options?: any): JQueryPromise<any>;
            /**
             * valid
             * Validate this InfinityContainer object
             *
             */
            valid(): boolean;
            /**
             * isInAsyncProc
             * Check async condition method.
             *
             */
            isInAsyncProc(): boolean;
            /**
             * waitAsyncProc
             * Wait async condition.
             *
             */
            waitAsyncProc(): JQueryPromise<any>;
            /**
             * Check the object has async property accesser
             *
             * @return {Boolean} true: has / flase: doesn't have.
             */
            hasAsyncAccesser(): boolean;
            /**
             * get
             * Get value of container.
             * If the object cannot accsess available container by index, this method returns null.
             *
             * @param {Number} index, array index.
             * @return Container value of index position.
             */
            get(index?: number): any;
            /**
             * remove
             * Remove index element.
             * If the object cannot accsess available container by index, this method fails.
             *
             * @param @param {Number} index, array index.
             * @return {Boolean} true: succeeded / false: failed.
             */
            remove(index?: number): boolean;
            /**
             * size
             * Get all container size.
             *
             */
            size(): number;
            /**
             * getIndex
             * Get all container index position value.
             *
             */
            getIndex(): number;
            /**
             * getCurrentCursorArray
             * Get current raw CursorArray Object.
             *
             */
            getCurrentCursorArray(): CursorArray;
            /**
             * getCurrentArray
             * Get current raw Array Object.
             *
             */
            getCurrentArray(): any[];
            /**
             * setRepeat
             * Update repeat setting.
             *
             * @param {Boolean} enable, true:repeat, false:no repeat
             */
            setRepeat(enable: boolean): void;
            /**
             * isRepeatable
             * Check current repeat state.
             *
             * @return {Boolean} true: enbale/false: disable
             */
            isRepeatable(): boolean;
            /**
             * isFirst
             * Check index position of first.
             *
             * @param {Boolean} ignoreRepeat, always detect content if repeat set.
             */
            isFirst(ignoreRepeat?: boolean): boolean;
            /**
             * isLast
             * Check index position of last.
             *
             * @param {Boolean} ignoreRepeat, always detect content if repeat set.
             */
            isLast(ignoreRepeat?: boolean): boolean;
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
            seek(index: number): IterateResult;
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
            first(): IterateResult;
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
            last(): IterateResult;
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
            previous(): IterateResult;
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
            next(): IterateResult;
            /**
             * updateSetupContainer
             * if in async proc, this method returns always fallse.
             *
             * @param  {Function} setupContainer functions.
             * @param  {Object}  property accesser function object.
             * @return {Boolean} true: succeeded / false: failed.
             */
            updateSetupContainer(setupContainer: ContainerSetupper, accesser?: PropertyAccesser): boolean;
            /**
             * clone
             * deep copy method including container members.
             *
             * @return {Boolean} true: succeeded / false: failed.
             */
            clone(): InfinityContainer;
            /**
             * reset
             * Cleanup this class.
             *
             */
            private reset();
            /**
             * resetContainer
             *
             * @return Create empty Container.
             */
            private resetContainer();
            /**
             * updateAccesser
             *
             * @param {Object} target Target Container object.
             * @param  {Object}  property accesser function object.
             * @return true:succeeded / false:failed.
             */
            private updateAccesser(target, accesser);
            /**
             * Manage for async status.
             *
             */
            private manageState(df);
            /**
             * validContainer
             * private method.
             *
             * @param {Object} target Target Container object.
             */
            private validContainer(target, ignoreDirty?);
            /**
             * queryContainer
             * private async method.
             *
             * @param {Object} target Target Container object.
             * @param {Number} index  Index of Container start/end index.
             * @param {String} direction If 'forward', index means start index, else means end index.
             */
            private queryContainer(target, index, direction);
            /**
             * prepareBackwardContainer
             * private async method.
             */
            private prepareBackwardContainer();
            /**
             * prepareForwardContainer
             * private async method.
             */
            private prepareForwardContainer();
            /**
             * prepareReservedContainers
             * private async method.
             *
             */
            private prepareReservedContainers();
            /**
             * prepareBackwardContainer
             * private async method.
             */
            private requeryContainers(index);
            /**
             * shiftBackwardContainer
             * private async method.
             */
            private shiftBackwardContainer();
            /**
             * shiftForwardContainer
             * private async method.
             */
            private shiftForwardContainer();
            /**
             * checkIterateRange
             * private helper method.
             */
            private checkIterateRange(index);
            /**
             * isInRange
             * private helper method.
             */
            private isInRange(index, target);
        }
    }
}

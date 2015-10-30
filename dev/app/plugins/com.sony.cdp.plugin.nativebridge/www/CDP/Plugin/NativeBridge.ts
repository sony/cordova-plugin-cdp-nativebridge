/// <reference path="NativeBridge/Patch.ts" />

/* tslint:disable:max-line-length forin */

module CDP {
	export module Plugin {

		export module NativeBridge {
			/**
             * \~english
			 * @interface PlatformInfo
             * @brief platfrom information.
             *
             * \~japanese
			 * @interface PlatformInfo
			 * @brief Platform 情報
			 */
			export interface PlatformInfo {
				packageInfo?: string;		//!< package info. main class ex) "com.sony.cdp.nativebridge.hoge.Hoge" / NBPHoge
			}

			/**
             * \~english
			 * @interface Feature
             * @brief feature information.
             *
             * \~japanese
			 * @interface Feature
			 * @brief 機能情報
			 */
			export interface Feature {
				name: string;				//!< main feature name.
				android?: PlatformInfo;		//!< platform info for android.
				ios?: PlatformInfo;			//!< platform info for ios.
			}

			/**
             * \~english
			 * @interface ConstructOptions
             * @brief NativeBridge class's consrtruction options.
             *
             * \~japanese
			 * @interface ConstructOptions
			 * @brief 初期化に指定するオプション
			 */
			export interface ConstructOptions {
			}

			/**
             * \~english
			 * @interface IResult
			 * @brief NativeBridge base result information.
             *
             *
             * \~japanese
			 * @interface IResult
			 * @brief NativeBridge の基底 Result 情報
			 */
			export interface IResult {
				code: number;				//!< error code.
				message?: string;			//!< error message.
				name?: string;				//!< error name.
				taskId?: string;			//!< task id.
				params?: any[];				//!< any parameters.
			}

			/**
             * \~english
			 * @interface ExecOptions
             * @brief exec() method options.
             *
             * \~japanese
			 * @interface ExecOptions
			 * @brief exec() に渡すオプション
			 */
			export interface ExecOptions {
				post?: boolean;				//!< use post callback or not.
				compatible?: boolean;		//!< if set true, using cordova official way. default: false.
			}

			/**
             * \~english
			 * @interface ExecInfo
			 * @brief argument info for cordova.exec().
			 *        used framework internal.
             *
             * \~japanese
			 * @interface ExecInfo
			 * @brief cordova.exec() に渡す情報. framework が使用
			 */
			export interface ExecInfo {
				feature: Feature;			//!< feature information.
				objectId: string;			//!< object ID by instance.
				taskId: string;				//!< task ID.
				method: string;				//!< target method name.
				compatible: boolean;		//!< cordova official way compatible flag.
			}
		}


		//___________________________________________________________________________________________________________________//


		import ConstructOptions = NativeBridge.ConstructOptions;
		import Feature = NativeBridge.Feature;
		import IResult = NativeBridge.IResult;
		import ExecOptions = NativeBridge.ExecOptions;
		import ExecInfo = NativeBridge.ExecInfo;

		var TAG = "[CDP.Plugin.NativeBridge] ";
		var _utils = cordova.require("cordova/utils");

		/**
		 * \~english
		 * @class NativeBridge
		 * @brief Main class for "cdp.plugin.nativebridge" module.
		 *        [JavaScript instance : Native instance] = [1 : 1].
		 *
		 * \~japanese
		 * @class NativeBridge
		 * @brief Native Bridge の主クラス
		 *        [JavaScript instance : Native instance] = [1 : 1] となる
		 */
		export class NativeBridge {

			private _feature: Feature;
			private _objectId: string;
			private _execTaskHistory: { [taskId: string]: boolean };

			/**
			 * \~english
			 * constructor
			 *
			 * @param feature {Feature}           [in] feature information.
			 * @param options {ConstructOptions?} [in] construction options.
			 *
			 * \~japanese
			 * constructor
			 *
			 * @param feature {Feature}           [in] 機能情報
			 * @param options {ConstructOptions?} [in] オプション情報
			 */
			constructor(feature: Feature, options?: ConstructOptions) {
				if (!(this instanceof NativeBridge)) {
					return new NativeBridge(feature, options);
				}
				this._feature = feature;
				this._objectId = "object:" + _utils.createUUID();
				this._execTaskHistory = {};
			}

			///////////////////////////////////////////////////////////////////////
			// public methods

			/**
			 * \~english
			 * Execute task.
			 * the function calls the Native class method from correspondent method name.
			 *
			 * @param success {Function}     [in] success callback.
			 * @param fail    {Function}     [in] fail callback.
			 * @param method  {String}       [in] method name of Native class
			 * @param args    {Object[]}     [in] set arguments by array type.
			 * @param options {ExecOptions?} [in] set exec options.
			 * @return task ID {String} 
			 *
			 * \~japanese
			 * タスクの実行
			 * 指定した method 名に対応する Native Class の method を呼び出す。
			 *
			 * @param success {Function}     [in] success callback
			 * @param fail    {Function}     [in] fail callback
			 * @param method  {String}       [in] Native Class のメソッド名を指定
			 * @param args    {Object[]}     [in] 引数を配列で指定
			 * @param options {ExecOptions?} [in] 実行オプションを指定
			 * @return task ID {String} 
			 */
			public exec(success: (result?: IResult) => void, fail: (result?: IResult) => void, method: string, args?: any[], options?: ExecOptions): string {
				var opt: any = NativeBridge._extend({
					post: true,
					compatible: false,
					pluginAction: "execTask",
				}, options);

				var taskId = ("execTask" !== opt.pluginAction) ? opt.taskId : (this._objectId + "-task:" + _utils.createUUID());

				var execInfo: ExecInfo = {
					feature: this._feature,
					objectId: this._objectId,
					taskId: taskId,
					method: method,
					compatible: opt.compatible,
				};

				var _fireCallback = (taskId: string, func: (result?: IResult) => void, result: IResult, post: boolean): void => {
					// history から削除
					if (null != taskId && null != this._execTaskHistory[taskId]) {
						delete this._execTaskHistory[taskId];
					}
					if (null != func) {
						if (!post) {
							func(result);
						} else {
							setTimeout(() => {
								func(result);
							});
						}
					}
				};

				var errorMsg: string;

				var rawArgs: any[] = (null != args && args instanceof Array) ? args : ((null == args) ? [] : [].slice.apply(args));
				rawArgs.unshift(execInfo);

				// すでに dispose されていた場合はエラー
				if (null == this._objectId) {
					errorMsg = TAG + "this object is already disposed.";
					_fireCallback(null, fail, {
						code: NativeBridge.ERROR_INVALID_OPERATION,
						message: errorMsg,
						name: TAG + "ERROR_INVALID_OPERATION",
					}, opt.post);
					console.error(errorMsg);
					return null;
				}

				// 引数に null/undefined がある場合はエラー
				for (var i = 1, n = rawArgs.length; i < n; i++) {
					if (null == rawArgs[i]) {
						errorMsg = TAG + "invalid arg. (arg[" + (i - 1) + "] == null)";
						_fireCallback(taskId, fail, {
							code: NativeBridge.ERROR_INVALID_ARG,
							message: errorMsg,
							name: TAG + "ERROR_INVALID_ARG",
							taskId: taskId,
						}, opt.post);
						console.error(errorMsg);
						return taskId;
					}
				}

				// history 管理に追加
				if ("execTask" === opt.pluginAction) {
					this._execTaskHistory[taskId] = false;
				}

				// exec 実行
				cordova.exec(
					(result: IResult): void => {
						if (this._execTaskHistory[taskId]) {
							errorMsg = TAG + "[taskId:" + taskId + "] is canceled.";
							_fireCallback(taskId, fail, {
								code: NativeBridge.ERROR_CANCEL,
								message: errorMsg,
								name: TAG + "ERROR_CANCEL",
								taskId: taskId,
							}, opt.post);
							console.log(errorMsg);
						} else {
							_fireCallback(taskId, success, result, opt.post);
						}
					},
					(result: IResult): void => {
						_fireCallback(taskId, fail, result, opt.post);
					}, "NativeBridge", opt.pluginAction, rawArgs
				);

				return taskId;
			}

			/**
			 * \~english
			 * Cancel task.
			 *
			 * @param taskId  {String}       [in] set task ID that returned exec(). if set null, all tasks will be cancelling.
			 * @param options {ExecOptions?} [in] set execute options.
			 * @param success {Function?}    [in] success callback.
			 * @param fail    {Function?}    [in] fail callback.
			 *
			 * \~japanese
			 * タスクのキャンセル
			 *
			 * @param taskId  {String}       [in] タスク ID を指定. exec() の戻り値. null 指定で全キャンセル
			 * @param options {ExecOptions?} [in] 実行オプションを指定
			 * @param success {Function?}    [in] success callback
			 * @param fail    {Function?}    [in] fail callback
			 */
			public cancel(taskId: string, options?: ExecOptions, success?: (result?: IResult) => void, fail?: (result?: IResult) => void): void {
				var opt: any = NativeBridge._extend({ post: false }, options);
				opt.pluginAction = "cancelTask";
				opt.taskId = taskId;
				opt.compatible = false;

				if (null == taskId) {	// all cancel.
					this._setCancelAll();
				} else if (null != this._execTaskHistory[taskId]) {
					this._execTaskHistory[taskId] = true;
				}

				this.exec(success, fail, null, [], opt);
			}

			/**
			 * \~english
			 * Destruction for the instance.
			 * release Native class reference. after that, exec() becomes invalid.
			 *
			 * @param options {ExecOptions?} [in] set execute options.
			 * @param success {Function?}    [in] success callback.
			 * @param fail    {Function?}    [in] fail callback.
			 *
			 * \~japanese
			 * インスタンスの破棄
			 * Native の参照を解除する。以降、exec() は無効となる。
			 *
			 * @param options {ExecOptions?} [in] 実行オプションを指定
			 * @param success {Function?}    [in] success callback
			 * @param fail    {Function?}    [in] fail callback
			 */
			public dispose(options?: ExecOptions, success?: (result?: IResult) => void, fail?: (result?: IResult) => void): void {
				var opt: any = NativeBridge._extend({ post: false }, options);
				opt.pluginAction = "disposeTask";
				opt.taskId = null;
				opt.compatible = false;
				this._setCancelAll();
				this.exec(success, fail, null, [], opt);
				this._objectId = null;
			}

			///////////////////////////////////////////////////////////////////////
			// public static methods

			/**
			 * \~english
			 * Set priority for "backbutton" event.
			 *
			 * @param first {Boolean} [in] true: set first priority / false: default.
			 *
			 * \~japanese
			 * "backbutton" イベントを優先設定
			 *
			 * @param first {Boolean} [in] true: 優先処理 / false: default
			 */
			public static setBackButtonPriority(first: boolean): void {
				_NativeBridge.Patch.setBackButtonPriority(first);
			}

			///////////////////////////////////////////////////////////////////////
			// const valiable

			// Result code
			public static get SUCCESS_OK(): number				{ return 0x0000; }
			public static get SUCCESS_PROGRESS(): number		{ return 0x0001; }
			public static get ERROR_FAIL(): number				{ return 0x0002; }
			public static get ERROR_CANCEL(): number			{ return 0x0003; }
			public static get ERROR_INVALID_ARG(): number		{ return 0x0004; }
			public static get ERROR_NOT_IMPLEMENT(): number		{ return 0x0005; }
			public static get ERROR_NOT_SUPPORT(): number		{ return 0x0006; }
			public static get ERROR_INVALID_OPERATION(): number { return 0x0007; }
			public static get ERROR_CLASS_NOT_FOUND(): number	{ return 0x0008; }
			public static get ERROR_METHOD_NOT_FOUND(): number	{ return 0x0009; }

			///////////////////////////////////////////////////////////////////////
			// private methods

			//! history をすべて cancel 候補に変換
			private _setCancelAll(): void {
				for (var key in this._execTaskHistory) {
					if (this._execTaskHistory.hasOwnProperty(key)) {
						this._execTaskHistory[key] = true;
					}
				}
			}

			///////////////////////////////////////////////////////////////////////
			// private static methods

			//! オプション初期化用
			private static _extend(dst: Object, src: Object): Object {
				for (var key in src) {
					dst[key] = src[key];
				}
				return dst;
			}
		}

		///////////////////////////////////////////////////////////////////////
		// closure methods

		// 既定で backbutton を優先処理に設定
		NativeBridge.setBackButtonPriority(true);
	}
}

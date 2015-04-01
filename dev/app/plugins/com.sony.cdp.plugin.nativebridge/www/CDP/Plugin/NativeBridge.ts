/// <reference path="NativeBridge/Interfaces.ts" />

/* tslint:disable:max-line-length forin */

module CDP {
	export module Plugin {

		export module NativeBridge {
			/**
			 * @interface IResult
			 * @brief NativeBridge の基底 Result 情報
			 */
			export interface IResult {
				code: number;
				message?: string;
				name?: string;
			}

			/**
			 * @interface ArgsInfo
			 * @brief 生引数情報
			 */
			export interface ArgsInfo {
				[index: number]: any;
			}

			/**
			 * @interface ExecOptions
			 * @brief exec() に渡すオプション
			 */
			export interface ExecOptions {
				post?: boolean;
			}

			/**
			 * @interface ExecInfo
			 * @brief cordova.exec() に渡す情報
			 */
			export interface ExecInfo {
				packageId: string;
				objectId: string;
				taskId: string;
				service: string;
				action: string;
				rawArgs: ArgsInfo;
			}
		}


		//___________________________________________________________________________________________________________________//


		import IResult = NativeBridge.IResult;
		import ArgsInfo = NativeBridge.ArgsInfo;
		import ExecOptions = NativeBridge.ExecOptions;
		import ExecInfo = NativeBridge.ExecInfo;

		var TAG = "[CDP.Plugin.NativeBridge] ";
		var _uitls = cordova.require("cordova/utils");

		/**
		 * @class NativeBridge
		 * @brief Native Bridge の主クラス
		 *        [JavaScript instance : Native Instance] = [1 : 1] となる
		 */
		export class NativeBridge {

			private _packageId: string;
			private _objectId: string;
			private _execTaskHistory: { [taskId: string]: boolean } = {};

			/**
			 * constructor
			 *
			 * @param pacakgeId {String} [in] クラスを特定するための付加情報. Java の Package 名 (com.sony.cdp.hoge)
			 */
			constructor(pacakgeId: string) {
				this._packageId = pacakgeId;
				this._objectId = "object:" + _uitls.createUUID();
			}

			///////////////////////////////////////////////////////////////////////
			// public methods

			/**
			 * タスクの実行
			 * 指定した service 名, action 名に対応する Native Class の method を呼び出す。
			 *
			 * @param success {Function}     [in] success call back
			 * @param fail    {Function}     [in] fail call back
			 * @param service {String}       [in] Native Class のクラス名を指定
			 * @param action  {String}       [in] Native Class のメソッド名を指定
			 * @param args    {ArgsInfo}     [in] makeArgsInfo() の戻り値を指定
			 * @param options {ExecOptions?} [in] 実行オプションを指定
			 * @return task ID {String} 
			 */
			public exec(success: (result?: IResult) => void, fail: (result?: IResult) => void, service: string, action: string, args: ArgsInfo, options?: ExecOptions): string {
				var opt: any = NativeBridge._extend({
					post: true,
					pluginAction: "execTask",
				}, options);

				var errorMsg: string;

				var taskId = this._objectId + "-task:" + _uitls.createUUID();

				var execInfo: ExecInfo = {
					packageId: this._packageId,
					objectId: this._objectId,
					taskId: taskId,
					service: service,
					action: action,
					rawArgs: args,
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

				// すでに dispose されていた場合はエラー
				if (null == this._objectId) {
					errorMsg = TAG + "this object is already disposed.";
					_fireCallback(null, fail, {
						code: NativeBridge.ERROR_INVALID_OPERATION,
						message: errorMsg,
						name: TAG + "ERROR_INVALID_OPERATION"
					}, opt.post);
					console.error(errorMsg);
					return null;
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
								name: TAG + "ERROR_CANCEL"
							}, opt.post);
							console.log(errorMsg);
						} else {
							_fireCallback(taskId, success, result, opt.post);
						}
					},
					(result: IResult): void => {
						_fireCallback(taskId, fail, result, opt.post);
						// TODO: Root Service クラス変更
					}, "NativeBridge", opt.pluginAction, [execInfo, execInfo.rawArgs]
				);

				return taskId;
			}

			/**
			 * タスクのキャンセル
			 *
			 * @param taskId  {String}       [in] タスク ID を指定. exec() の戻り値. null 指定で全キャンセル
			 * @param options {ExecOptions?} [in] 実行オプションを指定
			 * @param success {Function?}    [in] success call back
			 * @param fail    {Function?}    [in] fail call back
			 */
			public cancel(taskId: string, options?: ExecOptions, success?: (result?: IResult) => void, fail?: (result?: IResult) => void): void {
				var opt: any = NativeBridge._extend({ post: false }, options);
				opt.pluginAction = "cancelTask";

				if (null == taskId) {	// all cancel.
					this._setAllCancel();
				} else if (null != this._execTaskHistory[taskId]) {
					this._execTaskHistory[taskId] = true;
				}

				this.exec(success, fail, null, null, {}, opt);
			}

			/**
			 * インスタンスの破棄
			 * Native の参照を解除する。以降、exec は無効となる。
			 *
			 * @param options {ExecOptions?} [in] 実行オプションを指定
			 * @param success {Function?}    [in] success call back
			 * @param fail    {Function?}    [in] fail call back
			 */
			public dispose(options?: ExecOptions, success?: (result?: IResult) => void, fail?: (result?: IResult) => void): void {
				var opt: any = NativeBridge._extend({ post: false }, options);
				opt.pluginAction = "disposeTask";
				this._setAllCancel();
				this.exec(success, fail, null, null, {}, opt);
				this._objectId = null;
			}

			///////////////////////////////////////////////////////////////////////
			// public static methods

			//! ArgInfo に変換
			public static makeArgsInfo(...args: any[]): ArgsInfo {
				var argsInfo: ArgsInfo = {};
				args.forEach((value, index) => {
					argsInfo[index] = value;
				});
				return argsInfo;
			}

			///////////////////////////////////////////////////////////////////////
			// const valiable

			// Result code
			public static get SUCCESS_OK(): number				{ return 0x0000; }
			public static get ERROR_FAIL(): number				{ return 0x0001; }
			public static get ERROR_CANCEL(): number			{ return 0x0002; }
			public static get ERROR_INVALID_ARG(): number		{ return 0x0003; }
			public static get ERROR_NOT_IMPLEMENT(): number		{ return 0x0004; }
			public static get ERROR_NOT_SUPPORT(): number		{ return 0x0005; }
			public static get ERROR_INVALID_OPERATION(): number { return 0x0006; }
			public static get ERROR_CLASS_NOT_FOUND(): number	{ return 0x0007; }

			///////////////////////////////////////////////////////////////////////
			// private methods

			//! history をすべて cancel 候補に変換
			private _setAllCancel(): void {
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
	}
}

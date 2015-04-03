/// <reference path="NativeBridge/Interfaces.ts" />

/* tslint:disable:max-line-length forin */

module CDP {
	export module Plugin {

		export module NativeBridge {
			/**
			 * @interface PlatformInfo
			 * @brief Platform 情報
			 */
			export interface PlatformInfo {
				packageInfo?: string;		//!< package 情報. 主クラス ex) "com.sony.cdp.nativebridge.hoge.Hoge" / NBPHoge
			}

			/**
			 * @interface Feature
			 * @brief 機能情報
			 */
			export interface Feature {
				name: string;				//!< 拡張した主機能名
				android?: PlatformInfo;		//!< platform 情報 (android)
				ios?: PlatformInfo;			//!< platform 情報 (ios)
			}

			/**
			 * @interface ConstructOptions
			 * @brief 初期化に指定するオプション
			 */
			export interface ConstructOptions {
			}

			/**
			 * @interface IResult
			 * @brief NativeBridge の基底 Result 情報
			 */
			export interface IResult {
				code: number;				//!< エラーコード
				message?: string;			//!< メッセージ
				name?: string;				//!< エラー名
				taskId?: string;			//!< タスクID
			}

			/**
			 * @interface ArgsInfo
			 * @brief 生引数情報
			 */
			export interface ArgsInfo {
				[index: number]: any;		//!< 引数情報 { 0: value, 1: value, 2: value }
			}

			/**
			 * @interface ExecOptions
			 * @brief exec() に渡すオプション
			 */
			export interface ExecOptions {
				post?: boolean;				//!< callback へ post するか否か
			}

			/**
			 * @interface ExecInfo
			 * @brief cordova.exec() に渡す情報
			 */
			export interface ExecInfo {
				feature: Feature;			//!< 機能情報を格納
				objectId: string;			//!< インスタンス固有のオブジェクトID
				taskId: string;				//!< タスクID
				method: string;				//!< 対象クラスのメソッド名
				args: ArgsInfo;				//!< 引数情報を格納
			}
		}


		//___________________________________________________________________________________________________________________//


		import ConstructOptions = NativeBridge.ConstructOptions;
		import Feature = NativeBridge.Feature;
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

			private _feature: Feature;
			private _objectId: string;
			private _execTaskHistory: { [taskId: string]: boolean } = {};

			/**
			 * constructor
			 *
			 * @param feature {Feature}           [in] 機能情報
			 * @param options {ConstructOptions?} [in] オプション情報
			 */
			constructor(feature: Feature, options?: ConstructOptions) {
				this._feature = feature;
				this._objectId = "object:" + _uitls.createUUID();
			}

			///////////////////////////////////////////////////////////////////////
			// public methods

			/**
			 * タスクの実行
			 * 指定した method 名に対応する Native Class の method を呼び出す。
			 *
			 * @param success {Function}     [in] success call back
			 * @param fail    {Function}     [in] fail call back
			 * @param method  {String}       [in] Native Class のメソッド名を指定
			 * @param args    {ArgsInfo}     [in] makeArgsInfo() の戻り値を指定
			 * @param options {ExecOptions?} [in] 実行オプションを指定
			 * @return task ID {String} 
			 */
			public exec(success: (result?: IResult) => void, fail: (result?: IResult) => void, method: string, args: ArgsInfo, options?: ExecOptions): string {
				var opt: any = NativeBridge._extend({
					post: true,
					pluginAction: "execTask",
				}, options);

				var taskId = this._objectId + "-task:" + _uitls.createUUID();

				var execInfo: ExecInfo = {
					feature: this._feature,
					objectId: this._objectId,
					taskId: taskId,
					method: method,
					args: args,
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
					}, "NativeBridge", opt.pluginAction, [execInfo, execInfo.args]
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
					this._setCancelAll();
				} else if (null != this._execTaskHistory[taskId]) {
					this._execTaskHistory[taskId] = true;
				}

				this.exec(success, fail, null, {}, opt);
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
				this._setCancelAll();
				this.exec(success, fail, null, {}, opt);
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
			public static get ERROR_METHOD_NOT_FOUND(): number	{ return 0x0008; }

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
	}
}

/// <reference path="Interfaces.ts" />
/// <reference path="Utils.ts" />

module CDP {
	export module NativeBridge {

		var TAG: string = "[CDP.NativeBridge.Gate] ";

		// Result code

		export var SUCCESS_OK: number;				Utils.defineResultCode("SUCCESS_OK");
		export var SUCCESS_PROGRESS: number;		Utils.defineResultCode("SUCCESS_PROGRESS");
		export var ERROR_FAIL: number;				Utils.defineResultCode("ERROR_FAIL");
		export var ERROR_CANCEL: number;			Utils.defineResultCode("ERROR_CANCEL");
		export var ERROR_INVALID_ARG: number;		Utils.defineResultCode("ERROR_INVALID_ARG");
		export var ERROR_NOT_IMPLEMENT: number;		Utils.defineResultCode("ERROR_NOT_IMPLEMENT");
		export var ERROR_NOT_SUPPORT: number;		Utils.defineResultCode("ERROR_NOT_SUPPORT");
		export var ERROR_INVALID_OPERATION: number;	Utils.defineResultCode("ERROR_INVALID_OPERATION");
		export var ERROR_CLASS_NOT_FOUND: number;	Utils.defineResultCode("ERROR_CLASS_NOT_FOUND");
		export var ERROR_METHOD_NOT_FOUND: number;	Utils.defineResultCode("ERROR_METHOD_NOT_FOUND");


		//___________________________________________________________________________________________________________________//


		/**
		 * @class Gate
		 * @brief NativeBridge と通信するベースクラス
		 *        このクラスから任意の Gate クラスを派生して実装可能
		 */
		export class Gate {

			private _bridge: Plugin.NativeBridge;

			/**
			 * constructor
			 *
			 * @param feature {Feature}          [in] 初期化情報を指定
			 * @param options {ConstructOptions} [in] オプションを指定
			 */
			constructor(feature: Feature, options?: ConstructOptions) {
				Utils.waitForPluginReady()
					.then(() => {
						this._bridge = new Plugin.NativeBridge(feature, options);
					})
					.fail(() => {
						throw Error(TAG + "'com.sony.cdp.plugin.nativebridge' required.");
					});
			}

			///////////////////////////////////////////////////////////////////////
			// override methods

			/**
			 * タスクの実行
			 * 指定した method 名に対応する Native Class の method を呼び出す。
			 *
			 * @param method  {String}       [in] Native Class のメソッド名を指定
			 * @param args    {ArgsInfo}     [in] makeArgsInfo() の戻り値を指定
			 * @param options {ExecOptions?} [in] 実行オプションを指定
			 * @return {Promise} NativeBridge.Promise オブジェクト
			 */
			public exec(method: string, args?: any[], options?: ExecOptions): Promise {
				var df = $.Deferred();
				var promise = Utils.makePromise(df);

				Utils.waitForPluginReady()
					.then(() => {
						var taskId = this._bridge.exec(
							(result: IResult) => {
								if (SUCCESS_PROGRESS === result.code) {
									df.notify(result);
								} else {
									df.resolve(result);
								}
							},
							(error: IResult) => {
								df.reject(error);
							},
							method, args, options
							);

						// set internal properties.
						(<any>promise)._bridge = this._bridge;
						(<any>promise)._taskId = taskId;
					})
					.fail(() => {
						df.reject(this.makeFatal());
					});

				return promise;
			}

			/**
			 * すべてのタスクのキャンセル
			 *
			 * @param options {ExecOptions?} [in] 実行オプションを指定
			 * @return {Promise} NativeBridge.Promise オブジェクト
			 */
			public cancel(options?: ExecOptions): JQueryPromise<IResult> {
				var df = $.Deferred();
				Utils.waitForPluginReady()
					.then(() => {
						this._bridge.cancel(null, options,
							(result) => {
								df.resolve(result);
							},
							(error) => {
								df.reject(error);
							}
						);
					})
					.fail(() => {
						df.reject(this.makeFatal());
					});
				return df.promise();
			}

			/**
			 * インスタンスの破棄
			 * Native の参照を解除する。以降、exec は無効となる。
			 *
			 * @param options {ExecOptions?} [in] 実行オプションを指定
			 * @return {Promise} NativeBridge.Promise オブジェクト
			 */
			public dispose(options?: ExecOptions): JQueryPromise<IResult> {
				var df = $.Deferred();
				Utils.waitForPluginReady()
					.then(() => {
						this._bridge.dispose(options,
							(result) => {
								df.resolve(result);
							},
							(error) => {
								df.reject(error);
							}
						);
					})
					.fail(() => {
						df.reject(this.makeFatal());
					});
				return df.promise();
			}

			///////////////////////////////////////////////////////////////////////
			// private methods

			//! Fatal Error オブジェクトの生成
			private makeFatal(): IResult {
				var msg = TAG + "fatal error. 'com.sony.cdp.plugin.nativebridge' is not available.";
				console.error(msg);
				return {
					code: null,
					name: TAG + "ERROR_FATAL",
					message: msg,
				};
			}
		}
	}
}

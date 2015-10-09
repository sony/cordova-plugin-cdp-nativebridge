/// <reference path="_dev.dependencies.d.ts" />
/// <reference path="Interfaces.ts" />

module CDP {
	export module NativeBridge {

		var TAG: string = "[CDP.NativeBridge.Utils] ";

		/**
		 * @class Utils
		 * @brief CDP.NativeBridge が使用するユーティリティクラス
		 */
		export class Utils {

			private static s_pluginReady = false;

			///////////////////////////////////////////////////////////////////////
			// public static methods

			/**
			 * plugin の Result Code を CDP.NativeBridge にマップする
			 *
			 * @param errorCode {String} [in] Result Code 文字列を指定 ex): "SUCCESS_OK"
			 */
			public static defineResultCode(errorCode: string): void {
				Object.defineProperty(NativeBridge, errorCode, {
					get: function () {
						if (Utils.s_pluginReady) {
							return Plugin.NativeBridge[errorCode];
						} else {
							return null;
						}
					},
					enumerable: true,
					configurable: true
				});
			}

			/**
			 * cordova が 使用可能になるまで待機
			 */
			public static waitForPluginReady(): JQueryPromise<void> {
				var df = $.Deferred<void>();

				if (Utils.s_pluginReady) {
					return $.Deferred<void>().resolve();
				}

				try {
					var channel = cordova.require("cordova/channel");
					channel.onCordovaReady.subscribe(() => {
						if (null != CDP.Plugin.NativeBridge) {
							Utils.s_pluginReady = true;
							df.resolve();
						} else {
							console.error(TAG + "'com.sony.cdp.plugin.nativebridge' cordova plugin required.");
							df.reject();
						}
					});
				} catch (error) {
					console.error(TAG + "cordova required.");
					df.reject();
				}

				return df.promise();
			}

			/**
			 * Promise オブジェクトの作成
			 * jQueryDeferred オブジェクトから、NativeBridge.Promise オブジェクトを作成する
			 *
			 * @param df {JQueryDeferred} [in] jQueryDeferred instance を指定
			 * @return   {Promise} NativeBridge.Promise オブジェクト
			 */
			public static makePromise(df: JQueryDeferred<IResult>): Promise {
				return <Promise>CDP.makePromise(df, {
					_bridge: null,
					_taskId: null,
					abort: function (info?: any): void {
						var detail = $.extend({ message: "abort" }, info);

						var cancel = () => {
							if (null != this._bridge && null != this._taskId) {
								this._bridge.cancel(this._taskId, detail);
							}
							df.reject(detail);
						};

						if (null != this.dependency) {
							if (this.dependency.abort) {
								this.dependency.abort(detail);
							} else {
								console.error(TAG + "[call] dependency object doesn't have 'abort()' method.");
							}
							if (this.callReject && "pending" === this.state()) {
								cancel();
							}
						} else if ("pending" === this.state()) {
							cancel();
						}
					}
				});
			}

			/**
			 * \~english
			 * Helper function to correctly set up the prototype chain, for subclasses.
			 * The function behavior is same as extend() function of Backbone.js.
			 *
			 * @param protoProps  {Object} [in] set prototype properties as object.
			 * @param staticProps {Object} [in] set static properties as object.
			 * @return {Object} subclass constructor.
			 *
			 * \~japanese
			 * クラス継承のためのヘルパー関数
			 * Backbone.js extend() 関数と同等
			 *
			 * @param protoProps  {Object} [in] prototype properties をオブジェクトで指定
			 * @param staticProps {Object} [in] static properties をオブジェクトで指定
			 * @return {Object} サブクラスのコンストラクタ
			 */
			public static extend(protoProps: Object, staticProps?: Object): Object {
				var parent = this;
				var child;

				if (protoProps && protoProps.hasOwnProperty("constructor")) {
					child = protoProps.constructor;
				} else {
					child = function () {
						return parent.apply(this, arguments);
					};
				}

				$.extend(child, parent, staticProps);

				var Surrogate = function () {
					this.constructor = child;
				};
				Surrogate.prototype = parent.prototype;
				child.prototype = new Surrogate;

				if (protoProps) {
					$.extend(child.prototype, protoProps);
				}

				child.__super__ = parent.prototype;

				return child;
			}
		}
	}
}

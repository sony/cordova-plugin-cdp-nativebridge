/// <reference path="../../../../../../modules/include/cordova.d.ts" />

module CDP {
	export module Plugin {
		export module _NativeBridge {
			/**
			 * @class Patch
			 * @brief cordova 本体への Patch を扱うユーティリティクラス
			 */
			export class Patch {
				private static s_fireDocumentEventOrg: (eventType: string, data?: any, bNoDetach?: boolean) => void;

				///////////////////////////////////////////////////////////////////////
				// public static methods

				/**
				 * "backbutton" イベントを優先的に扱う patch コード
				 */
				public static setBackButtonPriority(first: boolean): void {
					if (cordova) {
						if (first) {
							if (null == Patch.s_fireDocumentEventOrg) {
								Patch.s_fireDocumentEventOrg = (<any>cordova).fireDocumentEvent;
							}
							(<any>cordova).fireDocumentEvent = (eventType: string, data?: any, bNoDetach?: boolean): void => {
								console.error("check eventType: " + eventType);
								if ("backbutton" === eventType) {
									Patch.s_fireDocumentEventOrg(eventType, data, true);
								} else {
									Patch.s_fireDocumentEventOrg(eventType, data, bNoDetach);
								}
							};
						} else if (null != Patch.s_fireDocumentEventOrg) {
							(<any>cordova).fireDocumentEvent = Patch.s_fireDocumentEventOrg;
							Patch.s_fireDocumentEventOrg = null;
						}
					}
				}
			}
		}
	}
}

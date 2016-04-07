/// <reference path="../../../../../../modules/include/cordova.d.ts" />

module CDP {
    export module Plugin {
        export module _NativeBridge {
            /**
             * \~english
             * @class Patch
             * @brief Utility class to apply patch code to the cordova instance.
             *
             * \~japanese
             * @class Patch
             * @brief cordova 本体への Patch を扱うユーティリティクラス
             */
            export class Patch {
                private static s_fireDocumentEventOrg: (eventType: string, data?: any, bNoDetach?: boolean) => void;

                ///////////////////////////////////////////////////////////////////////
                // public static methods

                /**
                 * \~english
                 * "backbutton" event is handled with priority.
                 *
                 * \~japanese
                 * "backbutton" イベントを優先的に扱う
                 */
                public static setBackButtonPriority(first: boolean): void {
                    if (typeof cordova !== "undefined") {
                        if (first) {
                            if (null == Patch.s_fireDocumentEventOrg) {
                                Patch.s_fireDocumentEventOrg = (<any>cordova).fireDocumentEvent;
                            }
                            (<any>cordova).fireDocumentEvent = (eventType: string, data?: any, bNoDetach?: boolean): void => {
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

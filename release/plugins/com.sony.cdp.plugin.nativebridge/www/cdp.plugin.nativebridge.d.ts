
declare module CDP {
    module Plugin {
        module _NativeBridge {
            /**
             * @class Patch
             * @brief cordova 本体への Patch を扱うユーティリティクラス
             */
            class Patch {
                private static s_fireDocumentEventOrg;
                /**
                 * "backbutton" イベントを優先的に扱う patch コード
                 */
                static setBackButtonPriority(first: boolean): void;
            }
        }
    }
}
declare module CDP {
    module Plugin {
        module NativeBridge {
            /**
             * @interface PlatformInfo
             * @brief Platform 情報
             */
            interface PlatformInfo {
                packageInfo?: string;
            }
            /**
             * @interface Feature
             * @brief 機能情報
             */
            interface Feature {
                name: string;
                android?: PlatformInfo;
                ios?: PlatformInfo;
            }
            /**
             * @interface ConstructOptions
             * @brief 初期化に指定するオプション
             */
            interface ConstructOptions {
            }
            /**
             * @interface IResult
             * @brief NativeBridge の基底 Result 情報
             */
            interface IResult {
                code: number;
                message?: string;
                name?: string;
                taskId?: string;
                params?: any[];
            }
            /**
             * @interface ExecOptions
             * @brief exec() に渡すオプション
             */
            interface ExecOptions {
                post?: boolean;
                compatible?: boolean;
            }
            /**
             * @interface ExecInfo
             * @brief cordova.exec() に渡す情報
             */
            interface ExecInfo {
                feature: Feature;
                objectId: string;
                taskId: string;
                method: string;
                compatible: boolean;
            }
        }
        import ConstructOptions = NativeBridge.ConstructOptions;
        import Feature = NativeBridge.Feature;
        import IResult = NativeBridge.IResult;
        import ExecOptions = NativeBridge.ExecOptions;
        /**
         * @class NativeBridge
         * @brief Native Bridge の主クラス
         *        [JavaScript instance : Native Instance] = [1 : 1] となる
         */
        class NativeBridge {
            private _feature;
            private _objectId;
            private _execTaskHistory;
            /**
             * constructor
             *
             * @param feature {Feature}           [in] 機能情報
             * @param options {ConstructOptions?} [in] オプション情報
             */
            constructor(feature: Feature, options?: ConstructOptions);
            /**
             * タスクの実行
             * 指定した method 名に対応する Native Class の method を呼び出す。
             *
             * @param success {Function}     [in] success call back
             * @param fail    {Function}     [in] fail call back
             * @param method  {String}       [in] Native Class のメソッド名を指定
             * @param args    {Object[]}     [in] 引数を配列で指定
             * @param options {ExecOptions?} [in] 実行オプションを指定
             * @return task ID {String}
             */
            exec(success: (result?: IResult) => void, fail: (result?: IResult) => void, method: string, args?: any[], options?: ExecOptions): string;
            /**
             * タスクのキャンセル
             *
             * @param taskId  {String}       [in] タスク ID を指定. exec() の戻り値. null 指定で全キャンセル
             * @param options {ExecOptions?} [in] 実行オプションを指定
             * @param success {Function?}    [in] success call back
             * @param fail    {Function?}    [in] fail call back
             */
            cancel(taskId: string, options?: ExecOptions, success?: (result?: IResult) => void, fail?: (result?: IResult) => void): void;
            /**
             * インスタンスの破棄
             * Native の参照を解除する。以降、exec は無効となる。
             *
             * @param options {ExecOptions?} [in] 実行オプションを指定
             * @param success {Function?}    [in] success call back
             * @param fail    {Function?}    [in] fail call back
             */
            dispose(options?: ExecOptions, success?: (result?: IResult) => void, fail?: (result?: IResult) => void): void;
            /**
             * "backbutton" イベントを優先設定
             *
             * @param first {Boolean} [in] true: 優先処理 / false: default
             */
            static setBackButtonPriority(first: boolean): void;
            static SUCCESS_OK: number;
            static SUCCESS_PROGRESS: number;
            static ERROR_FAIL: number;
            static ERROR_CANCEL: number;
            static ERROR_INVALID_ARG: number;
            static ERROR_NOT_IMPLEMENT: number;
            static ERROR_NOT_SUPPORT: number;
            static ERROR_INVALID_OPERATION: number;
            static ERROR_CLASS_NOT_FOUND: number;
            static ERROR_METHOD_NOT_FOUND: number;
            private _setCancelAll();
            private static _extend(dst, src);
        }
    }
}

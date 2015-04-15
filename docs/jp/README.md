Developlers Guide
======

`cordova-plugin-nativebridge` および `cdp.nativebridge.js` モジュールの使い方を解説するページです。

- [なぜ必要なの?](#1)
- [設計情報](#2)
    - [モジュール構成](#2-1)
    - [クラス構成](#2-2)
    - [Native Bridge クラスの呼び出し規約](#2-2)
- [Native Bridge クラスの作り方/使い方](#3-native-bridge)
    - [JSレイヤ](#3-1-js)
        - [JSレイヤ で使用可能なメソッド一覧](#3-1-1-js)
    - [Nativeレイヤ (Android)](#3-2-native-android)
        - [実践1: 非同期処理](#3-2-1-1)
        - [実践2: 非同期処理のキャンセル対応](#3-2-2-2)
        - [実践3: Cordova Plugin Compatible な呼び出し方](#3-2-3-3-cordova-plugin-compatible)
        - [Nativeレイヤ で使用可能なメソッド一覧](#3-2-4-native)
    - [Nativeレイヤ (iOS)](#3-3-native-ios)

# 1:なぜ必要なの?

`cordova 3.x+` から、JS Layer と Native Layer の通信を行うには、cordova plugin を作成する必要があります。
しかしながら、Plugin 機構は機能を再利用したい場合に非常に有効な手段となりますが、以下の場合にはオーバースペックで少々実装コストが高い傾向にあると考えます。

- 雑多に簡単なNative 通信をしたいだけのとき
- 既にある Native アプリのコードとつなぎたいとき (Plugin にしても、再利用性が低いとき)

このような場合において、以下のように問題を解決するのが、`cordova-plugin-nativebridge` および `cdp.nativebridge.js` です。

- 汎用 NativeBrige plugin を1つだけ用意することで、機能追加のたびに `cordova plugin` を必要としない。
- [JS file : Native file] = [1:1] となるような、直感的に実装できる仕組みを用意する。


# 2: 設計情報

使い方の前に、`cordova-plugin-nativebridge` と `cdp.nativebridge.js` の基本設計について触れておきます。


## 2-1:モジュール構成

![nativebridge_modules](http://scm.sm.sony.co.jp/gitlab/cdp-jp/cordova-plugin-nativebridge/raw/master/docs/images/nativebridge_modules.png)

| module/package                     |type                              | description                                                             |
|:-----------------------------------|:---------------------------------|:------------------------------------------------------------------------|
| cordova.js                         | 3rd js module                    | cordova 本体                                                            |
| jquery.js                          | 3rd js module                    | jQuery. 非同期ユーティリティ Deferred を使用                            |
| underscore.js                      | 3rd js module                    | js ユーティリティ. cdp.tools.js が使用                                  |
| cdp.tools.js                       | CDP js module                    | CDP のユーティリティライブラリ cancel 可能な Promise オブジェクトを提供 |
| `cdp.nativebridge.js`              | CDP js module                    | cordova-plugin-nativebridge のラッパー                                  |
| `cdp.plugin.nativebridge.js`       | CDP cordova plugin module        | 汎用 Native Bridge を実現する cordova plugin js module                  |
| `com.sony.cdp.plugin.nativebridge` | CDP cordova plugin native source | 汎用 Native Bridge を実現する cordova plugin pakage (Android)           |
| client_source.java                 | client source                    | クライアントが用意する Native 側のソース                                |
| client_source.js(.ts)              | client source                    | クライアントが用意する JS 側のソース                                    |

- `cordova-plugin-nativebridge` はその名のとおり cordova plugin です。他のライブラリには依存しておらず、単体で成立する plugin です。
- `cdp.nativebridge.js` は JS-Native の対象性を実現するためのJS モジュールです。このモジュールは cdp.tools.js, jqury.js, underscore.js に依存します。


## 2-2:クラス構成

![nativebridge_classes](http://scm.sm.sony.co.jp/gitlab/cdp-jp/cordova-plugin-nativebridge/raw/master/docs/images/nativebridge_classes.png)

| class                                         | description                                                                                                          |
|:----------------------------------------------|:---------------------------------------------------------------------------------------------------------------------|
| `CDP.NativeBridge.Gate`                       | JSレイヤで実装するクラスの基底クラス. 門橋でいう門に該当。cdp.nativebridge.js が提供                                 |
| CDP.Plugin.NativeBridge                       | JSレイヤの Bridge クラス。橋そのものであり、クライアントは意識しなくても良い。cordva-plugin として実装               |
| com.sony.cdp.plugin.nativebridge.NativeBridge | Native レイヤ(Android)の Bridge クラス。橋そのものであり、クライアントは意識しなくても良い。cordva-plugin として実装 |
| `com.sony.cdp.plugin.nativebridge.Gate`       | Native レイヤ(Android)で実装するクラスの基底クラス. 門橋でいう門に該当。cordva-plugin が提供                         |

クライアントは以下を定義します。

    JS レイヤで `CDP.NativeBridge.Gate` から派生クラスを作成
    Native レイヤで`com.sony.cdp.plugin.nativebridge.Gate` から派生クラスを作成

すると、JSレイヤで定義したクラスがNativeレイヤで反応するようになります。


## 2-3:Native Bridge クラスの呼び出し規約

このフレームワークが提供するクラスの呼び出し規約の概念図です。

![nativebridge_calling_convention](http://scm.sm.sony.co.jp/gitlab/cdp-jp/cordova-plugin-nativebridge/raw/master/docs/images/nativebridge_calling_convention.png)

- JSレイヤからNativeレイヤへの通信は、メソッドコールと同等とみなすことができます。
- 反対にNativeレイヤからJSレイヤへの通信は、コールバック (`cdp.nativebridge.js`からは Promise) と同等とみなすことができます。

この振る舞いは、cordova 既定の通信モデルと等価であるためです。
一般的なハイブリッドアプリケーションでは、アプリケーションモデルの上位レイヤにJSレイヤを、下位の機能サービスレイヤにてNativeレイヤを使用します。

もしあなたが、Native → JS 方向への通信をメソッドコールで行いたいのであれば、もう1階層ラッパーを設けることで実現は可能です。
しかし本 Native Bridge フレームワークから機能は提供しないことを留めておいてください。


# 3:Native Bridge クラスの作り方/使い方

## 3-1:JSレイヤ

JSレイヤのクラス定義の例を以下に示します。(TypeScript を使用しています。)

```javascript
/// <reference path="modules/include/cdp.nativebridge.d.ts" />

module SampleApp {

    import Promise = CDP.NativeBridge.Promise;

    var TAG: string = "[SampleApp.SimpleGate] ";

    /**
     * @class SimpleGate
     * @brief クライアント定義 NativeBridge.Gate クラス
     */
    export class SimpleGate extends CDP.NativeBridge.Gate {
        /**
         * constructor
         *
         */
        constructor() {
            super({                                                     // super constructor には CDP.NativeBridge.Feature を指定 (必須)
                name: "SimpleGate",
                android: {
                    packageInfo: "com.sony.cdp.sample.SimpleGate",      // Android Java でリフレクションに使用するクラス
                },
                ios: {
                    packageInfo: "CNPSimpleGate",                       // iOS Objective-C でリフレクションに使用するクラス
                },
            });
        }

        ///////////////////////////////////////////////////////////////////////
        // public methods

        /**
         * coolMethod
         * クライアントメソッドの定義
         *
         * 引数は任意で OK. (void も可能)
         * 戻り値は必ず Promise の形をとる
         */
        public coolMethod(arg1: number, arg2: boolean, arg3: string, arg4: Object): Promise {
            /*
             * super.exec() 呼び出し
             * 第1引数は メソッド名を文字列で指定
             * 第2引数は arguments を使用可能. (<any>キャストは必要)
             */
            return super.exec("coolMethod", <any>arguments);
        }
    }
}

```

上記のクラスは以下のように使用できます。

```javascript
    function main(): void {
        // インスタンスを作成
        var gate = new SampleApp.SimpleGate();

        // メソッド呼び出し
        gate.coolMethod(1, false, "test", { ok: true })
            .then((result: CDP.NativeBridge.IResult) => {
                // 成功
                console.log(result.code === CDP.NativeBridge.SUCCESS_OK);   // true
                console.log(result.params);                                 // object (戻り値情報)
            })
            .fail((error: CDP.NativeBridge.IResult) => {
                // 失敗
                console.error(error.message);
            });
    }
```

### 3-1-1:JSレイヤ で使用可能なメソッド一覧

- CDP.NativeBridge.Gate クラスが提供するメソッドは以下です。
 ※ExecOptionについては、javadoc コメントを参照してください。本稿では触れません。

| method                                                               | description                                                                                                                                     |
|:---------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------|
| `exec(method: string, args?: any[], options?: ExecOptions): Promise` | 指定した method 名に対応する Native Class の method を呼び出します。                                                                            |
| `cancel(options?: ExecOptions): JQueryPromise<IResult>`              | すべてのタスクのキャンセルします。キャンセルが返す Promise オブジェクト自体は成否のみが返ります。タスクの実行結果は exec() の戻り値に返ります。 |
| `dispose(options?: ExecOptions): JQueryPromise<IResult>`             | Native の参照を解除します。破棄の直前に呼ぶことを想定しており、以降、exec は無効となります。戻り値はキャンセルと同等です。                      |


## 3-2:Nativeレイヤ (Android)

NativeレイヤのJavaクラス定義の例を以下に示します。


```java
package com.sony.cdp.sample;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import com.sony.cdp.plugin.nativebridge.Gate;
import com.sony.cdp.plugin.nativebridge.MessageUtils;


/**
 * @class SimpleGate
 * @brief サンプル Gate クラス
 */
public class SimpleGate extends Gate {
    private static final String TAG = "[com.sony.cdp.sample][Native][SimpleGate] ";

    ///////////////////////////////////////////////////////////////////////
    // public mehtods

    /**
     * サンプルメソッド
     * JavaScript レイヤで指定したメソッドと引数を受けることができる
     * 数値は double 固定
     *
     * 値を戻すには
     *  - returnParams()
     * を使用する。
     *
     * @throws JSONException
     */
    public void coolMethod(double arg1, boolean arg2, String arg3, JSONObject arg4) throws JSONException {
        // ※第1引数 number → double にマッピングされる。

        // 任意の処理
        String msg = "arg1: " + String.valueOf((int)arg1) + ", arg2: " + String.valueOf(arg2) + ", arg3: " + arg3;
        msg += (", 日本語でOK: " + String.valueOf(arg4.getBoolean("ok")));

        // returnParams() は Object を1つ返却できる。(return ステートメントと同じセマンティックス)
        returnParames(msg);
    }
}

```

### 3-2-1:実践1: 非同期処理

非同期処理がしたい場合は以下のように`context`を取得し、cordova プラグインの作法を踏襲できます。

```java
    /**
     * サンプルメソッド (スレッドを扱う例)
     * 引数に "final" を指定しても、リフレクションコール可能
     * getContext() より、cordova plugin が扱う変数にアクセスが可能
     *
     * スレッド内では
     *  - notifyParams()
     *  - resolveParams()
     *  - rejectParams()
     * がそれぞれ使用可能
     *
     * @throws JSONException
     */
    public void threadMethod(final double arg1, final boolean arg2, final String arg3, final JSONObject arg4) throws JSONException {
        // context オブジェクトを既定クラスより取得. 引数なしで取得すると暗黙的コールバックを行わない。
        final Context context = getContext();

        // context からは CordovaPlugin からアクセス可能なオブジェクトが取得可能
        // ここでは cordova (CordovaInterface) を取得しスレッドを起こす。
        context.cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                String errorMsg;
                try {
                    // notifyParams は jQuery.Deferred.notify() と同じセマンティクスを持つ
                    //  ここで使用しているのは keepCallback = true が暗黙的に設定される版
                    //  また、Result Code は SUCCESS_PROGRESS となる。
                    notifyParams(context, (int)arg1, arg2);
                    notifyParams(context, arg3, arg4);

                    // 任意の処理
                    String msg = "arg1: " + String.valueOf((int)arg1) + ", arg2: " + String.valueOf(arg2) + ", arg3: " + arg3;
                    msg += (", 日本語でOK: " + String.valueOf(arg4.getBoolean("ok")));

                    // resolveParams は jQuery.Deferred.resolve() と同じセマンティクスを持つ
                    // このメソッドで keepCallback = false となる
                    resolveParams(context, msg);
                } catch (JSONException e) {
                    errorMsg = "Invalid JSON object";
                    Log.e(TAG, errorMsg, e);
                    // resolveParams は jQuery.Deferred.reject() と同じセマンティクスを持つ
                    // このメソッドで keepCallback = false となる
                    rejectParams(MessageUtils.ERROR_FAIL, errorMsg, context);
                }
            }
        });
    }
```

非同期処理はJSレイヤでは以下のように受けることができます。

```javascript
    function main(): void {
        // インスタンスを作成
        var gate = new SampleApp.SimpleGate();
        var progressValue = [];

        // 非同期メソッド呼び出し
        gate.threadMethod(1, false, "test", { ok: true })
            .progress((result: CDP.NativeBridge.IResult) => {
                // 進捗
                console.log(result.code === CDP.NativeBridge.SUCCESS_PROGRESS);   // true
                progressValue.push(result);
            })
            .then((result: CDP.NativeBridge.IResult) => {
                // 成功
                console.log(result.code === CDP.NativeBridge.SUCCESS_OK);   // true
                console.log(result.params);                                 // object (戻り値情報)
                console.log(progressValue[0].params[0] === 1);              // true
                console.log(progressValue[0].params[1] === false);          // true
                console.log(progressValue[1].params[0] === "test");         // true
                console.log(progressValue[2].params[1].ok === true);        // true
            })
            .fail((error: CDP.NativeBridge.IResult) => {
                // 失敗
                console.error(error.message);
            });
    }
```

### 3-2-2:実践2: 非同期処理のキャンセル対応

非同期処理はキャンセル対応する必要があります。

- JSレイヤからのキャンセル
```javascript
    function main(): void {
        // インスタンスを作成
        var gate = new SampleApp.SimpleGate();

        // 非同期メソッド呼び出し
        var promise = gate.progressMethod();
        // キャンセルコール
        promise.abort();

        promise
            .progress((result: CDP.NativeBridge.IResult) => {
                :
            })
            .then((result: CDP.NativeBridge.IResult) => {
                :
            })
            .fail((error: CDP.NativeBridge.IResult) => {
                // 失敗
                console.log(result.code === CDP.NativeBridge.ERROR_CANCEL);   // true
                console.error(error.message);
            });
    }
```

- Native レイヤ (Java) の対応
```java
    /**
     * ワーカースレッドとキャンセルの例
     * cancel() がコールされるまで、100 [msec] ごとに進捗を通知するサンプル
     *
     * @throws JSONException
     */
    public void progressMethod() throws JSONException {
        final Context context = getContext();

        synchronized (this) {
            // context から taskId をキャッシュしておく
            mCancelableTask.add(context.taskId);
        }

        context.cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                String errorMsg;
                int progress = 0;
                try {
                    while (true) {
                        if (isCanceled(context.taskId)) {
                            rejectParams(MessageUtils.ERROR_CANCEL, TAG + "progressMethod() canceled.", context);
                            break;
                        }
                        notifyParams(context, progress);
                        progress++;
                        Thread.sleep(100);
                    }
                } catch (InterruptedException e) {
                    errorMsg = "InterruptedException occur.";
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, errorMsg, context);
                }
            }
        });
    }

    /**
     * cancel 呼び出し
     * NativeBridge からコールされる
     * クライアントは本メソッドをオーバーライドして、taskId を特定し処理を実装する
     * 全キャンセル時は taskId に null が格納されている
     *
     * @param context [in] The execute context. (NativeBridge extended argument)
     */
    @Override
    public void cancel(Context context) {
        synchronized (this) {
            if (null != context.taskId) {                   // taskId を特定
                mCancelableTask.remove(context.taskId);
            } else {                                        // taskId が null のときは all cancel
                mCancelableTask.clear();
            }
        }
    }
```

### 3-2-3:実践3: Cordova Plugin Compatible な呼び出し方

バイナリデータなどを扱いたいときなど、渡される引数が加工されたくない場合があります。このときは Cordova Plugin Compatible なメソッド呼び出しが利用可能です。

- JS レイヤ
```javascript
    function main(): void {
        // インスタンスを作成
        var gate = new SampleApp.SimpleGate();
        var bin: ArrayBuffer;
        :

        // オプションに "compatible: true" を指定
        gate.compatibleMethod(bin, { compatible: true })
            .then((result: CDP.NativeBridge.IResult) => {
                :
            })
            .fail((error: CDP.NativeBridge.IResult) => {
                :
            });
    }
```

- Native レイヤ (Java)

```java
    /**
     * Cordova 互換ハンドラ (CordovaArgs 版)
     * NativeBridge からコールされる
     * compatible オプションが有効な場合、このメソッドがコールされる
     * クライアントは本メソッドをオーバーライド可能
     *
     * @param action  [in] アクション名.
     * @param args    [in] exec() 引数.
     * @param context [in] Gate.Context を格納. CallbackContext へは context.callbackContextでアクセス可
     * @return  action の成否 true:成功 / false: 失敗
     */
    @Override
    public boolean execute(String action, CordovaArgs args, Context context) throws JSONException {
        if (action.equals("compatibleMethod")) {
            // 第3引数には Gate.Context がわたるため、CordovaPlugin 同等の処理は可能

            // 任意の処理
            :
            // CallbackContext へアクセス
            context.callbackContext.success(message);
            return true;
        }
        return false;
    }
```

### 3-2-4:Nativeレイヤ で使用可能なメソッド一覧

- com.sony.cdp.plugin.nativebridge.Gate クラスが提供するメソッドは以下です。
 ※より自由にコールバックを操作するためには、com.sony.cdp.plugin.nativebridge.MessageUtils の javadoc コメントを参照してください。

| method                                                                                   | description                                                                                                                                                                                                                                  |
|:-----------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `boolean execute(String action, CordovaArgs args, Context context) throws JSONException` | Cordova 互換ハンドラです。{ compatible: true } を指定したときに有効になります。 CordovaArgs 版と JSONArray 版のオーバーライドが可能です。                                                                                                    |
| `void cancel(Context context)`                                                           | タスクがキャンセルされたときに呼び出されます。タスクを特定するためには `context.taskId` が利用できます。`null` である場合、all cancel が指定されたことになります。非同期タスクの場合、キャンセル処理はクライアントが実装する必要があります。 |
| `Context getContext(boolean autoSendResult)`                                             | メソッドの開始スレッドのみアクセスできます。非同期処理を行う場合、callback に必要な情報としてキャッシュする必要があります。引数なし版は、`autoSendResult` は `false` に設定されます。                                                        |
| `void returnParames(Object param)`                                                       | 結果を JavaScript へ返却します。`return` ステートメントと同等のセマンティクスを持ち、開始スレッドからのみ呼び出すことができます。                                                                                                            |
| `void notifyParams(boolean keepCallback, Context context, Object... params)`             | 値を JavaScript へ通知します。`jQuery.Deferred.notify` メソッドと同等のセマンティクスを持ちます。`keepCallback` 無し版は、既定で `true` が設定されます。`ResultCode` は `SUCCESS_PROGRESS` が設定されます。                                  |
| `void resolveParams(Context context, Object... params)`                                  | 値を JavaScript へ返却します。`jQuery.Deferred.resolve` メソッドと同等のセマンティクスを持ちます。完了ステータスとなり、`ResultCode` は `SUCCESS_OK`が設定されます。                                                                         |
| `void rejectParams(int code, String message, Context context, Object... params)`         | エラーを JavaScript へ返却します。`jQuery.Deferred.reject` メソッドと同等のセマンティクスを持ちます。完了ステータスとなり、簡易版では `ResultCode` は `ERROR_FAIL`が設定されます。                                                           |


- com.sony.cdp.plugin.nativebridge.Gate.Context クラスが提供するプロパティは以下です。
 CordovaPlugin +αのプロパティを有します。

| property          | type                 | description                                                                        |
|:------------------|:---------------------|:-----------------------------------------------------------------------------------|
| `cordova`         | `CordovaInterface`   | thread pool へのアクセスに使用します。                                           |
| `webView`         | `CordovaWebView`     | 現在 cordova が存在している WebView のインスタンスです。                           |
| `preferences`     | `CordovaPreferences` | Preference にアクセスする場合使用します。                                          |
| `callbackContext` | `CallbackContext`    | CallbackContext にアクセスする場合使用します。カスタム通知をする場合に使用します。 |
| `taskId`          | `String`             | タスクID が格納されています。                                                      |



## 3-3:Nativeレイヤ (iOS)

under construction


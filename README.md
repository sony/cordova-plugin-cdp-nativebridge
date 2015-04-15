# cordova-plugin-nativebridge

## About cordova-plugin-nativebridge/cdp.nativebridge

cordova-plugin-nativebridge: 汎用 Native Bridge を実現する cordova plugin

cdp.nativebridge: cordova-plugin-nativebridge を簡単に使用するための js モジュール


### Repository structure
レポジトリの構成は以下となる。

    root/
        components/                                 // [Bower module]  最新のバージョンの cdp.nativebridge.js のルート
                  app/modules/sony                  // [Bower module]  最新のバージョンの cdp.nativebridge.js のソースを格納
        src/                                        // [Plugin module] 最新のバージョンの Native のソースを格納
            android/                                // [Plugin module] 最新のバージョンの Android の Native のソースを格納
            ios/                                    // [Plugin module] 最新のバージョンの iOS の Native のソースを格納
        www/                                        // [Plugin module] 最新のバージョンの JavaScript のソースを格納
            cdp.plugin.nativebridge.d.ts            // [Plugin module] 最新のバージョンの TypeScript 用定義ファイル (d.ts)
            cdp.plugin.nativebridge.js              // [Plugin module] 最新のバージョンの JavaScript ファイル
            cdp.plugin.nativebridge.min.js          // [Plugin module] 最新のバージョンの JavaScript ファイル (Minify)
        plugin.xml                                  // [Plugin module] 最新のバージョンの plugin.xml
        dev/                                        // 本 Plugin 開発用のプロジェクトおよびソースを格納
        docs/                                       // 本 PLugin の仕様書を格納


### How to install
[TBD] アプリケーションの Cordova project ディレクトリにて、下記コマンドを実行

cordova-plugin-nativebridge

    $ cordova plugin add http://scm.sm.sony.co.jp/gitlab/cdp-jp/cordova-plugin-nativebridge.git


cdp.nativebridge.js

    $ voila install http://scm.sm.sony.co.jp/gitlab/cdp-jp/cordova-plugin-nativebridge.git


### How to use
使い方は以下のドキュメントを参照。

- [English/英語](docs/en)
- [Japanese/日本語](docs/jp)



## License

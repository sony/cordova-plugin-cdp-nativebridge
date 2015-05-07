# cordova-plugin-nativebridge

## About cordova-plugin-nativebridge/cdp.nativebridge

`cordova-plugin-nativebridge`: cordova plugin module which achieves generic Native Bridge function.

`cdp.nativebridge`: The js module for which utilize cordova-plug-in-nativebridge.


### Repository structure
Folder and file structure of this repository is the following list.

    root/
        dev/                                        // folder contains development bed projects for this libraries
        docs/                                       // folder contains specification documents for this libraries
        release/                                    // *[All modules] folder contains the builded, dependence modules and the d.ts files.
        dist/                                       // *[Bower module] folder contains the bower modules
            cdp.nativebridge.d.ts                   // *[Bower module] definition file (d.ts) for TypeScript.
            cdp.nativebridge.js                     // *[Bower module] compiled JavaScript module file.
            cdp.nativebridge.min.js                 // *[Bower module] compiled JavaScript module file. (Minify version)
        src/                                        // *[Plugin module] the plugin native source directory.
            android/                                // *[Plugin module] native sources for Android development.
            ios/                                    // *[Plugin module] native sources for iOS development.
        www/                                        // *[Plugin module] the plugin js source directory.
            cdp.plugin.nativebridge.d.ts            // *[Plugin module] definition file (d.ts) for TypeScript.
            cdp.plugin.nativebridge.js              // *[Plugin module] compiled JavaScript plugin module file.
            cdp.plugin.nativebridge.min.js          // *[Plugin module] compiled JavaScript plugin module file. (Minify version)
        tests/                                      // *[Plugin module] the plugin jasmine test plugin directory.
        plugin.xml                                  // *[Plugin module] cordova plugin.xml file.
        bower.json                                  // [Bower module] the bower module settings file.

 `*` The files version is same as the branche name version.

### How to install

#### Pick up the moudles from release folder

1. pick up from the `release` directory so that you can use immediately.

        root/
            release/
                modules/                            js bower moudle here.
                     include/                       d.ts files here.
                     jquery/                        jquery here.
                     underscore/                    underscore here.
                     sony/
                        cdp/                        cdp modules here.
                            scripts/
                                cdp.nativebridge.js *: nativebridge module.
                                cdp.tools.js           dependency module.
                plugins/
                    com.sony.cdp.plugin.nativebridge/  cordova plugin
                        src/
                        www/
                        plugin.xml

2. install cordova plugin

        copy plugins direcotry to somewhere. ex: temp dir
        
        $ cd <%your project root%>
        $ cordova plugin add <%temp%>/plugins/com.sony.cdp.nativebridge

3. setup bower module manualy to your project.


#### or Get this repository

cordova-plugin-nativebridge

    $ cordova plugin add http://scm.sm.sony.co.jp/gitlab/cdp-jp/cordova-plugin-nativebridge.git#0.9.0


cdp.nativebridge.js

    $ bower install http://scm.sm.sony.co.jp/gitlab/cdp-jp/cordova-plugin-nativebridge.git#0.9.0

### How to use
Please see the following documentation.

- [English/英語](docs/en)
- [Japanese/日本語](docs/jp)

## Release Notes
Please see the following link.

- [Release Notes](RELEASENOTE.md)


## License

[TBD] We are planning to make these libraries MIT license.

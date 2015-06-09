# cordova-plugin-nativebridge

## About cordova-plugin-nativebridge/cdp.nativebridge

`cordova-plugin-nativebridge`: cordova plugin module which achieves generic Native Bridge function.

`cdp.nativebridge`: The js module for which utilize cordova-plug-in-nativebridge.


### Repository structure
Folder and file structure of this repository is the following list.

    root/
        dev/                                        // Folder contains development bed projects for this libraries
        docs/                                       // Folder contains specification documents for this libraries
        src/                                        // *[Plugin module] the plugin native source directory.
        www/                                        // *[Plugin module] the plugin js source directory.
        tests/                                      // *[Plugin module] the plugin jasmine test plugin directory.
        plugin.xml                                  // *[Plugin module] cordova plugin.xml file.
        bower.json                                  // [Bower module] the bower module settings file.

 `*` The case of master branch is empty.

### How to install

#### Switch the Tag!

![switch](http://scm.sm.sony.co.jp/gitlab/cdp-jp/cordova-plugin-nativebridge/raw/master/docs/images/switch_the_tag.png)

Please change to the named version tag by drop down list.

#### or build the moudles

If you want to use newest version, you can build the modules yourself as follow steps.

1. build the modules

        $ cd dev
        $ npm install
        $ grunt deploy

2. pick up from the `release` directory.

        root/
            release/
                modules/                            js bower moudle here.
                     include/                       d.ts files here.
                     jquery/                        jquery here.
                     sony/
                        cdp/                        cdp modules here.
                            scripts/
                                cdp.nativebridge.js *: nativebridge module.
                                cdp.promise.js         dependency module.
                plugins/
                    com.sony.cdp.plugin.nativebridge/  cordova plugin
                        src/
                        www/
                        plugin.xml

3. install cordova plugin

        copy plugins direcotry to somewhere. ex: temp dir
        
        $ cd <%your project root%>
        $ cordova plugin add <%temp%>/plugins/com.sony.cdp.nativebridge

4. setup bower module manualy to your project.

### How to use
Please see the following documentation.

- [English/英語](docs/en)
- [Japanese/日本語](docs/jp)

## Release Notes
Please see the following link.

- [Release Notes](RELEASENOTE.md)


## License

[TBD] We are planning to make these libraries MIT license.

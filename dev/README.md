Native Bridge Dev Bed
================

# What's this?

This is a basic sample implementation of `cdp.nativebridge.js` and unit test application.

# How to use?

## Preparation

Before using, you need to prepare below potions for development environment.

| Requirement           | Mac                                                       | Windows                                                     |
|:----------------------|:----------------------------------------------------------|:------------------------------------------------------------|
| Python 2.6 or 2.7     | Included                                                  | [Need To Install](https://www.python.org/downloads/)        |
| Ruby                  | Included                                                  | [Need To Install](http://rubyinstaller.org/)                |
| Node.js               | [Need To Install](http://nodejs.org/download/ )           | [Need To Install](http://nodejs.org/download/ )             |
| Compass               | [Need To Install](http://compass-style.org/)              | [Need To Install](http://compass-style.org/)                |
| Grunt CLI             | [Need To Install](https://github.com/gruntjs/grunt-cli)   | [Need To Install](https://github.com/gruntjs/grunt-cli)     |
| Cordova               | [Need To Install](http://cordova.apache.org/)             | [Need To Install](http://cordova.apache.org/)               |
| compiler for node-gyp | [Need To Setup](https://github.com/TooTallNate/node-gyp/) | [Need To Install](https://github.com/TooTallNate/node-gyp/) |


## How to build and check on the device

Getting the source:

    $ git clone https://github.com/sony/cordova-plugin-cdp-nativebridge.git

Build with Compile:

    $ cd cordova-plugin-cdp-nativebridge/dev
    $ cordova build <platform>

※If you have Visual Studio, you just open the `NativeBridgeDevBed.sln` and build the solution from Visual Studio UI.

## How to update module for this sample

When master module update, you can use a follow command to sync for this sample.

    $ cordova prepare <platform>

# Spec

![sample](http://scm.sm.sony.co.jp/gitlab/cdp-jp/cordova-plugin-cdp-nativebridge/raw/master/docs/images/devbed_spec.png)

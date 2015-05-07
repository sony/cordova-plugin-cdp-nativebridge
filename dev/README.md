Native Bridge Dev Bed
================

# What's this?

This is a basic sample implementation of `cdp.nativebridge.js` and unit test application.

# How to use?

## Preparation

Before using, you need to prepare a development environment by making reference to [CDP Document](http://cdp-doc.am.sony.com/).

## How to build and check on the device

Getting the source:

    $ git clone http://scm.sm.sony.co.jp/gitlab/cdp-jp/cordova-plugin-nativebridge.git

Build with Compile:

    $ cd cordova-plugin-nativebridge/dev
    $ cordova build <platform>

※If you have Visual Studio, you just open the `NativeBridgeDevBed.sln` and build the solution from Visual Studio UI.

## How to update module for this sample

When master module update, you can use a follow command to sync for this sample.

    $ cordova prepare <platform>

# Spec

![sample](http://scm.sm.sony.co.jp/gitlab/cdp-jp/cordova-plugin-nativebridge/raw/master/docs/images/devbed_spec.png)

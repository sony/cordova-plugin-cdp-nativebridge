## Release Notes

### Release 1.1.0 (upcoming)

* [cdp.nativebridge.js] Implemented extend helper function for pure javascript in Gate class.

TypeScript Sample

```typescript
import Gate = CDP.NativeBridge.Gate;

class SampleGate extend Gate {
    constructor() {
        super({
            name: "SampleGate",
            android: {
                packageInfo: "com.sony.cdp.sample.SampleGate",
            },
        });
    }

    public coolMethod() {
        super.exec("coolMethod", <any>arguments);
    }
}

let gate = new SampleGate();
gate.coolMethod();
```

pure JavaScript Sample

  - The function behavior is same as extend() function of Backbone.js.

```javascript
var Gate = CDP.NativeBridge.Gate;

var SampleGate = Gate.extend({
    constructor: function (options) {
        Gate.call(this, {
            name: "SampleGate",
            android: {
                packageInfo: "com.sony.cdp.sample.SampleGate",
            },
        });
    },

    coolMethod: function () {
        Gate.prototype.exec.call("coolMethod", arguments);
    },
});

var gate = new SampleGate();
gate.coolMethod();
```

* Updated dev environment
  - Support for
    - Node.js 4.0+
    - TypeScript 1.6+
    - Cordova-CLI 5.2+

* [iOS] Fixed CDPGate I/F for cordova-ios 4+ ready.
  - replace the weak reference member from UIWebView* to CDVPlugin*.

* Added English method comments


### Release 1.0.0 (September 2015)

* Rename cordova-plugin-cdp-nativebridge

* Change dependent moudle.
  - cdp.promise.js


### Release 0.9.0 (May 2015)

Beta release.

* Support platforms:
  * android
  * ios


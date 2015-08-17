#!/usr/bin/env node 

(function() {
    var kick_grunt = require('../lib/kick_grunt');

    kick_grunt.exec([
        { cordova: 'build',     regexp: /build/ig,      prefix: 'cordova_build_'     },
        { cordova: 'emulate',   regexp: /emulate/ig,    prefix: 'cordova_build_'     },
        { cordova: 'run',       regexp: /run/ig,        prefix: 'cordova_build_'     },
        { cordova: 'prepare',   regexp: /prepare/ig,    prefix: 'cordova_prepare:'   },
    ]);
})();

#!/usr/bin/env node 

(function() {
    var kick_grunt = require('../lib/kick_grunt');

    kick_grunt.exec([
        { cordova: 'platform update',     regexp: /platform update/ig,      prefix: 'cordova_prepare:'     },
    ]);
})();

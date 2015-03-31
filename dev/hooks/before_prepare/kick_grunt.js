#!/usr/bin/env node 

// The line feed code of this file must be LF.

(function() {

    var spawn = require('child_process').spawn;
    var _cmdline = (function () {
        var cmdIndex = process.env.CORDOVA_CMDLINE.lastIndexOf('cordova');
        return process.env.CORDOVA_CMDLINE.slice(cmdIndex + 'cordova '.length);
    })();

    // npm install
    function npm(callback) {
        var fs = require('fs');
        if (fs.existsSync('./node_modules')) {
            console.log('*** Skip npm install ***');
            console.log('node_module looks already exists.' + 
                        'Then skipping npm install.\n' +
                        'If you see any error that indicates missing module,\n' + 
                        'or want to run npm install again, remove node_modules dir.\n' );
            if (callback) {
                callback();
            }
            return;
        }

        console.log('*** Start npm install ***');

        var npmcmd = (process.platform === 'win32' ? 'npm.cmd' : 'npm');

        try {
            var npm = spawn(npmcmd, ['install'], { cwd: 'build', stdio: 'inherit' });
        } catch (er) {
            console.log('error: ' + er);
        }

        npm.on('error', function (err) { ErrorHandler(err); });
        npm.on('close', function (code) {
            if (0 === code) {
                console.log('*** End npm install ***\n');
                if (callback){ callback(); }
            } else {
                console.log('*** Faild npm install *** : error code = ' + code + '\n');
                // Returned exit code = 1(Fail)
                process.exit(1);
            }
        });
    }

    // grunt
    function grunt(callback, task) {
        console.log('*** Start grunt ***');

        var gruntcmd = (process.platform === 'win32' ? 'grunt.cmd' : 'grunt');
        var cmdTasks = parsePlatforms();
        cmdTasks.push(task);

        var grunt = spawn(gruntcmd, cmdTasks, { cwd: 'build', stdio: 'inherit' });

        grunt.on('error', function (err) { ErrorHandler(err); });
        grunt.on('close', function (code) {
            // Exit code from grunt refer to http://gruntjs.com/api/exit-codes.
            if (0 === code) {
                console.log('*** End grunt ***\n');
                if (callback){ callback(); }
            } else {
                console.log('*** Faild grunt *** : error code = ' + code + '\n');
                // Returned exit code = 1(Fail)
                process.exit(1);
            }
        });
    }

    // Error handler
    function ErrorHandler(err) {
        console.log('Error occurred: ' + err);
    }

    // check command line
    /** Judge the target build is for debug or release.
        * if the command line includes '--release', grunt think it as release build.
        * see '$ cordova compile --help'
        */
    function isDebug() {
        if (null != _cmdline.match(/--release/ig)) {
            return false;
        } else {
            return true;
        }
    }

    // check command line
    /** Judge the grunt task "cordova_build_(debug/release)" or "cordova_prepare:(debug/release)".
        * return the task string
        */
    function queryGruntTask() {
        var supportCommand = [
            { cordova: 'build',     regexp: /build/ig,      prefix: 'cordova_build_'     },
            { cordova: 'emulate',   regexp: /emulate/ig,    prefix: 'cordova_build_'     },
            { cordova: 'run',       regexp: /run/ig,        prefix: 'cordova_build_'     },
            { cordova: 'prepare',   regexp: /prepare/ig,    prefix: 'cordova_prepare:'   },
        ];

        var target = isDebug() ? 'debug' : 'release';

        for (var i = 0, n = supportCommand.length; i < n; i++) {
            if (null != _cmdline.match(supportCommand[i].regexp)) {
                return supportCommand[i].prefix + target;
            }
        }
        return null;
    }

    // check command line
    /** Judge the target platforms.
        * if the command line includes platform names, call grunt cordova_register_platform:<platform>.
        * see '$ cordova compile --help'
        */
    function parsePlatforms() {
        var supportPlatforms = [
            { platform: 'android',          regexp: /android/ig         },
            { platform: 'ios',              regexp: /ios/ig             },
            { platform: 'firefoxos',        regexp: /firefoxos/ig       },
            { platform: 'windows8',         regexp: /windows8/ig        },
            { platform: 'browser',          regexp: /browser/ig         },
            { platform: 'amazon-fireos',    regexp: /amazon-fireos/ig   },
            { platform: 'blackberry10',     regexp: /blackberry10/ig    },
            { platform: 'windows',          regexp: /windows/ig         },
            { platform: 'wp8',              regexp: /wp8/ig             },
        ];

        var gruntTasks = [];

        supportPlatforms.forEach(function (checker) {
            if (null != _cmdline.match(checker.regexp)) {
                gruntTasks.push('cordova_register_platform:' + checker.platform);
            }
        });

        return gruntTasks;
    }

    var gruntTask = queryGruntTask();

    if (gruntTask) {
        // run the command
        npm(function () {
            grunt(null, gruntTask);
        });
    }

})();

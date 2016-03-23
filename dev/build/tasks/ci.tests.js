/*
 * ci.tests.js
 *
 * build test scripts and kick tests task
 */

module.exports = function (grunt) {

    var path = require('path');

    grunt.extendConfig({

        ci_tests_dir: 'tests',
        ci_tests_js_targets: null,
        ci_tests_ts_targets: ['<%= ci_tests_dir %>/**/*.ts'],

        clean: {
            ci_tests: {
                files: {
                    src: [
                        '<%= ci_tests_dir %>/**/*.js',
                        '<%= ci_tests_dir %>/**/*.map',
                    ],
                },
            },
        },

        // typescript lint
        tslint: {
            ci_tests: {
                options: {
                    configuration: 'tests/tslint/tslint.json',
                },
                files: {
                    src: '<%= ts_targets %>',
                },
            },
        },

        // javascript lint
        jshint: {
            ci_tests: {
                options: {
                    jshintrc: 'tests/jshint/jshintrc.json',
                },
                files: {
                    src: '<%= ci_tests_js_targets %>',
                },
            },
        },
    });

    //__________________________________________________________________________________________________________________________________________________________________________________________//


    // load plugin(s).
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');


    //__________________________________________________________________________________________________________________________________________________________________________________________//

    grunt.registerTask('ci_tests_setup', function () {
        var tsSources = grunt.config.get('ts_targets').concat(grunt.config.get('ci_tests_ts_targets'));
        grunt.config.set('ts_targets', tsSources);

        var jsSources = grunt.config.get('ci_tests_js_targets');
        if (!jsSources) {
            jsSources = [];
            tsSources.forEach(function (src) {
                jsSources.push(src.replace(/\.ts$/i, '.js'));
            });
            grunt.config.set('ci_tests_js_targets', jsSources);
        }
    });

    function command(commandString, doneCallback) {
        var arrayOfArguments = commandString.trim().split(' ');
        var commandToExecute = arrayOfArguments.shift() + ((process.platform === 'win32') ? '.cmd' : '');
        var child = grunt.util.spawn({
            cmd: commandToExecute,
            args: arrayOfArguments,
        }, doneCallback);
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stdout);
    }

    grunt.registerTask('ci_tests_testem', function () {
        var done = this.async();
        command('testem ci --file tests/jasmine/testem.json', function (error, result, code) {
            if (error && 0 !== code) {
                grunt.fail.warn(error, code);
            } else {
                done(true);
            }
        });
    });

    grunt.registerTask('ci_tests', [
        'clean:ci_tests',
        'ci_tests_setup',
        'ts:build',
        'tslint',
        'jshint',
        'ci_tests_testem',
    ]);

    grunt.registerTask('ci_tests_lint',     ['ci_tests_setup', 'ts:build', 'tslint', 'jshint']);
    grunt.registerTask('ci_tests_tslint',   ['ci_tests_setup', 'tslint']);
    grunt.registerTask('ci_tests_jshint',   ['ci_tests_setup', 'ts:build', 'jshint']);

};

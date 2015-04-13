/*
 * application build tasks
 */

module.exports = function (grunt) {

    grunt.extendConfig({

        // special key word replace by build configration
        'string-replace': {
            release: {
                options: {
                    replacements: [
                        {
                            pattern: '%% buildsetting %%',
                            replacement: '',
                        }
                    ],
                },
                files: [
                    {
                        '<%= tmpdir %>/<%= scripts %>/config.js': '<%= tmpdir %>/<%= scripts %>/config.js',
                    },
                ],
            },
        },

        // file copy
        copy: {
            // for relase build preprocess copy task
            app_prepare: {
                files: [
                    {// app/scripts
                        expand: true,
                        cwd: '<%= orgsrc %>',
                        src: '<%= scripts %>/**',
                        dest: '<%= tmpdir %>',
                    },
                    {// app/modules/include
                        expand: true,
                        cwd: '<%= orgsrc %>',
                        src: '<%= modules %>/include/**',
                        dest: '<%= tmpdir %>',
                    },
                    {// app/index.html
                        '<%= tmpdir %>/index.html': '<%= orgsrc %>/index.html',
                    },
                ],
            },
            // for debug build copy task
            app_index_file: {
                files: [
                    {// index.html
                        '<%= pkgdir %>/index.html': '<%= orgsrc %>/index.html',
                    },
                ]
            },
            // for relase build copy task
            app_release: {
                files: [
                    {// app resource
                        expand: true,
                        cwd: '<%= orgsrc %>',
                        src: ['<%= resources %>/**'],
                        dest: '<%= pkgdir %>'
                    },
                    {// app css resources
                        expand: true,
                        cwd: '<%= orgsrc %>',
                        src: ['<%= stylesheets %>/**', '!**/*.css', '!**/*.scss', '!**/*.rb'],
                        dest: '<%= pkgdir %>'
                    },
                ],
            },
            // for debug build copy task
            app_debug: {
                files: [
                    {// resource, templates, ts/js.
                        expand: true,
                        cwd: '<%= orgsrc %>',
                        src: ['<%= resources %>/**', '<%= templates %>/**', '<%= scripts %>/**'],
                        dest: '<%= pkgdir %>'
                    },
                    {// css
                        expand: true,
                        cwd: '<%= orgsrc %>',
                        src: ['<%= stylesheets %>/**', '!**/*.scss', '!**/*.rb'],
                        dest: '<%= pkgdir %>'
                    },
                ]
            },
        },

        // for debug build: lower path in construct modules scripts reference file.
        lower_path_in_html: {
            app_scripts: {
                src: ['<%= pkgdir %>/<%= scripts %>/**/*.<%= lib_module_scripts_ext %>'],
            },
        },

        // custom task: app_before_prepare hook.
        app_custom_task_before_prepare: {
            release: {},
            debug: {},
        },

        // custom task: app_before_build hook.
        app_custom_task_before_build: {
            release: {},
            debug: {},
        },

        // custom task: app_after_build hook.
        app_custom_task_after_build: {
            release: {},
            debug: {},
        },

        // custom task: app_after_package hook.
        app_custom_task_after_package: {
            release: {},
            debug: {},
        },
    });

    // load plugin(s).
    grunt.loadNpmTasks('grunt-string-replace');


    //__________________________________________________________________________________________________________________________________________________________________________________________//

    // hook task
    grunt.cdp = grunt.createCustomTaskEntry(grunt.cdp, 'app_before_prepare');
    grunt.createCustomTaskEntry(grunt.cdp, 'app_before_build');
    grunt.createCustomTaskEntry(grunt.cdp, 'app_after_build');
    grunt.createCustomTaskEntry(grunt.cdp, 'app_after_package');

    // custom task: app_before_prepare hook.
    grunt.registerMultiTask('app_custom_task_before_prepare', function () {
        switch (this.target) {
            case 'release':
                grunt.cdp.custom_tasks['app_before_prepare'].release.forEach(function (task) {
                    grunt.task.run([task]);
                });
                break;
            case 'debug':
                grunt.cdp.custom_tasks['app_before_prepare'].debug.forEach(function (task) {
                    grunt.task.run([task]);
                });
                break;
            default:
                throw 'unknown build option: ' + this.target;
        }
    });

    // custom task: app_before_build hook.
    grunt.registerMultiTask('app_custom_task_before_build', function () {
        switch (this.target) {
            case 'release':
                grunt.cdp.custom_tasks['app_before_build'].release.forEach(function (task) {
                    grunt.task.run([task]);
                });
                break;
            case 'debug':
                grunt.cdp.custom_tasks['app_before_build'].debug.forEach(function (task) {
                    grunt.task.run([task]);
                });
                break;
            default:
                throw 'unknown build option: ' + this.target;
        }
    });

    // custom task: app_after_build hook.
    grunt.registerMultiTask('app_custom_task_after_build', function () {
        switch (this.target) {
            case 'release':
                grunt.cdp.custom_tasks['app_after_build'].release.forEach(function (task) {
                    grunt.task.run([task]);
                });
                break;
            case 'debug':
                grunt.cdp.custom_tasks['app_after_build'].debug.forEach(function (task) {
                    grunt.task.run([task]);
                });
                break;
            default:
                throw 'unknown build option: ' + this.target;
        }
    });

    // custom task: app_after_package hook.
    grunt.registerMultiTask('app_custom_task_after_package', function () {
        switch (this.target) {
            case 'release':
                grunt.cdp.custom_tasks['app_after_package'].release.forEach(function (task) {
                    grunt.task.run([task]);
                });
                break;
            case 'debug':
                grunt.cdp.custom_tasks['app_after_package'].debug.forEach(function (task) {
                    grunt.task.run([task]);
                });
                break;
            default:
                throw 'unknown build option: ' + this.target;
        }
    });

    //__________________________________________________________________________________________________________________________________________________________________________________________//


    // task unit
    grunt.registerTask('app_revise_index_file_release',     ['remove_lazy_scripts_info',    'lower_path_in_html:app']);
    grunt.registerTask('app_revise_index_file_debug',       ['copy:app_index_file',         'lower_path_in_html:app']);
    grunt.registerTask('app_minify',                        ['uglify:app', 'cssmin:app', 'htmlmin:app']);

    grunt.registerTask('app_prepare_release',               ['clean:general', 'copy:app_prepare', 'copy:lib_prepare']);
    grunt.registerTask('app_prepare_debug',                 ['clean:general'                                        ]);

    grunt.registerTask('app_build_release',                 ['prepare_lazy_scripts_info',   'lib_build_release',    'typescript:release',   'string-replace:release',   'compass:app',  'app_revise_index_file_release', 'app_minify']);
    grunt.registerTask('app_build_debug',                   [                               'lib_build_debug',      'typescript:debug',                                 'compass',      'app_revise_index_file_debug'                ]);

    grunt.registerTask('app_copy_release',                  ['copy:app_release'                 ]);
    grunt.registerTask('app_copy_debug',                    ['copy:app_debug',  'copy:lib_debug']);

    grunt.registerTask('app_package_release',               ['app_copy_release',    'update_module_general_ignore_type', 'package_module_release',  'lower:app',    'cleanempty:release'                                      ]);
    grunt.registerTask('app_package_debug',                 ['app_copy_debug',      'update_module_general_ignore_type', 'package_module_debug',    'lower:app',    'lower_path_in_html:app_scripts', 'lower_path_in_html:lib']);

    grunt.registerTask('app_release',                       ['app_custom_task_before_prepare:release',  'app_prepare_release', 'app_custom_task_before_build:release', 'app_build_release',    'app_custom_task_after_build:release',  'app_package_release',  'app_custom_task_after_package:release']);
    grunt.registerTask('app_debug',                         ['app_custom_task_before_prepare:debug',    'app_prepare_debug',   'app_custom_task_before_build:debug',   'app_build_debug',      'app_custom_task_after_build:debug',    'app_package_debug',    'app_custom_task_after_package:debug'  ]);

    grunt.registerTask('release', ['app_release', 'clean:tmpdir']);
    grunt.registerTask('debug',   ['app_debug'                  ]);
};
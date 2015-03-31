/**
    build.app.plugins.js
    app/plugins build script.
*/

module.exports = function (grunt) {

    var fs = require('fs'),
        path = require('path');

    grunt.extendConfig({

        // config variable entries: directory
        plugins: 'plugins',                 // app/plugins default directory.
        plugins_www: 'www',                 // app/plugins/{id}/www default directory

        // internal variable
        app_plugins_pkgdir: 'plugins',      // cordova original plugins dir name.
        app_plugins_root_dir: '',           // plugin bulid source directory
        app_plugins_mode_release: false,    // flag for release build

        app_plugins_targets_info: [],       // build target info
        app_plugins_work_plugins: [],       // work target queue
        app_plugins_work_scripts_info: [],  // work script files for build
        app_plugins_work_id: '',            // work plugin id
        app_plugins_work_script_name: '',   // work script file name

        app_plugins_tmpdir_org: '<%= tmpdir %>',
        app_plugins_tmpdir: '<%= app_plugins_tmpdir_org %>/_<%= tmpdir %>',
        app_plugins_pkgdir_org: '<%= app_plugins_pkgdir %>',
        pkgcomp_remove_src_comment_targets_org: ['<%= pkgcomp_work_appdir %>/<%= libraries %>/<%= scripts %>/*.js'],

        // clean for plugin directory
        clean: {
            app_plugins: {
                files: {
                    src: ['<%= app_plugins_pkgdir %>/<%= app_plugins_work_id %>/<%= plugins_www %>/**', '<%= app_plugins_pkgdir %>/<%= app_plugins_work_id %>/plugin.xml'],
                },
            },
        },

        // file copy
        copy: {
            // for release build.
            app_plugins_prepare: {
                files: [
                    {// all files copy to temp.
                        expand: true,
                        cwd: '<%= orgsrc %>',
                        src: ['<%=  plugins %>/**'],
                        dest: '<%= tmpdir %>',
                    },
                ],
            },
            app_plugins_package: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= app_plugins_root_dir %>',
                        src: ['*/plugin.xml'],
                        dest: '<%= app_plugins_pkgdir %>',
                    },
                ],
            },
            app_plugins_plugin_package: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= app_plugins_root_dir %>',
                        src: ['*/plugin.xml', '*/*/*.js', '*/*/*.d.ts'],
                        dest: '<%= app_plugins_pkgdir %>',
                    },
                ],
            },
        },

        // typescript building
        typescript: {
            app_plugins_release: {
                options: {
                    comments: true,
                    declaration: true,
                    sourceMap: false,
                },
                files: [
                    {
                        '<%= app_plugins_root_dir %>/<%= app_plugins_work_id %>/<%= plugins_www %>/<%= app_plugins_work_script_name %>.js': '<%= app_plugins_root_dir %>/<%= app_plugins_work_id %>/<%= plugins_www %>/<%= app_plugins_work_script_name %>.ts',
                    },
                ],
            },
            app_plugins_debug: {
                options: {
                    sourceMap: false,
                },
                files: [
                    {
                        '<%= app_plugins_pkgdir %>/<%= app_plugins_work_id %>/<%= plugins_www %>/<%= app_plugins_work_script_name %>.js': '<%= app_plugins_root_dir %>/<%= app_plugins_work_id %>/<%= plugins_www %>/<%= app_plugins_work_script_name %>.ts',
                    },
                ],
            },
        },

        // js minify
        uglify: {
            app_plugins: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= app_plugins_root_dir %>',
                        src: ['*/<%= plugins_www %>/*.js'],
                        dest: '<%= app_plugins_pkgdir %>',
                    },
                ],
            },
            app_plugins_min: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= app_plugins_root_dir %>',
                        src: ['*/<%= plugins_www %>/*.js'],
                        dest: '<%= app_plugins_pkgdir %>',
                        rename: function (dest, src) {
                            return dest + '/' + src.replace(/\.js$/i, '.min.js');
                        },
                    },
                ],
            },
        },

        // custom task: set plugin root dir.
        app_plugins_set_root_dir: {
            release: {},
            debug: {},
        },

    });


    //__________________________________________________________________________________________________________________________________________________________________________________________//


    // custom task: set plugin root dir.
    grunt.registerMultiTask('app_plugins_set_root_dir', function () {
        var root;
        switch (this.target) {
            case 'release':
                root = path.join(grunt.config.get('tmpdir'), grunt.config.get('plugins'));
                grunt.config.set('app_plugins_mode_release', true);
                break;
            case 'debug':
                root = path.join(grunt.config.get('orgsrc'), grunt.config.get('plugins'));
                break;
            default:
                throw 'unknown build option: ' + this.target;
        }
        grunt.config.set('app_plugins_root_dir', root);
    });

    // custom task: set target plugins
    grunt.registerTask('app_plugins_set_targets', function () {
        var targetPlugins = grunt.config.get('app_plugins_targets_info');
        var root = grunt.config.get('app_plugins_root_dir');

        if (fs.existsSync(root)) {
            fs.readdirSync(root).forEach(function (id) {
                var plugin = {};
                var pluginDir = path.join(root, id);
                var srcDir = path.join(pluginDir, grunt.config.get('plugins_www'));
                if (fs.statSync(pluginDir).isDirectory() && fs.statSync(srcDir).isDirectory()) {
                    plugin.id = id;
                    plugin.scripts = queryTargetScripts(srcDir);
                    targetPlugins.push(plugin);
                }
            });
        }

        grunt.config.set('app_plugins_targets_info', targetPlugins);
    });

    // custom task: set work plugins
    grunt.registerTask('app_plugins_set_work_plugins', function () {
        grunt.config.set('app_plugins_work_plugins', grunt.config.get('app_plugins_targets_info').slice(0));
    });

    // custom task: clean package plugin directory
    grunt.registerTask('app_plugins_clean', function () {
        doPluginTask(this, function (plugin) {
            // update variable.
            grunt.config.set('app_plugins_work_id', plugin.id);
            // schedule next tasks.
            grunt.task.run('clean:app_plugins');
        });
    });

    // custom task: build all plugins
    grunt.registerTask('app_plugins_build_plugins', function () {
        doPluginTask(this, function (plugin) {
            // update variable.
            grunt.config.set('app_plugins_work_scripts_info', plugin.scripts.slice(0));
            grunt.config.set('app_plugins_work_id', plugin.id);

            // schedule next tasks.
            grunt.task.run('app_plugins_build_scripts');
        });
    });

    // custom task: build all scrips
    grunt.registerTask('app_plugins_build_scripts', function () {
        var scripts = grunt.config.get('app_plugins_work_scripts_info');
        var script;
        if (!!scripts && 0 < scripts.length) {
            script = scripts.shift();
            // update variable.
            grunt.config.set('app_plugins_work_scripts_info', scripts);
            grunt.config.set('app_plugins_work_script_name', script);

            // schedule next tasks.
            if (grunt.config.get('app_plugins_mode_release')) {
                grunt.task.run('typescript:app_plugins_release');
            } else {
                grunt.task.run('typescript:app_plugins_debug');
            }
            grunt.task.run('app_plugins_build_scripts');
        }
    });

    // custom task: set environment for package plugins.
    grunt.registerTask('app_plugins_set_env', function () {
        grunt.config.set('app_plugins_tmpdir_org', grunt.config.get('tmpdir'));
        grunt.config.set('tmpdir', grunt.config.get('app_plugins_tmpdir'));

        grunt.config.set('app_plugins_pkgdir_org', grunt.config.get('app_plugins_pkgdir'));
        grunt.config.set('app_plugins_pkgdir', path.join(grunt.config.get('app_plugins_tmpdir_org'), grunt.config.get('app_plugins_pkgdir_org')));

        grunt.config.set('pkgcomp_remove_src_comment_targets_org', grunt.config.get('pkgcomp_remove_src_comment_targets'));
        grunt.config.set('pkgcomp_remove_src_comment_targets', [
            path.join(grunt.config.get('tmpdir'), grunt.config.get('plugins'), '**/*.js'),
            path.join(grunt.config.get('tmpdir'), grunt.config.get('plugins'), '**/*.d.ts'),
        ]);
    });

    // custom task: restore environment for package plugins.
    grunt.registerTask('app_plugins_restore_env', function () {
        grunt.config.set('tmpdir', grunt.config.get('app_plugins_tmpdir_org'));
        grunt.config.set('app_plugins_pkgdir', grunt.config.get('app_plugins_pkgdir_org'));
        grunt.config.set('pkgcomp_remove_src_comment_targets', grunt.config.get('pkgcomp_remove_src_comment_targets_org'));
    });


    //__________________________________________________________________________________________________________________________________________________________________________________________//

    // Helper API

    function doPluginTask(owner, taskCallback) {
        var plugins = grunt.config.get('app_plugins_work_plugins');
        var plugin;
        if (!!plugins && 0 < plugins.length) {
            plugin = plugins.shift();
            // update variable.
            grunt.config.set('app_plugins_work_plugins', plugins);
            taskCallback(plugin);
            grunt.task.run(owner.nameArgs);
        }
    }

    // query build target scripts.
    function queryTargetScripts(targetDir) {
        var scripts = [];
        fs.readdirSync(targetDir).forEach(function (file) {
            if (!path.basename(file).toLowerCase().match(/.d.ts/g) && path.basename(file).toLowerCase().match(/.ts/g)) {
                scripts.push(path.basename(file, path.extname(file)));
            }
        });
        return scripts;
    }

    //__________________________________________________________________________________________________________________________________________________________________________________________//


    grunt.cdp = grunt.createCustomTaskEntry(grunt.cdp, 'app_before_build');
                grunt.createCustomTaskEntry(grunt.cdp, 'cordova_prepare_hook');

    grunt.cdp.custom_tasks['app_before_build'].release.push('app_plugins_release');
    grunt.cdp.custom_tasks['app_before_build'].debug.push('app_plugins_debug');
    grunt.cdp.custom_tasks['cordova_prepare_hook'].release.push('app_plugins_cordova_prepare_release');
    grunt.cdp.custom_tasks['cordova_prepare_hook'].debug.push('app_plugins_cordova_prepare_debug');


    //__________________________________________________________________________________________________________________________________________________________________________________________//


    // task unit
    grunt.registerTask('app_plugins_prepare_release',   ['copy:app_plugins_prepare',    'app_plugins_set_root_dir:release',    'app_plugins_set_targets', 'app_plugins_set_work_plugins', 'app_plugins_clean']);
    grunt.registerTask('app_plugins_prepare_debug',     [                               'app_plugins_set_root_dir:debug',      'app_plugins_set_targets', 'app_plugins_set_work_plugins', 'app_plugins_clean']);

    grunt.registerTask('app_plugins_build_release',     ['app_plugins_set_work_plugins', 'app_plugins_build_plugins', 'uglify:app_plugins']);
    grunt.registerTask('app_plugins_build_debug',       ['app_plugins_set_work_plugins', 'app_plugins_build_plugins'                      ]);

    grunt.registerTask('app_plugins_package_release',   ['copy:app_plugins_package']);
    grunt.registerTask('app_plugins_package_debug',     ['copy:app_plugins_package']);

    grunt.registerTask('app_plugins_release',           ['app_plugins_prepare_release', 'app_plugins_build_release',    'app_plugins_package_release']);
    grunt.registerTask('app_plugins_debug',             ['app_plugins_prepare_debug',   'app_plugins_build_debug',      'app_plugins_package_debug'  ]);

    // for app build entry
    grunt.registerTask('app_plugins_cordova_prepare_release',   ['app_prepare_release', 'app_plugins_release', 'clean:tmpdir']);
    grunt.registerTask('app_plugins_cordova_prepare_debug',     [                       'app_plugins_debug'                  ]);

    // for plugin package entry
    grunt.registerTask('plugin', [
        'clean:tmpdir',
        'app_plugins_set_env',
        'app_prepare_release', 'app_plugins_prepare_release', 'app_plugins_set_work_plugins', 'app_plugins_build_plugins',
        'pkgcomp_remove_src_path_comments',
        'uglify:app_plugins_min',
        'copy:app_plugins_plugin_package',
        'clean:tmpdir',
        'app_plugins_restore_env',
    ]);
};

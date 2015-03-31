/*
 * components package task from cafeteria
 */

module.exports = function (grunt) {

    var fs = require("fs"),
        path = require("path");

    grunt.extendConfig({

        pkgcomp_srcmap_enable: true,

        pkgcomp_src_root: '_pkgsrc',
        pkgcomp_src_root_dir: '<%= pkgcomp_tmpdir_backup %>/<%= pkgcomp_src_root %>',

        pkgcomp_work_root: '_pkgwork',
        pkgcomp_work_tmpdir: "<%= pkgcomp_tmpdir_backup %>/<%= pkgcomp_work_root %>/<%= pkgcomp_tmpdir_backup %>",

        pkgcomp_work_pkg_dir: '_pkgroot',
        pkgcomp_target_root_dir: '<%= pkgcomp_tmpdir_backup %>/<%= pkgcomp_work_pkg_dir %>',

        // backup variable.
        pkgcomp_tmpdir_backup: '<%= tmpdir %>',
        pkgcomp_pkgdir_backup: '<%= pkgdir %>',

        pkgcomp_build_dir: 'build',
        pkgcomp_build_tasks_dir: 'build/tasks',
        pkgcomp_build_res_dir: 'build/res',

        // alias
        pkgcomp_work_appdir: "<%= pkgcomp_work_tmpdir %>/<%= orgsrc %>",
        pkgcomp_work_platfrom_porting_dir: "<%= pkgcomp_work_tmpdir %>/<%= cordova_platform_porting %>",

        pkgcomp_revise_d_ts_targets: ['<%= pkgcomp_work_appdir %>/<%= libraries %>/<%= scripts %>/*.d.ts'],
        pkgcomp_remove_src_comment_targets: ['<%= pkgcomp_work_appdir %>/<%= libraries %>/<%= scripts %>/*.js'],
        pkgcomp_package_targets: [{ src: '<%= pkgcomp_work_appdir %>/<%= libraries %>', dst: '<%= pkgcomp_src_root_dir %>/<%= libraries %>' }],

        pkgcomp_work_package_targets: [],
        pkgcomp_package_src: '',
        pkgcomp_package_dst: '',

        pkgcomp_script_banner: '',

        // not component in package dir
        clean: {
            options: {
                force: true,
            },
            pkgcomp: {
                files: {
                    src: [
                        '<%= pkgcomp_tmpdir_backup %>/*', '!<%= pkgcomp_target_root_dir %>'
                    ],
                }
            },
        },

        // file copy
        copy: {
            // base copy task to temporary directory
            pkgcomp_prepare: {
                files: [
                    {// app/modules/include
                        expand: true,
                        cwd: '<%= orgsrc %>',
                        src: '<%= modules %>/include/**',
                        dest: '<%= tmpdir %>',
                    },
                    {// app/index.html
                        '<%= tmpdir %>/index.html': '<%= orgsrc %>/index.html',
                    },
                    {// build/package*.json
                        expand: true,
                        cwd: '<%= pkgcomp_build_dir %>',
                        src: 'package.*.json',
                        dest: '<%= pkgcomp_src_root_dir %>/<%= pkgcomp_build_dir %>',
                    },
                    {// build/tasks
                        expand: true,
                        cwd: '<%= pkgcomp_build_tasks_dir %>',
                        src: '**',
                        dest: '<%= pkgcomp_src_root_dir %>/<%= pkgcomp_build_tasks_dir %>',
                    },
                    {// build/res
                        expand: true,
                        dot: true,
                        cwd: '<%= pkgcomp_build_res_dir %>',
                        src: '**',
                        dest: '<%= pkgcomp_src_root_dir %>/<%= pkgcomp_build_res_dir %>',
                    },
                ],
            },
            pkgcomp_package: {
                files: [
                    {// css
                        expand: true,
                        cwd: '<%= pkgcomp_package_src %>',
                        src: ['<%= stylesheets %>/**', '!<%= stylesheets %>/.sass-cache/**',
                                '<%= stylesheets %>/**/*.css',
                                '!<%= stylesheets %>/**/*.scss', '!<%= stylesheets %>/**/*.rb'],
                        dest: '<%= pkgcomp_package_dst %>',
                    },
                    {// js
                        expand: true,
                        cwd: '<%= pkgcomp_package_src %>',
                        src: '<%= scripts %>/*.js',
                        dest: '<%= pkgcomp_package_dst %>',
                    },
                    {// d.ts
                        expand: true,
                        cwd: '<%= pkgcomp_package_src %>/<%= scripts %>',
                        src: ['*.d.ts'],
                        dest: '<%= pkgcomp_package_dst %>/include',
                    },
                ],
            },
            pkgcomp_package_for_minify: {
                files: [
                    {// css
                        expand: true,
                        cwd: '<%= pkgcomp_package_src %>/<%= stylesheets %>',
                        src: ['*.min.css', '*.map'],
                        dest: '<%= pkgcomp_package_dst %>/<%= stylesheets %>',
                    },
                    {// js
                        expand: true,
                        cwd: '<%= pkgcomp_package_src %>/<%= scripts %>',
                        src: ['*.min.js', '*.map'],
                        dest: '<%= pkgcomp_package_dst %>/<%= scripts %>',
                    },
                ],
            },
            pkgcomp_module_release: {
                files: [
                    {// js
                        expand: true,
                        cwd: '<%= pkgcomp_src_root_dir %>',
                        src: ['**', '!<%= pkgcomp_build_dir %>/**'],
                        dest: '<%= pkgcomp_target_root_dir %>',
                    },
                ],
            },
        },

        // js minify
        uglify: {
            pkgcomp: {
                options: {
                    banner: '<%= pkgcomp_script_banner %>',
                    sourceMap: '<%= pkgcomp_srcmap_enable %>',
                    sourceMapName: function (src) {
                        return src.replace(/\.js$/i, '.map');
                    },
                },
                files: [
                    {// file name is appended ".min"
                        expand: true,
                        cwd: '<%= pkgcomp_package_src %>',
                        src: ['<%= scripts %>/*.js'],
                        dest: '<%= pkgcomp_package_src %>',
                        rename: function (dest, src) {
                            return dest + '/' + src.replace(/\.js$/i, '.min.js');
                        }
                    },
                ],
            },
        },

        // css minify
        cssmin: {
            pkgcomp: {
                files: [
                    {// file name is appended ".min"
                        expand: true,
                        cwd: '<%= pkgcomp_package_src %>',
                        src: ['<%= stylesheets %>/*.css'],
                        dest: '<%= pkgcomp_package_src %>',
                        rename: function (dest, src) {
                            return dest + '/' + src.replace(/\.css$/i, '.min.css');
                        }
                    },
                ]
            },
        },

        // remove empty directories
        cleanempty: {
            pkgcomp: {
                options: {
                    files: false,
                },
                src: ['<%= pkgcomp_src_root_dir %>/**/*'],
            },
        },

        // custom task: revise d.ts reference path.
        pkgcomp_revise_d_ts_reference_path: {
            build: {
                src: '<%= pkgcomp_revise_d_ts_targets %>',
            },
        },

        // custom task: remove "reference path" and "sourceURL" comments from js files.
        pkgcomp_remove_src_path_comments: {
            build: {
                src: '<%= pkgcomp_remove_src_comment_targets %>',
            },
        },
    });


    //__________________________________________________________________________________________________________________________________________________________________________________________//


    // custom task: switch package directory for package component spec.
    grunt.registerTask('pkgcomp_set_env', 'switch work directory for pacakge component.', function () {
        // off: lower
        grunt.config.set('lower_enable', false);

        // backup
        grunt.config.set('pkgcomp_tmpdir_backup', grunt.config.get('tmpdir'));
        grunt.config.set('pkgcomp_pkgdir_backup', grunt.config.get('pkgdir'));

        // switch
        grunt.config.set('tmpdir', path.join(grunt.config.get('pkgcomp_tmpdir_backup'), grunt.config.get('pkgcomp_work_root'), grunt.config.get('pkgcomp_tmpdir_backup')));
        grunt.config.set('pkgdir', path.join(grunt.config.get('pkgcomp_tmpdir_backup'), grunt.config.get('pkgcomp_work_root'), grunt.config.get('pkgcomp_pkgdir_backup')));

        console.log("tmpdir: " + grunt.config.get('tmpdir'));
        console.log("pkgdir: " + grunt.config.get('pkgdir'));
    });

    // custom task: rollback package directory for default.
    grunt.registerTask('pkgcomp_restore_env', 'rollback work directory for default.', function () {
        // rollback
        grunt.config.set('tmpdir', grunt.config.get('pkgcomp_tmpdir_backup'));
        grunt.config.set('pkgdir', grunt.config.get('pkgcomp_pkgdir_backup'));

        // on: lower
        grunt.config.set('lower_enable', true);

        console.log("tmpdir: " + grunt.config.get('tmpdir'));
        console.log("pkgdir: " + grunt.config.get('pkgdir'));
    });

    // custom task: set cordova target platforms.
    grunt.registerTask('pkgcomp_set_cordova_target_platforms', function () {
        var targetPratforms = [];
        fs.readdirSync('platforms').forEach(function (platform) {
            targetPratforms.push(platform);
        });
        grunt.config.set('cordova_target_platforms', targetPratforms);

        if (0 < targetPratforms.length) {
            (function () {
                var reviseTargets = grunt.config.get('pkgcomp_revise_d_ts_targets');
                var removeSrcCommentTargets = grunt.config.get('pkgcomp_remove_src_comment_targets');
                var packageTargets = grunt.config.get('pkgcomp_package_targets');
                // dev
                reviseTargets.push(path.join(grunt.config.get('pkgcomp_work_appdir'), grunt.config.get('porting'), grunt.config.get('scripts'), '*.d.ts'));
                removeSrcCommentTargets.push(path.join(grunt.config.get('pkgcomp_work_appdir'), grunt.config.get('porting'), grunt.config.get('scripts'), '*.js'));
                packageTargets.push({
                    src: path.join(grunt.config.get('pkgcomp_work_appdir'), grunt.config.get('porting')),
                    dst: path.join(grunt.config.get('pkgcomp_src_root_dir'), grunt.config.get('porting')),
                });

                // platform
                targetPratforms.forEach(function (platform) {
                    grunt.config.set('cordova_platform', platform);
                    reviseTargets.push(path.join(grunt.config.get('pkgcomp_work_platfrom_porting_dir'), '*.d.ts'));
                    removeSrcCommentTargets.push(path.join(grunt.config.get('pkgcomp_work_platfrom_porting_dir'), '*.js'));
                    packageTargets.push({
                        src: grunt.config.get('pkgcomp_work_platfrom_porting_dir'),
                        dst: path.join(grunt.config.get('pkgcomp_src_root_dir'), grunt.config.get('porting') + '_' + platform),
                    });
                    grunt.config.set('pkgcomp_revise_d_ts_targets', reviseTargets);
                    grunt.config.set('pkgcomp_remove_src_comment_targets', removeSrcCommentTargets);
                    grunt.config.set('pkgcomp_package_targets', packageTargets);
                });
            }());
        }
    });

    // custom task: release build for "platform/porting".
    grunt.registerTask('pkgcomp_cordova_build_platform', function () {
        doPlatformTask(this, function () {
            // "tmpdir" to "temp/platforms/<platform>".
            grunt.config.set('tmpdir', grunt.config.get('glue_ts_cordova_platform_work_dir'));
            // "lib_kind" to "porting".
            grunt.config.set('lib_kind', 'porting');
            // "lib_root_dir" to "temp/platforms/<platform>/porting".
            grunt.config.set('lib_root_dir', path.join(grunt.config.get('glue_ts_cordova_platform_work_dir'), grunt.config.get('porting')));

            // build
            grunt.task.run('lib_extract_module_info:scripts');
            grunt.task.run('pkgcomp_module_compile');
        });
    });

    // custom task: release build for dev/porting.
    grunt.registerTask('pkgcomp_build_dev_poritng', function () {
        // "lib_kind" to "porting".
        grunt.config.set('lib_kind', 'porting');
        // "lib_root_dir" to "temp/platforms/<platform>/porting".
        grunt.config.set('lib_root_dir', path.join(grunt.config.get('tmpdir'), grunt.config.get('porting')));

        // build
        grunt.task.run('lib_extract_module_info:scripts');
        grunt.task.run('pkgcomp_module_compile');
    });

    // custom task: set work package targets.
    grunt.registerTask('pkgcomp_set_work_package_targets', function () {
        grunt.config.set('pkgcomp_work_package_targets', grunt.config.get('pkgcomp_package_targets').slice(0));
    });

    // custom task: revise d.ts reference path.
    grunt.registerMultiTask('pkgcomp_revise_d_ts_reference_path', 'Revise d.ts reference path', function () {
        this.filesSrc.forEach(function (file) {
            var src = grunt.file.read(file);
            var rev = src;
            var refPathInfo = [];
            var refPathDefs = src.match(/<reference path="[\s\S]*?"/g);

            if (null != refPathDefs) {
                refPathDefs.forEach(function (refpath) {
                    var filePath = refpath.match(/("|')[\s\S]*?("|')/)[0].replace(/("|')/g, '');
                    var fileName = path.basename(filePath);
                    refPathInfo.push({
                        refpath: refpath,
                        path: filePath,
                        file: fileName,
                    });
                });
                refPathInfo.forEach(function (target) {
                    rev = rev.replace(target.refpath, '<reference path="' + target.file + '"');
                });
                fs.writeFileSync(file, rev);
            }
        });
    });

    // custom task: remove "reference path" and "sourceURL" comments from js files.
    grunt.registerMultiTask('pkgcomp_remove_src_path_comments', 'Remove "reference path" and "sourceURL" comments from js files.', function () {
        this.filesSrc.forEach(function (file) {
            var src = grunt.file.read(file);
            var rev = src;
            rev = rev.replace(/\/\/\/ <reference path="[\s\S]*?>/g, '');
            rev = rev.replace(/\/\/@ sourceURL=[\s\S]*?\n/g, '');
            rev = rev.replace(/\/\/# sourceURL=[\s\S]*?\n/g, '');
            fs.writeFileSync(file, rev);
        });
    });

    // custom task: copy package files.
    grunt.registerTask('pkgcomp_copy_package', function () {
        doPackageTask(this, function () {
            grunt.task.run('copy:pkgcomp_package');
        });
    });

    // custom task: copy package unversioned files.
    grunt.registerTask('pkgcomp_versioning_preprocess', function () {
        grunt.config.set('lib_kind_fileter_enable', false);
    });

    // custom task: copy package unversioned files.
    grunt.registerTask('pkgcomp_versioning_postprocess', function () {
        grunt.config.set('lib_kind_fileter_enable', true);
    });

    // custom task: copy package unversioned files.
    grunt.registerTask('pkgcomp_module_versioning', function () {
        doPackageTask(this, function () {
            renameModuleVersioned();
        });
    });

    // custom task: minify.
    grunt.registerTask('pkgcomp_module_minify', function () {
        doPackageTask(this, function () {
            // update banner
            grunt.config.set('pkgcomp_script_banner', grunt.config.get('minify_banner') + (grunt.config.get('pkgcomp_srcmap_enable') ? '' : '\n'));
            grunt.task.run('uglify:pkgcomp');
            grunt.task.run('cssmin:pkgcomp');
            grunt.task.run('copy:pkgcomp_package_for_minify');
        });
    });

    // custom task: command line parse.
    grunt.registerTask('pkgcomp_cmdline_parse', function () {
        (function () {
            var sourceMap = grunt.option('srcmap');
            if (null != sourceMap) {
                grunt.config.set('pkgcomp_srcmap_enable', !!sourceMap);
            }
        })();
    });

    //__________________________________________________________________________________________________________________________________________________________________________________________//

    // Helper API

    function doPlatformTask(owner, taskCallback) {
        var platforms = grunt.config.get('cordova_work_platforms');
        var platform;
        if (!!platforms && 0 < platforms.length) {
            platform = platforms.shift();
            // update variable.
            grunt.config.set('cordova_work_platforms', platforms);
            grunt.config.set('cordova_platform', platform);
            taskCallback();
            grunt.task.run(owner.nameArgs);
        }
    }

    function doPackageTask(owner, taskCallback) {
        var targets = grunt.config.get('pkgcomp_work_package_targets');
        var target;
        if (!!targets && 0 < targets.length) {
            target = targets.shift();
            // update variable.
            grunt.config.set('pkgcomp_work_package_targets', targets);
            grunt.config.set('pkgcomp_package_src', target.src);
            grunt.config.set('pkgcomp_package_dst', target.dst);
            taskCallback();
            grunt.task.run(owner.nameArgs);
        }
    }

    // hook task: custom versioning.
    grunt.cdp = grunt.createCustomTaskEntry(grunt.cdp, 'pkgcomp_versioning_entry', { scripts: [], stylesheets: [] });

    function renameModuleVersioned() {
        var parseExtraVersionEntry = function (sourceKind) {
            return grunt.cdp.custom_tasks['pkgcomp_versioning_entry'][sourceKind];
        };

        var proc = function (moduleInfo, sourceKind, ext) {
            var dir = path.join(grunt.config.get('pkgcomp_package_src'), grunt.config.get(sourceKind));
            var dst = path.join(grunt.config.get('pkgcomp_package_dst'), grunt.config.get(sourceKind));

            moduleInfo = moduleInfo.concat(parseExtraVersionEntry(sourceKind));

            moduleInfo.forEach(function (info) {
                var target, file;
                var rename, copy;
                if (info.version) {
                    target = path.join(dir, info.name + ext);
                    if (fs.existsSync(target)) {
                        file = info.name + '-' + info.version + ext;
                        rename = path.join(dir, file);
                        copy = path.join(dst, file);
                        fs.renameSync(target, rename);
                        fs.writeFileSync(copy, fs.readFileSync(rename));
                    }
                }
            });
        };

        proc(grunt.config.get('js_modules_info'),       'scripts',        '.js');
        proc(grunt.config.get('lib_css_modules_info'),  'stylesheets',    '.css');
    }


    //__________________________________________________________________________________________________________________________________________________________________________________________//


    // task unit
    grunt.registerTask('pkgcomp_prepare', ['pkgcomp_set_env', 'clean:pkgcomp', 'pkgcomp_set_cordova_target_platforms', 'glue_ts_cordova_set_env', 'glue_ts_cordova_prepare_release', 'copy:lib_prepare', 'legacy_command_set_pkgdst:development', 'copy:legacy_command_dev_prepare', 'copy:pkgcomp_prepare', 'glue_ts_cordova_restore_env']);

    grunt.registerTask('pkgcomp_module_compile',        ['lib_update_env', 'lib_build_modules']);
    grunt.registerTask('pkgcomp_compile_modules',       ['glue_ts_cordova_set_env', 'lib_extract_module_info:scripts', 'pkgcomp_module_compile', 'cordova_set_work_platforms', 'pkgcomp_cordova_build_platform', 'glue_ts_cordova_restore_env']);
    grunt.registerTask('pkgcomp_compile_dev_modules',   ['glue_ts_cordova_set_env', 'legacy_command_set_pkgdst:development', 'pkgcomp_build_dev_poritng', 'glue_ts_cordova_restore_env']);
    grunt.registerTask('pkgcomp_compile',               ['pkgcomp_compile_modules', 'pkgcomp_compile_dev_modules']);

    grunt.registerTask('pkgcomp_revise',        ['pkgcomp_revise_d_ts_reference_path', 'pkgcomp_remove_src_path_comments', 'pkgcomp_set_work_package_targets', 'pkgcomp_copy_package']);
    grunt.registerTask('pkgcomp_versioning',    ['pkgcomp_versioning_preprocess', 'glue_ts_cordova_set_env', 'lib_extract_module_info', 'glue_ts_cordova_restore_env', 'pkgcomp_set_work_package_targets', 'pkgcomp_module_versioning', 'pkgcomp_versioning_postprocess']);
    grunt.registerTask('pkgcomp_minify',        ['pkgcomp_set_work_package_targets', 'pkgcomp_module_minify']);

    grunt.registerTask('pkgcomp_preprocess',   ['pkgcomp_prepare', 'pkgcomp_compile', 'pkgcomp_revise', 'pkgcomp_versioning', 'pkgcomp_minify', 'cleanempty:pkgcomp']);
    grunt.registerTask('pkgcomp_postprocess',  ['clean:pkgcomp', 'pkgcomp_restore_env']);

    // for module release task.
    grunt.registerTask('module', ['pkgcomp_cmdline_parse', 'pkgcomp_preprocess', 'copy:pkgcomp_module_release', 'pkgcomp_postprocess']);
};

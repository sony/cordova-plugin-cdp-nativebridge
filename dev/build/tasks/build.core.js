/**
    build.core.js

    core task

    tasks:

    - "copy:module_general"     : Copies all files in orgsrc/modules/ except *.js and *.css into package.

    - "copy:module_debug" :
      Copying JS and CSS files in module dir from original dir to package dir ignores min version.
      - Copying JS without version.
      - Copying JS with version trimming version number.
      - Copying CSS without version.
      - Copying CSS with version trimming version number

    - "copy:module_release" :
      Copying JS and CSS files in module dir from original dir to package dir only for min version.
      - Copying min.js trimming version number and ".min"
      - Copying min.css trimming version number and ".min"

    - module_general_target
      A list indicates which files are copied as it is in module directory.
      Default value is set to copy all files except *.js and *.css.
      So *.js and *.css will be copied as 

    - "prepare" : Alias task
    - "package_module_debug" : Alias task
    - "package_module_release" : Alias task

    description:

    - moduleディレクトリ
      - modulesの下には、componentのJSと、packageの全体が入る。
    
    - modulesの下に対する処理方針。
      - debug build では、minifyされていないバージョンを極力利用する。
      - release build では、minifyされたバージョンを極力利用する。
      - modulesの下のディレクトリ構成に依存せずに、動作可能になるように、
        Productionにコピーする。
      - ここでは、bower.jsonや、package.jsonは読まない。(読めない想定)

    - 動作
      - JS, CSS以外に関して全ファイルをコピーしている。
      - JS, CSSに関しては、.min.js/css がある場合は、minifyされた
        JS/CSSとして扱い、.min の部分をとってコピーする。(release build 時)
      - debug buildの時には、.min.js/cssは、コピーしない。
      - version番号付きのものが存在した場合には、そちらのファイルを優先する。

*/

module.exports = function (grunt) {

    grunt.extendConfig({

        // config variable
        module_rename_enable: true,                                 // rename "hoge.-x.x.x.js | hoge-x.x.x.min.js" to "hoge.js"
        module_general_target: ['**/**', '!**/*.js', '!**/*.css'],  // module copy target and black list

        // all work directories cleaning
        clean: {
            options: {
                force: true,
            },
            general: {
                files: {
                    src: [
                        '<%= tmpdir %>', '<%= pkgdir %>/*',   // '/*' では . 始まりのファイルは削除されない様子
                    ],
                },
            },
            tmpdir: {
                files: {
                    src: [
                        '<%= tmpdir %>'
                    ],
                },
            },
        },

        // file copy
        copy: {
            // prepare module's general files.
            module_general: {
                files: [
                    {// for module general files, except for black list.
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>',
                        src: '<%= module_general_target %>',
                        dest: '<%= pkgdir %>/<%= modules %>',
                    },
                ],
            },

            // prepare debug module.
            module_debug: {
                files: [
                    {// for platform target specific js "NO version string" (debug)
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>',
                        src: ['**/*.js', '!**/*.min.js'],
                        dest: '<%= pkgdir %>/<%= modules %>',
                        filter: function (src) {
                            return !hasVersionString(src);
                        }
                    },
                    {// for platform target specific js (debug)
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>',
                        src: ['**/*.js', '!**/*.min.js'],
                        dest: '<%= pkgdir %>/<%= modules %>',
                        filter: function (src) {
                            return hasVersionString(src);
                        },
                        rename: function (dest, src) {
                            return dest + '/' + trimVerOrMinSuffix(src);
                        }
                    },
                    {// for platform target specific css "NO version string" (debug)
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>',
                        src: ['**/*.css', '!**/*.min.css'],
                        dest: '<%= pkgdir %>/<%= modules %>',
                        filter: function (src) {
                            return !hasVersionString(src);
                        },
                    },
                    {// for platform target specific css (debug)
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>',
                        src: ['**/*.css', '!**/*.min.css'],
                        dest: '<%= pkgdir %>/<%= modules %>',
                        filter: function (src) {
                            return hasVersionString(src);
                        },
                        rename: function (dest, src) {
                            return dest + '/' + trimVerOrMinSuffix(src);
                        }
                    },
                ],
            },

            // prepare module release build.
            module_release: {
                files: [
                    {// for platform target specific js "NO version string" (release)
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>',
                        src: '**/*.min.js',
                        dest: '<%= pkgdir %>/<%= modules %>',
                        filter: function (src) {
                            return !hasVersionString(src);
                        },
                        rename: function (dest, src) {
                            return dest + '/' + trimVerOrMinSuffix(src);
                        }
                    },
                    {// for platform target specific js (release)
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>',
                        src: '**/*.min.js',
                        dest: '<%= pkgdir %>/<%= modules %>',
                        filter: function (src) {
                            return hasVersionString(src);
                        },
                        rename: function (dest, src) {
                            return dest + '/' + trimVerOrMinSuffix(src);
                        }
                    },
                    {// for platform target specific css "NO version string" (release)
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>',
                        src: '**/*.min.css',
                        dest: '<%= pkgdir %>/<%= modules %>',
                        filter: function (src) {
                            return !hasVersionString(src);
                        },
                        rename: function (dest, src) {
                            return dest + '/' + trimVerOrMinSuffix(src);
                        }
                    },
                    {// for platform target specific css (release)
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>',
                        src: '**/*.min.css',
                        dest: '<%= pkgdir %>/<%= modules %>',
                        filter: function (src) {
                            return hasVersionString(src);
                        },
                        rename: function (dest, src) {
                            return dest + '/' + trimVerOrMinSuffix(src);
                        }
                    },
                ],
            },
        },

        // rename files
        rename: {},

        // remove empty directories
        cleanempty: {
            options: {
                force: true,
            },
            release: {
                options: {
                    files: false,
                },
                src: ['<%= pkgdir %>/**/*'],
            },
        },
    });


    //__________________________________________________________________________________________________________________________________________________________________________________________//


    // load plugin(s).
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-cleanempty');

    //__________________________________________________________________________________________________________________________________________________________________________________________//


    // hook task
    grunt.cdp = grunt.createCustomTaskEntry(grunt.cdp, 'core_config', { config: [] });

    // core config task. called as first task.
    grunt.registerTask('core_config', function () {
        grunt.cdp.custom_tasks['core_config'].config.forEach(function (task) {
            grunt.task.run([task]);
        });
        // only at once call.
        grunt.cdp.custom_tasks['core_config'].config = [];
    });


    //__________________________________________________________________________________________________________________________________________________________________________________________//

    // Helper API

    var _version_or_min_suffix_re = /(\-[0-9]+\.[0-9]+\.[A-Za-z0-9_-]+)?(\.min)?(\.[a-zA-Z]+$)/;

    /**
     * check version string. exit.
     * @return 0: doesn't have. 0 < have.
     */
    function hasVersionString(src) {
        var match = src.match(_version_or_min_suffix_re);
        return ( match[1] !== undefined );
    }

    /**
     *  Trim version string and/or min suffix in file name.
     */
    function trimVerOrMinSuffix(src) {
        if (grunt.config.get('module_rename_enable')) {
            return src.replace(_version_or_min_suffix_re, '$3');
        } else {
            return src;
        }
    }


    //__________________________________________________________________________________________________________________________________________________________________________________________//


    // task unit
    grunt.registerTask('package_module_release',    ['copy:module_general', 'copy:module_debug'/* for unversioned files */, 'copy:module_release']);
    grunt.registerTask('package_module_debug',      ['copy:module_general', 'copy:module_debug'                                                  ]);
};

/*
 * dev bed tasks
 */

module.exports = function (grunt) {

    grunt.extendConfig({

        // all work directories cleaning
        clean: {
            // deploy.
            devbed_deploy: {
                files: {
                    src: [
                        '../www/*', '../src/*', '../tests/*', '../dist/**', '../release/**'
                    ],
                },
            },
        },

        // file copy
        copy: {
            // deploy.
            devbed_deploy: {
                files: [
                    {// cdp.plugin.nativebridge js source files.
                        expand: true,
                        cwd: '<%= tmpdir %>/<%= pkgcomp_work_pkg_dir %>/<%= plugins %>/com.sony.cdp.plugin.nativebridge/www',
                        src: ['**'],
                        dest: '../www',
                    },
                    {// cdp.plugin.nativebridge native source files
                        expand: true,
                        cwd: '<%= tmpdir %>/<%= pkgcomp_work_pkg_dir %>/<%= plugins %>/com.sony.cdp.plugin.nativebridge/src',
                        src: ['**'],
                        dest: '../src',
                    },
                    {// cdp.plugin.nativebridge plugin.xml
                        expand: true,
                        cwd: '<%= tmpdir %>/<%= pkgcomp_work_pkg_dir %>/<%= plugins %>/com.sony.cdp.plugin.nativebridge',
                        src: ['plugin.xml'],
                        dest: '../',
                    },
                    {// cdp.plugin.nativebridge.tests
                        expand: true,
                        cwd: '<%= tmpdir %>/<%= pkgcomp_work_pkg_dir %>/<%= plugins %>/com.sony.cdp.plugin.nativebridge.tests',
                        src: ['**/*.xml', '**/*.js', '!**/*.min.js'],
                        dest: '../tests',
                    },
                    {// cdp.nativebridge
                        expand: true,
                        cwd: '<%= tmpdir %>/<%= pkgcomp_work_pkg_dir %>/<%= libraries %>/<%= scripts %>',
                        src: ['**/*.js'],
                        dest: '../dist',
                    },
                    {// cdp.nativebridge
                        expand: true,
                        cwd: '<%= tmpdir %>/<%= pkgcomp_work_pkg_dir %>/<%= libraries %>/include',
                        src: ['**/*.d.ts'],
                        dest: '../dist/include',
                    },
                ],
            },
            devbed_deploy_external: {// TBD
                files: [
                    {// external: jquery
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>/jquery/<%= scripts %>',
                        src: ['jquery-*.js', 'jquery.js'],
                        dest: '../dist/external',
                    },
                    {// external: cdp.promise
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>/sony/cdp/<%= scripts %>',
                        src: ['cdp.promise-*.js', 'cdp.promise.js'],
                        dest: '../dist/external',
                    },
                    {// external: cdp.plugin.nativebridge.d.ts
                        expand: true,
                        cwd: '../www',
                        src: ['cdp.plugin.nativebridge.d.ts'],
                        dest: '../dist/external/include',
                    },
                    {// external: d.ts
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>/include',
                        src: ['jquery.d.ts', 'cdp.promsie.d.ts', 'require.d.ts', 'cordova.d.ts', 'plugins/*.d.ts'],
                        dest: '../dist/external/include',
                    },
                ],
            },
            devbed_release: {
                files: [
                    {// cdp.plugin.nativebridge.
                        expand: true,
                        cwd: '../www',
                        src: ['**'],
                        dest: '../release/plugins/com.sony.cdp.plugin.nativebridge/www',
                    },
                    {// cdp.plugin.nativebridge native source files
                        expand: true,
                        cwd: '../src',
                        src: ['**'],
                        dest: '../release/plugins/com.sony.cdp.plugin.nativebridge/src',
                    },
                    {// cdp.plugin.nativebridge plugin.xml
                        expand: true,
                        cwd: '../',
                        src: ['plugin.xml'],
                        dest: '../release/plugins/com.sony.cdp.plugin.nativebridge',
                    },
                    {// cdp.plugin.nativebridge.tests
                        expand: true,
                        cwd: '../tests',
                        src: ['**'],
                        dest: '../release/plugins/com.sony.cdp.plugin.nativebridge/tests',
                    },
                    {// cdp.nativebridge
                        expand: true,
                        cwd: '../dist',
                        src: ['*.js'],
                        dest: '../release/modules/sony/cdp/scripts',
                    },
                    {// cdp.nativebridge d.ts
                        expand: true,
                        cwd: '../dist/include',
                        src: ['cdp.nativebridge.d.ts'],
                        dest: '../release/modules/include',
                    },
                ],
            },
            devbed_release_external: { // TBD
                files: [
                    {// jquery
                        expand: true,
                        cwd: '../dist/external',
                        src: ['jquery*.js'],
                        dest: '../release/modules/jquery/scripts',
                    },
                    {// cdp.promise
                        expand: true,
                        cwd: '../dist/external',
                        src: ['cdp.promise*.js'],
                        dest: '../release/modules/sony/cdp/scripts',
                    },
                    {// d.ts
                        expand: true,
                        cwd: '../dist/external/include',
                        src: ['**'],
                        dest: '../release/modules/include',
                    },
                ],
            },
        },
    });


    //__________________________________________________________________________________________________________________________________________________________________________________________//


    grunt.registerTask('deploy', [
        'clean:devbed_deploy',
        'module',
        'copy:devbed_deploy', 'copy:devbed_deploy_external',
        'copy:devbed_release', 'copy:devbed_release_external',
        'clean:tmpdir'
    ]);
};

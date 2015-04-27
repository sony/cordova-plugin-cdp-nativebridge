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
                        '../www/*', '../src/*', '../tests/*', '../dist/**'
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
                    {// external: underscore
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>/underscore/<%= scripts %>',
                        src: ['underscore-*.js', 'underscore.js'],
                        dest: '../dist/external',
                    },
                    {// external: cdp.tools
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>/sony/cdp/<%= scripts %>',
                        src: ['cdp.tools-*.js', 'cdp.tools.js'],
                        dest: '../dist/external',
                    },
                    {// external: d.ts
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= modules %>/include',
                        src: ['jquery.d.ts', 'underscore.d.ts', 'cdp.tools.d.ts'],
                        dest: '../dist/include',
                    },
                ],
            },
        },
    });


    //__________________________________________________________________________________________________________________________________________________________________________________________//


    grunt.registerTask('deploy', ['clean:devbed_deploy', 'module', 'copy:devbed_deploy', 'copy:devbed_deploy_external', /*'clean:tmpdir'*/]);
};

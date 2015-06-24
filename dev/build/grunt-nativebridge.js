/*
 * cordova-plugin-cdp-sample and dev bed tasks
 *
 * You can modify for your dev-bed requirement.
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
            // cdvtests
            cdvtests: {
                files: [
                    {// tests resource
                        expand: true,
                        cwd: '<%= orgsrc %>',
                        src: ['cdvtests/**'],
                        dest: '<%= pkgdir %>'
                    },
                ],
            },
            // deploy.
            devbed_deploy: {
                files: [
                    {// cordova-plugin-cdp-sample js source files.
                        expand: true,
                        cwd: '<%= tmpdir %>/<%= pkgcomp_work_pkg_dir %>/<%= plugins %>/com.sony.cdp.plugin.sample/www',
                        src: ['**'],
                        dest: '../www',
                    },
                    {// cordova-plugin-cdp-sample native source files
                        expand: true,
                        cwd: '<%= tmpdir %>/<%= pkgcomp_work_pkg_dir %>/<%= plugins %>/com.sony.cdp.plugin.sample/src',
                        src: ['**'],
                        dest: '../src',
                    },
                    {// cordova-plugin-cdp-sample plugin.xml
                        expand: true,
                        cwd: '<%= tmpdir %>/<%= pkgcomp_work_pkg_dir %>/<%= plugins %>/com.sony.cdp.plugin.sample',
                        src: ['plugin.xml'],
                        dest: '../',
                    },
                    {// cordova-plugin-cdp-sample tests
                        expand: true,
                        cwd: '<%= tmpdir %>/<%= pkgcomp_work_pkg_dir %>/<%= plugins %>/com.sony.cdp.plugin.sample.tests',
                        src: ['**/*.xml', '**/*.js', '!**/*.min.js'],
                        dest: '../tests',
                    },
                ],
            },
            devbed_release: {
                files: [
                    {// cordova-plugin-cdp-sample js source files.
                        expand: true,
                        cwd: '../www',
                        src: ['**'],
                        dest: '../release/plugins/com.sony.cdp.plugin.sample/www',
                    },
                    {// cordova-plugin-cdp-sample native source files
                        expand: true,
                        cwd: '../src',
                        src: ['**'],
                        dest: '../release/plugins/com.sony.cdp.plugin.sample/src',
                    },
                    {//cordova-plugin-cdp-sample plugin.xml
                        expand: true,
                        cwd: '../',
                        src: ['plugin.xml'],
                        dest: '../release/plugins/com.sony.cdp.plugin.sample',
                    },
                    {// cordova-plugin-cdp-sample tests
                        expand: true,
                        cwd: '../tests',
                        src: ['**'],
                        dest: '../release/plugins/com.sony.cdp.plugin.sample/tests',
                    },
                ],
            },
        },
    });


    //__________________________________________________________________________________________________________________________________________________________________________________________//


    // ensure custom task property.
    grunt.cdp = grunt.createCustomTaskEntry(grunt.cdp, 'app_after_package');

    // custom task register.
    grunt.cdp.custom_tasks['app_after_package'].debug.push('copy:cdvtests');
    grunt.cdp.custom_tasks['app_after_package'].release.push('copy:cdvtests');


    //__________________________________________________________________________________________________________________________________________________________________________________________//


    grunt.registerTask('deploy', [
        'clean:devbed_deploy',
        'module',
        'copy:devbed_deploy',
        'copy:devbed_release',
        'clean:tmpdir'
    ]);

    grunt.registerTask('build',     ['clean', 'dev_debug']);
    grunt.registerTask('default',   ['clean', 'dev']);
};

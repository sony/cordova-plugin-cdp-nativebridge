/*
 * dev bed tasks
 */

module.exports = function (grunt) {

    grunt.extendConfig({

        // config variable entries: root
        cdvtests: 'cdvtests',

        clean: {
            dev_plugins: {
                files: [
                    {// app/scripts.
                        expand: true,
                        cwd: '<%= orgsrc %>/<%= plugins %>',
                        src: ['**/*.js', '**/*.map'],
                    },
                ],
            },
        },

        // file copy
        copy: {
            // for cdvtests
            dev_bed: {
                files: [
                    {// test frameworks
                        expand: true,
                        cwd: '<%= orgsrc %>',
                        src: ['<%= cdvtests %>/**'],
                        dest: '<%= pkgdir %>'
                    },
                ]
            },

            // deploy.
            deploy: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= tmpdir %>/<%= plugins %>/com.sony.cdp.plugin.nativebridge',
                        src: ['**'],
                        dest: '../../',
                    },
                ],
            },
        },
    });

    //__________________________________________________________________________________________________________________________________________________________________________________________//

    grunt.cdp = grunt.createCustomTaskEntry(grunt.cdp, 'app_after_package');
    grunt.cdp.custom_tasks['app_after_package'].release.push('copy:dev_bed');
    grunt.cdp.custom_tasks['app_after_package'].debug.push('copy:dev_bed');

    //__________________________________________________________________________________________________________________________________________________________________________________________//

    grunt.registerTask('clean_dev', ['clean:dev_plugins']);
    grunt.registerTask('deploy', ['plugin', 'copy:deploy', 'clean:tmpdir']);
};

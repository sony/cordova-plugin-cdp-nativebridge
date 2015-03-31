/**
    build.typescript.js

    description:

    supporting typescript.

    tasks:

    - "typescript:release" : orgsrc の中身を、tmpdir/scripts/app.js に連結し変換、
    - "typescript:debug" : orgsrc の中身を、そのままその場所で、jsに変換。
*/


module.exports = function (grunt) {

    grunt.extendConfig({

        // config variable: tasks
        typescript_debug_src: ['<%= orgsrc %>/**/*.ts', '!<%= orgsrc %>/<%= modules %>/**/*.ts'],

        // typescript building
        typescript: {
            options: {
                target: 'es5', // or es3
                sourceMap: false,
            },
            release: {
                files: [
                    {// singularly loaded
                        '': ['<%= tmpdir %>/<%= scripts %>/*.ts'],
                    },
                    {// loaded with lazy and concatenated
                        '<%= tmpdir %>/<%= scripts %>/app.js': '<%= app_scripts %>',
                    },
                ],
            },
            debug: {
                options: {
                    comments: true,
                    sourceMap: true,
                },
                files: [
                    {
                        '': '<%= typescript_debug_src %>',
                    },
                ],
            },
        },

        // url string lower task
        update_module_general_ignore_type: {
            build: {},
        },

    });

    // load plugin(s).
    grunt.loadNpmTasks('grunt-typescript');


    //__________________________________________________________________________________________________________________________________________________________________________________________//


    // custom task: Build typescript libraries.
    grunt.registerMultiTask('update_module_general_ignore_type', "Update module general copy task's ignore list.", function () {
        var list = grunt.config.get('module_general_target');
        list.push('!**/*.d.ts');
        grunt.config.set('module_general_target', list);
    });
};

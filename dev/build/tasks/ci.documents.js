/*
 * ci.documents.js
 *
 * build typescript documents task
 */

module.exports = function (grunt) {

    grunt.extendConfig({

        // config variable:
        ci_doc_docdir:      'docs/typedoc',
        ci_doc_ts_targets: '<%= ts_targets %>',
        ci_doc_module:      'amd',
        ci_doc_target:      'es5',

        clean: {
            ci_doc: {
                files: {
                    src: [
                        '<%= ci_doc_docdir %>/*',
                    ],
                },
            },
        },

        // typedoc
        typedoc: {
            ci_doc: {
                options: {
                    module: '<%= ci_doc_module %>',
                    out:    '<%= ci_doc_docdir %>',
                    name:   '<%= pkg.name %>',
                    target: '<%= ci_doc_target %>',
                },
                src: '<%= ci_doc_ts_targets %>',
            },
        },
    });

    //__________________________________________________________________________________________________________________________________________________________________________________________//


    // load plugin(s).
    grunt.loadNpmTasks('grunt-typedoc');


    //__________________________________________________________________________________________________________________________________________________________________________________________//


    grunt.registerTask('ci_doc', [
        'clean:ci_doc',
        'typedoc:ci_doc',
    ]);

};

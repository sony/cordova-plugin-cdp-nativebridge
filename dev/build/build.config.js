/*
 * grunt build config
 *
 */

module.exports = function (grunt) {

    grunt.extendConfig({
        // config variable entries: root
        orgsrc: 'app',
        tmpdir: 'temp',
        pkgdir: 'www',

        // config variable entries: directory
        libraries:      'lib',          // internal-lib modules default directory
        modules:        'modules',     // 3rd module directory
        resources:      'res',          // resource directory
        templates:      'templates',    // html directory
        scripts:        'scripts',      // js/ts/(coffee) directory
        stylesheets:    'stylesheets',  // css/sass/(less) directory

        // config variable typedoc targets
        ci_doc_ts_targets: ['app/lib/scripts/CDP/**/*.ts', 'app/plugins/com.sony.cdp.plugin.nativebridge/www/CDP/**/*.ts'],
        ci_doc_docdir:  '../docs/typedoc',
    });
};

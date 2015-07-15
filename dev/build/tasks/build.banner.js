/*
 * Banner setup utility script
 */

module.exports = function (grunt) {

    var fs = require('fs'),
        path = require('path');

    grunt.extendConfig({
        // internal variable
        banner_info: {
            src: '',
            moduleName: '',
            version: '',
        },
    });


    //__________________________________________________________________________________________________________________________________________________________________________________________//


    // custom task: set banner
    grunt.registerTask('banner_setup', function () {
        var info = grunt.config.get('banner_info');
        grunt.cdp.setupBannar(info.src, info.moduleName, info.version);
    });

    // Helper API
    grunt.cdp = grunt.cdp || {};

    // check 'LICENSE-INFO.txt' existence
    grunt.cdp.hasLicenseInfo = function () {
        return fs.existsSync(path.join(process.cwd(), 'LICENSE-INFO.txt'));
    }

    // setup bannar core function
    grunt.cdp.setupBannar = function (src, moduleName, version) {
        var licenseInfo = path.join(process.cwd(), 'LICENSE-INFO.txt');
        if (fs.existsSync(licenseInfo)) {
            var banner = fs.readFileSync(licenseInfo).toString()
                .replace('@MODULE_NAME', moduleName)
                .replace('@VERSION', version)
                .replace(/\r\n/gm, '\n')    // normalize line feed
            ;
            var script = banner + fs.readFileSync(src).toString();
            fs.writeFileSync(src, script);
            return true;
        } else {
            return false;
        }
    }
};

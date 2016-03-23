/*
 * CDP grunt build script root.
 */
module.exports = function (grunt) {

    var _ = require('lodash');

    // Project configuration.
    var config = {
        pkg: grunt.file.readJSON('package.json'),
    };

    // create "custom_tasks" prop to root object if needed.
    grunt.createCustomTaskEntry = function (root, key, def_tasks) {
        root = root || {};
        root.custom_tasks = root.custom_tasks || {};
        if (!root.custom_tasks[key]) {
            root.custom_tasks[key] = def_tasks || { release: [], debug: [] };
        }
        return root;
    };

    // update config from tasks
    grunt.extendConfig = function (additionalConfig) {
        for (var prop in additionalConfig) {
            if (additionalConfig.hasOwnProperty(prop)) {
                if (config[prop]) {
                    if (typeof config[prop] === 'string') {
                        config[prop] = additionalConfig[prop];
                    } else {
                        config[prop] = _.extend(config[prop], additionalConfig[prop]);
                    }
                } else {
                    var tmpConfig = {};
                    tmpConfig[prop] = additionalConfig[prop];
                    config = _.extend(config, tmpConfig);
                }
            }
        }
    };

    // load cdp build task(s)
    grunt.loadTasks('build/tasks');

    // load project build task(s)
    grunt.loadTasks('build');

    // initialize config
    grunt.initConfig(config);
};

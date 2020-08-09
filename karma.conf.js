// Karma configuration
// Generated on Fri Aug 07 2020 10:16:53 GMT+0800 (GMT+08:00)
const path = require("path");
module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine"],

    // list of files / patterns to load in the browser
    files: ["test/*.spec.js"],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

    preprocessors: {
      // add webpack as preprocessor
      "test/*.spec.js": ["webpack"],
      "test/**/*.spec.js": ["webpack"],
    },
    webpack: {
      // karma watches the test entry points
      // (you don't need to specify the entry option)
      // webpack watches dependencies
      // webpack configuration

      resolve: {
        modules: [path.resolve("./dist"), "node_modules"],
      },
      mode: "development",
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    // https://stackoverflow.com/questions/16897623/how-can-i-get-a-list-of-passing-tests-from-karma-runner-suite
    reporters: ["spec"],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["Chrome_without_security"],
    // you can define custom flags
    customLaunchers: {
      Chrome_without_security: {
        base: "Chrome",
        flags: ["--use-fake-device-for-media-stream"],
      },
    },
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  });
};

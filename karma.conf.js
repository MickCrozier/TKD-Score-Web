// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-06-28 using
// generator-karma 0.8.2

module.exports = function(config) {
  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: './',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    reporters: ['mocha'],

    // list of files / patterns to load in the browser
    files: [

      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/lodash/dist/lodash.compat.js',
      'bower_components/angular-xeditable/dist/js/xeditable.js',
      'bower_components/angular-inflector/dist/angular-inflector.min.js',
      'bower_components/angular-restmod/dist/angular-restmod.min.js',

      'bower_components/angular-ui-select/dist/select.js',
      'bower_components/raf/index.js',
      'bower_components/angular-ui-layout/ui-layout.js',
      'bower_components/jquery-ui/ui/jquery-ui.js',
      'bower_components/angular-ui-date/src/date.js',
      'bower_components/fullcalendar/fullcalendar.js',
      'bower_components/angular-ui-calendar/src/calendar.js',
      'bower_components/eventEmitter/EventEmitter.js',
      'bower_components/angular-ui-grid/ui-grid.js',
      'bower_components/pdfmake/build/pdfmake.js',
      'bower_components/moment/moment.js',
      'bower_components/ng-tags-input/ng-tags-input.min.js',
      'bower_components/angular-rt-popup/dist/angular-rt-popup.js',
      'bower_components/raf/index.js',
      'bower_components/ngDialog/js/ngDialog.js',

      'bower_components/ng-tags-input/ng-tags-input.js',

      'app/core/app.js',
      'app/bsol/CommonModule.js',
      'app/*.js',
      'app/**/*.js',
      'test/mock/*.js',
      'test/spec/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      //'karma-mocha',
      'karma-jasmine',
      'karma-mocha-reporter',
      //'karma-chai-plugins',
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};

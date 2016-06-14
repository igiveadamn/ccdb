module.exports = function (config) {
    config.set({

        basePath: '../',

        files: [
            "bower_components/jquery/dist/jquery.js",
            "bower_components/angular/angular.js",
            "bower_components/angular-route/angular-route.js",
            "bower_components/lodash/lodash.js",
            "bower_components/checklist-model/checklist-model.js",
            "bower_components/ngstorage/ngStorage.js",
            "node_modules/angular-mocks/angular-mocks.js",
            'src/client/**/*.js',
            'test/client/**/*.js',
            'src/client/**/*.html'
        ],

        exclude: [
            'src/client/bower_components/**/*.js'
        ],

        singleRun: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-ng-html2js-preprocessor'
        ],

        preprocessors: {
            'src/client/**/*.html': ['ng-html2js']
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: "src/client/",
            //prependPrefix: "web/path/to/templates/",

            // the name of the Angular module to create
            moduleName: "ices.templates"
        },

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};

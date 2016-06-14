module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        bowercopy: {
            options: {
                srcPrefix: 'bower_components'
            },
            scripts: {
                options: {
                    destPrefix: 'src/client/bower_components'
                },
                // generate these automagically?
                files: {
                    'angular/angular.js': 'angular/angular.js',
                    'angular-route/angular-route.js': 'angular-route/angular-route.js',
                    'angular-animate/angular-animate.js': 'angular-animate/angular-animate.js',
                    'angular-touch/angular-touch.js': 'angular-touch/angular-touch.js',
                    'bootstrap-css/css/bootstrap.css':'bootstrap-css/css/bootstrap.css',
                    'bootstrap-css/js/bootstrap.min.js':'bootstrap-css/js/bootstrap.min.js',
                    'angular-bootstrap/ui-bootstrap-tpls.js':'angular-bootstrap/ui-bootstrap-tpls.js',
                    'checklist-model/checklist-model.js': 'checklist-model/checklist-model.js',
                    'what-input/what-input.js': 'what-input/what-input.js',
                    'moment/moment.js': 'moment/moment.js',
                    'jquery/dist/jquery.js': 'jquery/dist/jquery.js',
                    'lodash/lodash.js': 'lodash/lodash.js',
                    'angular-combine/dist/angular-combine.js': 'angular-combine/dist/angular-combine.js',
                    'ngstorage/ngStorage.js': 'ngstorage/ngStorage.js'
                }
            }
        },

        clean: ['target', 'src/client/bower_components'],

        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', '!src/client/bower_components/**'],
            options: {
                globals: {}
            }
        },

        wiredep: {
            task: {
                src: [
                    'src/client/index.html'
                ],

                ignorePath: '../../',

                options: {}
            }
        },

        includeSource: {
            client: {
                files: {
                    'src/client/index.html': 'src/client/index.html'
                }
            }
        },

        copy: {
            apps: {
                files: [
                    {
                        src: ['src/**/*', '!src/**/*.html', 'src/client/*.html'],
                        dest: 'target/'
                    }
                ]
            }
        },

        open: {
            local: {
                path: 'http://localhost:8080/index.html'
            }
        },

        watch: {
            options: {
                livereload: true
            },
            files: {
                files: ['src/**/*.js', 'src/**/*.html', 'src/client/app.css', '!src/client/index.html', 'test/**/*.spec.js'],
                tasks: ['deploy']
            }
        },

        nodemon: {
            dev: {
                script: 'target/src/server/server.js',
                options: {
                    args: [],
                    env: {
                        POSTMARK_API_TOKEN: 'be96d532-a26f-4ac9-bdbc-055467d26ed8',
                        ICES_SERVER: 'http://localhost/'
                    },
                    ext: 'js',
                    nodeArgs: ['--debug'],
                    delayTime: 1,
                    cwd: __dirname
                }
            }
        },

        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },

        angularCombine: {
            options: {
                includeComments: false
            },
            combine: {
                files: [{
                    cwd: 'src/client',
                    src: ['**/*.html', '!index.html', '!all.html', '!bower_components/**/*.html'],
                    dest: 'src/client/all.html'
                }]
            }
        },

        karma: {
            unit: {
                configFile: 'test/karma.conf.js'
            }
        }
    });

    // load tasks
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-angular-combine');
    grunt.loadNpmTasks('grunt-karma');

    // tasks
    grunt.registerTask('deploy', ['jshint', 'wiredep', 'includeSource', 'angularCombine', 'copy:apps']);
    grunt.registerTask('dev', ['deploy', 'concurrent', 'open:local']);

    grunt.registerTask('cleanup', ['clean', 'bowercopy', 'dev']);
    grunt.registerTask('default', ['clean', 'dev']);

    grunt.registerTask('heroku:production', 'clean', 'bowercopy', 'deploy');
};

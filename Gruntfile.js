module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
            },
            dist: {
                src: ['src/js/*.js'],
                dest: 'build/js/main.js',
            },
        },
        compass: {
            dist: {
                options: {
                    config: 'config.rb',
                    bundleExec: true
                }
            }
        },
        watch: {
            options: {
                //livereload: true
            },
            css: {
                files: 'src/sass/*.scss',
                tasks: ['compass']
            },
            js: {
                files: 'src/js/*.js',
                tasks: ['concat']
            }
        },
        jsdoc: {
            dist: {
                src: ['js/Asciizer.js'],
                options: {
                    destination: 'docs/'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('doc', ['jsdoc']);

};

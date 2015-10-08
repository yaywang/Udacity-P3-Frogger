/*
 After you have changed the settings at "Your code goes here",
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/



module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    responsive_images: {
      figures: {
        options: {
          engine: 'im',
          sizes: [{
            name: 'small',
            width: '500px',
          },{
            name: 'medium',
            width: '1000px'
          },{
            name: 'large',
            width: '1850px'
          }]
        },

        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'images_src/',
          dest: 'images/'
        }]
      },
      logo: {
        options: {
          engine: 'im',
          sizes: [{
            name: 'small',
            width: '55px'
          },{
            name: 'normal',
            width: '85px'
          }]
        },

        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'images_src/logo',
          dest: 'images/logo'
        }]
      },
      jumbo: {
        options: {
          engine: 'im',
          sizes: [{
            name: 'small',
            width: '400px'
          },{
            name: 'medium',
            width: '768px'
          },{
            name: 'large',
            width: '1280px'
          }]
        },

        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'images_src/jumbo',
          dest: 'images/jumbo'
        }]

      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['images','images/logo','images/jumbo']
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['images', 'images/logo','images/jumbo']
        },
      },
    },

    /* Copy the "fixed" images that don't go through processing into the images/directory */
    copy: {
      dev: {
        files: [{
          expand: true,
          src: 'images_src/fixed/*.{gif,jpg,png}',
          dest: 'images/'
        }]
      },
    },

    /* JS linter */
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
        ignores: ['js/jQuery.js']
      },
      src: {
        src: '*.js'
      }
    },

    /* CSS linter */
    csslint: {
      src: {
        src: 'css/*.css'
      }
    },

    /* HTML inspector */
    'html-inspector': {
      all: {
        src: '*.html'
      }
    },

    /* watch for all ths changes */
    watch: {
      scripts:{
        files: ['**/*.{gif,jpg,png}'],
        tasks: ['copy','responsive_images'],
        options: {
          spawn: false,
        },
      }
    },
  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-html-inspector');
  grunt.registerTask('images', ['clean', 'mkdir', 'copy', 'responsive_images']);
  grunt.registerTask('lint', ['jshint', 'csslint', 'html-inspector']);
};
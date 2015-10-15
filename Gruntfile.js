/*
 After you have changed the settings at "Your code goes here",
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function(grunt) {

  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [{
            /*
            Change these:
            */
            /* width:"400px",
            */
            height: '230px',
            quality: 60

          }],
          //?sample: true,
          rename: false
        },

        /*
        You don't need to change this part if you don't change
        the directory structure.
        */
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'images_src/',
          dest: 'images/'
        }]
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['images'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['images']
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
        ignores: ['js/jQuery.js', 'js/modernizr.js' ,'js/html-inspector.js']
      },
      src: {
        src: 'js/*.js'
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
  grunt.registerTask('lint', ['jshint', 'csslint', 'html-inspector'])
};
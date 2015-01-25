module.exports = function(grunt) {

  grunt.initConfig({

    browserify: {
      src: {
        src: 'test/src/source-entry.js',
        dest: 'test/src/source-output.js'
      }
    },

    jasmine: {
      main: {
        src: 'test/src/source-output.js',
        options: {
          specs: 'test/specs/main-spec.js'
        }
      }
    },

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', ['browserify', 'jasmine']);

};

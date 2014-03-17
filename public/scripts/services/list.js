'use strict';

angular.module('graphEsApp')

  .factory('List', [function() {
    return {
      getPattern: function(pattern) {
        return pattern.substring(pattern.indexOf('{') + 1, pattern.lastIndexOf('}'));
      },

    };
  }]);

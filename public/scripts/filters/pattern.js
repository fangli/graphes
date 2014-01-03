'use strict';

angular.module('graphEsApp')

  .filter('pattern', function(escapeHTML){
    return function(input) {
      return escapeHTML(input.substring(0, input.indexOf('{'))) + '<span class="label label-info">' + escapeHTML(input.substring(input.indexOf('{') + 1, input.lastIndexOf('}'))) + '</span>' + escapeHTML(input.substring(input.lastIndexOf('}') + 1));
    };
  });

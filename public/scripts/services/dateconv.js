'use strict';

angular.module('graphEsApp')

  .factory('DateConv', function() {
    return {
      strtotime: function(str) {
        var dt;
        dt = Date.create(str);
        if (dt > 0) {
          return dt;
        } else {
          dt = Date.create(str, 'zh-CN');
          return dt;
        }
      },
    };
  });

'use strict';

angular.module('graphEsApp')

  .factory('List', ['$http', function($http) {
    var baseUrl = '/api/list/';
    return {
      get: function(name) {
        return $http.get(baseUrl + name);
      },
      query: function() {
        return $http.get(baseUrl);
      },
      save: function(list){
        return $http.post(baseUrl, list);
      },
      remove: function(name) {
        return $http.delete(baseUrl + name);
      },

      getPattern: function(pattern) {
        return pattern.substring(pattern.indexOf('{') + 1, pattern.lastIndexOf('}'));
      },

    };
  }]);

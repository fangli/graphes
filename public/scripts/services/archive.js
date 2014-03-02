'use strict';

angular.module('graphEsApp')

  .factory('Archive', ['$http', function($http) {
    var baseUrl = '/api/archive/';
    return {
      get: function(name) {
        return $http.get(baseUrl + name);
      },
      save: function(archive){
        return $http.post(baseUrl, archive);
      },
      remove: function(name) {
        return $http.delete(baseUrl + name);
      },

    };
  }]);

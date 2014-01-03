'use strict';

angular.module('graphEsApp')

  .factory('Profile', ['$http', function($http) {
    var baseUrl = '/api/profile/';
    return {
      get: function(name) {
        return $http.get(baseUrl + name);
      },
      query: function() {
        return $http.get(baseUrl);
      },
      save: function(profile){
        return $http.post(baseUrl, profile);
      },
      remove: function(name) {
        return $http.delete(baseUrl + name);
      }
    };
  }]);

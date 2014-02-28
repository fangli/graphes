'use strict';

angular.module('graphEsApp')

  .factory('Snapshot', ['$http', function($http) {
    var baseUrl = '/api/snapshot/';
    return {
      get: function(name) {
        return $http.get(baseUrl + name);
      },
      save: function(snapshot){
        return $http.post(baseUrl, snapshot);
      },
      remove: function(name) {
        return $http.delete(baseUrl + name);
      },

    };
  }]);

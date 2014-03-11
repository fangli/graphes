'use strict';

angular.module('graphEsApp')

  .factory('Dashboard', ['$http', '$rootScope', function($http, $rootScope) {
    var baseUrl = '/api/dashboard/';
    return {

      get: function(id) {
        if (id) {
          return $http.get(baseUrl + id);
        } else {
          return $http.get(baseUrl + id, {ignoreLoadingBar: true});
        }
      },

      save: function(id, body){
        var promise = $http.post(baseUrl + id, body);
        promise.then(function(){
          $rootScope.$broadcast('refreshDashboardList', true);
        });
        return promise;
      },

      remove: function(id) {
        var promise = $http.delete(baseUrl + id);
        promise.then(function(){
          $rootScope.$broadcast('refreshDashboardList', true);
        });
        return promise;
      },
    };
  }]);

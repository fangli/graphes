'use strict';

angular.module('graphEsApp')

  .factory('Lstorage', function(localStorageService) {
    return {
      put: function(k, v) {
        var ret = localStorageService.set('GraphES-' + k, v);
        return ret;
      },
      get: function(k) {
        var ret = localStorageService.get('GraphES-' + k);
        return (ret)?ret:[];
      }
    };
  });

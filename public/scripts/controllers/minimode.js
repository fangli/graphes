'use strict';

angular.module('graphEsApp')

  .controller('MiniModeCtrl', function($scope, $location) {
    if (($location.search().mini === '1') || ($location.search().mini === 'true')) {
      $scope.isMiniMode = true;
    } else {
      $scope.isMiniMode = false;
    }
  }
);

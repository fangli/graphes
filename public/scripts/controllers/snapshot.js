'use strict';

angular.module('graphEsApp')

  .controller('SnapshotCtrl', function($rootScope, $location, $routeParams, $scope, Head, Snapshot) {
    Head.setTitle('Snapshots');

    $scope.snapshotId = $routeParams.snapshotId;
    $scope.isLoading = false;
    $scope.chartData = {};

    if ($scope.snapshotId) {
      $scope.isLoading = true;
      Snapshot.get($scope.snapshotId)
        .success(function(data){
          data.AbsCreated = Date.create(data.created).toString();
          data.relativeCreated = Date.create(data.created).relative();
          $scope.chartData = data;
        $scope.isLoading = false;
        })
        .error(function() {
          $scope.isLoading = false;
          window.alert('Could not get the charts snapshot');
        });
    }

    $scope.$watch('snapshotId', function() {
      if ($scope.snapshotId) {
        $location.path('/snapshot/' + $scope.snapshotId);
      } else {
        $location.path('/snapshot/');
      }
    });

    $scope.editInConsole = function() {
      $rootScope.currentConsole = angular.copy($scope.chartData.settings);
      $location.path('/console');
    };

    $scope.editInWorkbench = function () {
      $rootScope.currentWorkbench = angular.copy($scope.chartData.settings);
      $location.path('/workbench');
    };

  }
);

'use strict';

angular.module('graphEsApp')

  .controller('ArchiveCtrl', function($rootScope, $location, $routeParams, $scope, Head, Archive) {
    Head.setTitle('Archives');

    $scope.archiveId = $routeParams.archiveId;
    $scope.isLoading = false;
    $scope.chartData = {};

    if ($scope.archiveId) {
      $scope.isLoading = true;
      Archive.get($scope.archiveId)
        .success(function(data){
          data.AbsCreated = Date.create(data.created).toString();
          data.relativeCreated = Date.create(data.created).relative();
          $scope.chartData = data;
        $scope.isLoading = false;
        })
        .error(function() {
          $scope.isLoading = false;
          window.alert('Could not get the charts archive');
        });
    }

    $scope.$watch('archiveId', function() {
      if ($scope.archiveId) {
        $location.path('/archive/' + $scope.archiveId);
      } else {
        $location.path('/archive/');
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

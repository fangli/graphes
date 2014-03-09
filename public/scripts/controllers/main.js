'use strict';

angular.module('graphEsApp')

  .controller('MainCtrl', function ($scope, $location, Head, Schema, Dashboard, Setfocus) {


    $scope.config = {'schemas': [], 'dashboards': []};
    $scope.Head = Head;

    $scope.isActive = function (viewLocation) {
      return $location.path().startsWith(viewLocation);
    };

    $scope.setDashboardFilterFocus = function() {
      $scope.refreshDashboardList();
      new Setfocus('menuDashboardFilter');
    };

    $scope.setSchemaFilterFocus = function() {
      $scope.refreshSchemaList();
      new Setfocus('menuSchemaFilter');
    };

    $scope.refreshSchemaList = function() {
      $scope.config.isSchemasRefreshing = true;
      Schema.get('')
        .success(function(data) {
          $scope.config.isSchemasRefreshing = false;
          $scope.config.schemas = data;
        })
        .error(function() {
          $scope.config.isSchemasRefreshing = false;
          window.alert('Err: Unable to get configurations from GraphES server, please reload the page and try again!');
        });
    };

    $scope.refreshDashboardList = function() {
      $scope.config.isDashboardsRefreshing = true;
      Dashboard.get('')
        .success(function(data) {
          $scope.config.dashboards = data;
          $scope.config.isDashboardsRefreshing = false;
        })
        .error(function() {
          $scope.config.isDashboardsRefreshing = false;
          window.alert('Err: Unable to get dashboards list from GraphES server, please reload the page and try again!');
        });
    };

    $scope.$on('refreshSchemaList', function(){
      $scope.refreshSchemaList();
    });
    $scope.refreshSchemaList();


    $scope.$on('refreshDashboardList', function(){
      $scope.refreshDashboardList();
    });
    $scope.refreshDashboardList();


  });


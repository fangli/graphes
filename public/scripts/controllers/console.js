'use strict';

angular.module('graphEsApp')

  .controller('ConsoleCtrl', function($rootScope, $scope, $location, Head, Graph) {
    Head.setTitle('Console');

    $scope.status = {};
    $scope.status.isLoading = false;
    $scope.status.jsonNotValid = false;
    $scope.status.loadingPercent = '';
    $scope.status.chartCounts = 0;
    $scope.isControlPanelHidden = false;
    $scope.charts = [];
    $scope.settings = {};

    if ($rootScope.currentConsole) {
      $scope.rawSettings = angular.toJson($rootScope.currentConsole, true);
      $rootScope.currentConsole = null;
    } else {
      $scope.rawSettings = angular.toJson($rootScope.config.currentProfile, true);
    }

    $scope.addChart = function(series) {
      var graphConfig = {
        // title: series.name,
        title: '',
        yaxisTitle: $scope.settings.def.model.query,
        series: series,
        graphType: $scope.settings.def.visualization.type,
        stacking: $scope.settings.def.visualization.stacking,
      };
      $scope.charts.push(Graph.parseGraphConfig(graphConfig));
      if ($scope.charts.length === $scope.status.chartCounts) {
        $scope.status.loadingPercent = '';
        $scope.status.isLoading = false;
      } else {
        $scope.status.loadingPercent = '(' + $scope.charts.length + '/' + $scope.status.chartCounts + ')';
      }
      console.log(Graph.parseGraphConfig(graphConfig));
    };

    $scope.getValidQueries = function(settings) {
      var queries;
      try {
        queries = Graph.preParse(settings);
        return queries;
      }catch(e) {
        window.alert('Error: Invalid query json, we are unable to format your request.');
        return null;
      }
    };

    $scope.showGraph = function() {
      var queries = $scope.getValidQueries($scope.settings);
      if (queries) {
        $scope.status.isLoading = true;
        $scope.status.chartCounts = queries.charts.length;
        $scope.status.loadingPercent = '(0/' + $scope.status.chartCounts + ')';
        $scope.isControlPanelHidden = true;
        $scope.charts = [];
        Graph.get(queries, $scope.settings, $scope.addChart);
      }
    };

    $scope.editInWorkbench = function () {
      var queries = $scope.getValidQueries($scope.settings);
      if (queries) {
        $rootScope.currentWorkbench = angular.copy($scope.settings);
        $location.path('/workbench');
      }
    };

    $scope.$watch('rawSettings', function() {
      try {
        var settings = JSON.parse($scope.rawSettings);
        $scope.settings = settings;
        $scope.status.jsonNotValid = false;
      } catch(e) {
        $scope.status.jsonNotValid = true;
      }
    });

  }
);

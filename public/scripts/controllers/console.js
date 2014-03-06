'use strict';

angular.module('graphEsApp')

  .controller('ConsoleCtrl', function($rootScope, $scope, $location, Head, Graph, Archive, DateConv) {
    Head.setTitle('Console');

    $scope.status = {};
    $scope.status.isLoading = false;
    $scope.status.archiveSaved = false;
    $scope.status.jsonNotValid = false;
    $scope.status.loadingPercent = '';
    $scope.status.chartCounts = 0;
    $scope.archive = {};
    $scope.isControlPanelHidden = false;
    $scope.charts = {total: 0, loaded: 0, data: {}};
    $scope.settings = {};

    if ($rootScope.currentConsole) {
      $scope.rawSettings = angular.toJson($rootScope.currentConsole, true);
      $rootScope.currentConsole = null;
    } else {
      $scope.rawSettings = angular.toJson($rootScope.config.currentProfile, true);
    }

    $scope.addChart = function(series, index) {
      var graphConfig = {
        title: '',
        yaxisTitle: $scope.settings.def.model.query,
        series: series,
        graphType: $scope.settings.def.visualization.type,
        stacking: $scope.settings.def.visualization.stacking,
      };
      $scope.charts.data[index] = Graph.parseGraphConfig(graphConfig);
      $scope.charts.loaded += 1;
      if ($scope.charts.loaded === $scope.charts.total) {
        $scope.status.loadingPercent = '';
        $scope.status.isLoading = false;
      } else {
        $scope.status.loadingPercent = '(' + $scope.charts.loaded + '/' + $scope.charts.total + ')';
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
        $scope.generateArchiveName();
        $scope.status.isLoading = true;
        $scope.charts = {total: queries.length, loaded: 0, data: {}};
        $scope.status.loadingPercent = '(0/' + $scope.charts.total + ')';
        $scope.isControlPanelHidden = true;
        for (var i = queries.length - 1; i >= 0; i--) {
          Graph.getOne(queries[i], $scope.addChart, i);
        };
      }
    };

    $scope.editInWorkbench = function () {
      var queries = $scope.getValidQueries($scope.settings);
      if (queries) {
        $rootScope.currentWorkbench = angular.copy($scope.settings);
        $location.path('/workbench');
      }
    };

    $scope.generateArchiveName = function() {
      $scope.archive.name = 'Query ' + $scope.settings.def.model.query + ' generated at ' + DateConv.strtotime('now');
      $scope.archive.settings = angular.copy($scope.settings);
      $scope.archive.created = new Date().getTime();
      $scope.status.archiveSaved = false;
    };

    $scope.saveAsArchive = function() {
      $scope.archive.charts = $scope.charts;
      Archive.save($scope.archive)
        .success(function(data) {
          $scope.status.archiveSaved = true;
          $scope.status.archiveUrl = '/archive/' + data._id;
        })
        .error(function() {
          window.alert('Could not save the charts archive, try again!');
        });
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

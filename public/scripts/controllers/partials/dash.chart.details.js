'use strict';

angular.module('graphEsApp')

  .controller('DashDetailsCtrl', function($scope, $modalInstance, Graph, chart) {
    $scope.chart = chart;

    $scope.chartData = angular.copy(Graph.defaultChart);

    $scope.close = function(){
      $modalInstance.close();
    };

    $scope.bindChart = function(series, chart) {

      if (!series) {
        $scope.chartData = angular.copy(Graph.nodataChart);
        return;
      }

      var graphConfig = {
        title: '',
        yaxisTitle: chart.chartQuery.mainQuery,
        series: series,
        graphType: chart.chartQuery.graphType,
        stacking: chart.chartQuery.stacking,
      };
      $scope.chartData = Graph.parseGraphConfig(graphConfig);
    };

    $scope.refreshChart = function() {
      $scope.chartData.loading = true;
      var query = Graph.injectTimetoBasicQueries(angular.copy(chart.chartQuery));
      Graph.getOne(query, $scope.bindChart, chart);
    };

    $scope.refreshChart();

  });

'use strict';

angular.module('graphEsApp')

  .controller('EmbeddedChartCtrl', function($scope, $location, Graph, Head) {
    Head.setTitle('Chart');

    $scope.chartData = angular.copy(Graph.defaultChart);

    $scope.showingMiniSettings = false;

    $scope.getParams = function() {
      var params = $location.search();
      var series = {};
      for (var k in params) {
        if (k.indexOf('series.') === 0){
          if (typeof(params[k]) === 'string') {
            series[k.substring(7)] = [params[k]];
          } else {
            series[k.substring(7)] = params[k];
          }
        }
      }
      var req = {};
      req.mini = (params.mini === '1' || params.mini === 'true')?true:false;
      req.title = params.title || '';
      req.yaxis = params.yaxis || '';
      req.index_pattern = params.index_pattern || '';
      req.time_field = params.time_field || '@timestamp';
      req.value_field = params.value_field || '_value';
      req.interval = params.interval || '5m';
      req.from = params.from || (+new Date()-86400000);
      req.to = params.to || (+new Date());
      req.style_type = params.style_type || 'area';
      req.style_value = params.style_value || 'mean';
      req.style_stacking = params.style_stacking || '';
      req.series = series;

      if ((series == {}) || (req.index_pattern === '')) {
        return null;
      } else {
        return req;
      }
    };

    $scope.bindChart = function(series) {
      if (!series) {
        $scope.chartData = angular.copy(Graph.nodataChart);
        return;
      }
      var graphConfig = {
        title: $scope.req.title,
        yaxisTitle: $scope.req.yaxis,
        series: series,
        graphType: $scope.req.style_type,
        stacking: $scope.req.style_stacking,
      };
      $scope.chartData = Graph.parseGraphConfig(graphConfig);
    };

    $scope.refreshChart = function() {
      $scope.showingMiniSettings = false;
      $scope.chartData.loading = true;
      Graph.simpleGet($scope.req, $scope.bindChart);
    };

    $scope.init = function() {
      $scope.req = $scope.getParams();

      if ($scope.req) {
        $scope.refreshChart();
      } else {
        $scope.chartData = angular.copy(Graph.nodataChart);
      }
    };

    $scope.init();

  }
);

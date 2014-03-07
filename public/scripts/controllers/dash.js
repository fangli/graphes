'use strict';

angular.module('graphEsApp')

  .controller('DashCtrl', function($scope, $timeout, Head, Graph) {
    Head.setTitle('Dashboard');

    $scope.defaultChart = {'data': {options: {credits: {enabled: false, }, exporting: {enabled: false, }, }, title: {text: ''}, loading: true, }};

    $scope.isEditing = 0;

    $scope.dashSettings = {boxes: []};

    $scope.flushChartSize = function() {
        $timeout(function() {
            window.dispatchEvent(new Event('resize'));
        }, 1);
    }

    $scope.bindChart = function(series, chart) {

      var graphConfig = {
        title: '',
        yaxisTitle: chart.chartQuery.mainQuery,
        series: series,
        graphType: chart.chartQuery.graphType,
        stacking: chart.chartQuery.stacking,
      };

      console.log(graphConfig);

      chart.chartData = {
        data: Graph.parseGraphConfig(graphConfig, true),
        series: series,
        chart: chart,
      };
    };

    $scope.loadSingle = function(chart) {
      var query = Graph.injectTimetoBasicQueries(angular.copy(chart.chartQuery));
      Graph.getOne(query, $scope.bindChart, chart);
    }

    $scope.saveSourceAndRefresh = function(group, index) {
        $timeout(function(){
            group.charts[index].isShowingSource = false;
            group.charts[index].chartData = angular.copy($scope.defaultChart);
            $scope.loadSingle(group.charts[index]);
        }, 5);
    }

    $scope.loadGroupData = function (group) {
        for (var i = group.charts.length - 1; i >= 0; i--) {
            if (group.charts[i].chartData === null) {
                group.charts[i].chartData = angular.copy($scope.defaultChart);
                $scope.loadSingle(group.charts[i]);
            } else {

            }
        };
    };

    $scope.addGroup = function(box) {
        if (box.newGroup.name) {
            box.groups.push(angular.copy(box.newGroup));
            box.newGroup = {charts: [], chartWidth: '3', chartHeight: 120};
        }
    };

    $scope.addChart = function(group) {
        if (group.newChart.name) {
            group.newChart.chartQuery = angular.fromJson(group.newChart.chartQuery);
            group.newChart.chartData = angular.copy($scope.defaultChart);
            var chartIndex = group.charts.push(angular.copy(group.newChart)) - 1;
            $scope.loadSingle(group.charts[chartIndex]);
            group.newChart = {name: '', chartData: null, style: 'default', description: ''};
        }
    };

    $scope.addBox = function() {
        if ($scope.dashSettings.newBox.name) {
            $scope.dashSettings.boxes.push(angular.copy($scope.dashSettings.newBox));
            $scope.dashSettings.newBox = {name: '', description: '', style: 'default', groups:[]};
        }
    };

    $scope.deleteBox = function(index) {
        $scope.dashSettings.boxes.splice(index, 1);
    }

    $scope.deleteGroup = function(box, index) {
        box.groups.splice(index, 1);
    }

    $scope.deleteChart = function(group, index) {
        group.charts.splice(index, 1);
    }

    $scope.toggleSource = function(group, index) {
        group.charts[index].isShowingSource = !group.charts[index].isShowingSource;
        if (!group.charts[index].isShowingSource) {
            $scope.saveSourceAndRefresh(group, index);
        }
        $scope.flushChartSize();
    }

    $scope.activeTab = function(group) {
        $scope.flushChartSize();
        $scope.loadGroupData(group);
    };

    $scope.$watch('isEditing', function() {
        $scope.flushChartSize();
    });

  }
);

'use strict';

angular.module('graphEsApp')

  .controller('DashCtrl', function($route, $location, $routeParams, $scope, $timeout, Head, Graph, Dashboard) {
    Head.setTitle('Dashboard');

    $scope.colorScheme = {
      'default': 'Default',
      'success': 'Green',
      'info': 'Blue',
      'warning': 'Yellow',
      'danger': 'Red',
    };

    $scope.rowWidthScheme = {
      '2': '1/6 screen',
      '3': '1/4 screen',
      '4': '1/3 screen',
      '6': '1/2 screen',
      '12': 'Full screen',
    };

    $scope.isEditing = false;
    $scope.dashSettings = {name: '',description: '',boxes: [],global: false};
    $scope.defaultChart = {options: {credits: {enabled: false, }, exporting: {enabled: false, }, }, title: {text: ''}, loading: true, };

    $scope.getDashSettings = function() {
      Dashboard.get($scope.config.currentId)
        .success(function(data){
          $scope.dashSettings = data;
          $scope.config.isSettingsLoading = false;
        })
        .error(function(error) {
          window.alert(error);
        });
    };

    $scope.restoreSettings = function() {
      if ($routeParams.id) {
        $location.path('/dash/id/' + $routeParams.id);
        $route.reload();
      } else {
        $location.path('/dash');
        $route.reload();
      }
    };

    $scope.changeToEditingMode = function() {
      $scope.dashSettings.$$$newBox = {name: '', description: '', style: 'default', groups:[]};
      $scope.isEditing = true;
    };

    $scope.saveCurrentSettings = function() {
      if ($scope.config.isCreating) {
        Dashboard.save('', $scope.dashSettings)
          .success(function(data){
            $location.path('/dash/id/' + data._id);
          })
          .error(function(e){
            window.alert(e);
          });
      } else {
        Dashboard.save($scope.config.currentId, $scope.dashSettings)
          .success(function(){
            $scope.isEditing = false;
          })
          .error(function(e){
            window.alert(e);
          });
      }
    };

    $scope.duplicateCurrentSettings = function() {
      if (!$scope.config.isCreating) {
        var newDashboard = angular.copy($scope.dashSettings);
        newDashboard.name = newDashboard.name + ' (Duplicated)';
        Dashboard.save('', newDashboard)
          .success(function(data){
            $location.path('/dash/id/' + data._id);
          })
          .error(function(e){
            window.alert(e);
          });
      } else {
        window.alert('You can not duplicate the fresh new dashboard. To duplicate a dashboard, you should save it first.');
      }
    };

    $scope.deleteDashboard = function() {
      if (!$scope.config.isCreating) {
        Dashboard.remove($scope.config.currentId)
          .success(function(){
            $location.path('/dash');
          })
          .error(function(e) {
            window.alert(e);
          });
      }
    };

    $scope.flushChartSize = function() {
      $timeout(function() {
        window.dispatchEvent(new window.Event('resize'));
      }, 1);
    };

    $scope.bindChart = function(series, chart) {

      var graphConfig = {
        title: '',
        yaxisTitle: chart.chartQuery.mainQuery,
        series: series,
        graphType: chart.chartQuery.graphType,
        stacking: chart.chartQuery.stacking,
      };

      chart.$$$chartData = Graph.parseGraphConfig(graphConfig, chart.miniMode);
    };

    $scope.loadSingle = function(chart) {
      var query = Graph.injectTimetoBasicQueries(angular.copy(chart.chartQuery));
      Graph.getOne(query, $scope.bindChart, chart);
    };

    $scope.saveSourceAndRefresh = function(group, index) {
      $timeout(function(){
        group.charts[index].$$$isShowingSource = false;
        group.charts[index].$$$chartData = angular.copy($scope.defaultChart);
        $scope.loadSingle(group.charts[index]);
      }, 5);
    };

    $scope.loadGroupData = function (group) {
      for (var i = group.charts.length - 1; i >= 0; i--) {
        if (!group.charts[i].$$$chartData) {
          group.charts[i].$$$chartData = angular.copy($scope.defaultChart);
          $scope.loadSingle(group.charts[i]);
        } else {

        }
      }
    };

    $scope.addGroup = function(box) {
      if (box.$$$newGroup.name) {
        box.groups.push(angular.copy(box.$$$newGroup));
        box.$$$newGroup = {charts: [], chartWidth: '3', chartHeight: 120};
      }
    };

    $scope.addChart = function(group) {

      try {
        Graph.injectTimetoBasicQueries(angular.copy(group.$$$newChart.chartQuery));
      } catch(e) {
        window.alert('Your chart query is invalid, please check it and try again!');
        return false;
      }

      group.$$$newChart.$$$chartData = angular.copy($scope.defaultChart);
      var chartIndex = group.charts.push(angular.copy(group.$$$newChart)) - 1;
      $scope.loadSingle(group.charts[chartIndex]);
      group.$$$newChart = {name: '', $$$chartData: null, style: 'default', description: '', chartQuery: {}, miniMode: true,};
    };

    $scope.addBox = function() {
      if ($scope.dashSettings.$$$newBox.name) {
        $scope.dashSettings.boxes.push(angular.copy($scope.dashSettings.$$$newBox));
        $scope.dashSettings.$$$newBox = {name: '', description: '', style: 'default', groups:[]};
      }
    };

    $scope.deleteBox = function(index) {
      $scope.dashSettings.boxes.splice(index, 1);
    };

    $scope.deleteGroup = function(box, index) {
      box.groups.splice(index, 1);
    };

    $scope.deleteChart = function(group, index) {
      group.charts.splice(index, 1);
    };

    $scope.toggleSource = function(group, index) {
      group.charts[index].$$$isShowingSource = !group.charts[index].$$$isShowingSource;
      if (!group.charts[index].$$$isShowingSource) {
        $scope.saveSourceAndRefresh(group, index);
      }
      $scope.flushChartSize();
    };

    $scope.activeTab = function(group) {
      $scope.flushChartSize();
      $scope.loadGroupData(group);
    };

    $scope.deactiveTab = function() {
    };

    $scope.$watch('isEditing', function() {
      $scope.flushChartSize();
    });

    // App bootstrap
    $scope.config = {};
    if ($routeParams.id){
      $scope.config.currentId = $routeParams.id;
      $scope.config.isCreating = false;
      $scope.config.isSettingsLoading = true;
      $scope.getDashSettings();
    } else {
      $scope.config.isSettingsLoading = false;
      $scope.config.isCreating = true;
    }

    if (($location.path() === '/dash/new') || ($location.path().endsWith('/edit'))) {
      $scope.changeToEditingMode();
    }

  }
);

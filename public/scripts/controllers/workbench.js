'use strict';

angular.module('graphEsApp')

  .controller('WorkbenchCtrl', function($rootScope, $scope, $timeout, Head, List, DateConv, Graph) {
    Head.setTitle('Workbench');

    $scope.status = {};
    $scope.status.isLoading = false;
    $scope.status.loadingPercent = '';
    $scope.status.chartCounts = 0;
    $scope.status.periodTimerStart = null;
    $scope.status.periodTimerEnd = null;
    $scope.status.isShowTimerStart = false;
    $scope.status.isShowTimerEnd = false;
    $scope.status.invalidPagePeriodStart = false;
    $scope.status.invalidPagePeriodEnd = false;

    $scope._tmpDimensions = {};

    $scope.settings = angular.copy($rootScope.config.currentProfile.def);
    $scope.settings.model.dimensions = [];

    $scope.charts = [];

    $scope.addTags = function (dimension) {
      if (dimension.tmpNew) {
        dimension.lists[dimension.tmpNew] = true;
      }
      dimension.tmpNew = '';
    };

    $scope.toggleDimension = function(name) {
      $scope._tmpDimensions[name] = !$scope._tmpDimensions[name];
      if ($scope._tmpDimensions[name]) {
        // Enable dimension
        var dimension = angular.getInList('name', name, $rootScope.config.currentProfile.dimensions);
        List.get(List.getPattern(dimension.pattern))
          .success(function(lists){
            if ($scope._tmpDimensions[name]) {
              $scope.settings.model.dimensions.push(dimension);
              $scope.settings.model.dimensions[angular.posInList('name', name, $scope.settings.model.dimensions)].lists = {};
              $scope.settings.model.dimensions[angular.posInList('name', name, $scope.settings.model.dimensions)].enableGroup = false;
              $scope.settings.model.dimensions[angular.posInList('name', name, $scope.settings.model.dimensions)].tmpNew = '';
              angular.forEach(lists.list, function(l){
                $scope.settings.model.dimensions[angular.posInList('name', name, $scope.settings.model.dimensions)].lists[l] = false;
              });
            }
          })
          .error(function(){
            window.alert('Could not get the list of filtering pattern!');
          });
      } else {
        // Disable dimension
        angular.removeInList('name', name, $scope.settings.model.dimensions);
      }
    };

    $scope.toggleOne = function(dimension, name, ena) {
      dimension.lists[name] = !ena;
    };

    $scope.toggleAll = function(lists, switcher) {
      if (switcher === undefined) {
        angular.forEach(lists, function(v, k){
          lists[k] = !v;
        });
      } else {
        angular.forEach(lists, function(v, k){
          lists[k] = switcher;
        });
      }
    };

    $scope.toggleGroup = function(dimension) {
      var v = dimension.enableGroup;
      for (var i = $scope.settings.model.dimensions.length - 1; i >= 0; i--) {
        $scope.settings.model.dimensions[i].enableGroup = false;
      }
      if (!v) {
        dimension.enableGroup = true;
      } else {
        dimension.enableGroup = false;
      }
    };

    $scope.fastFill = function(start, end) {
      if (start) {
        $scope.settings.period.start = start;
      }
      if (end) {
        $scope.settings.period.end = end;
      }
    };

    $scope.flashTimePeriodNotice = function (period) {
      if (period === 'start') {
        $scope.status.isShowTimerStart = true;
        $timeout.cancel($scope.status.periodTimerStart);
        $scope.status.periodTimerStart = $timeout(function() {
          $scope.status.isShowTimerStart = false;
        }, 3000);
      } else {
        $scope.status.isShowTimerEnd = true;
        $timeout.cancel($scope.status.periodTimerEnd);
        $scope.status.periodTimerEnd = $timeout(function() {
          $scope.status.isShowTimerEnd = false;
        }, 3000);
      }
    };

    $scope.$watch('settings.period.start', function() {
      if (DateConv.strtotime($scope.settings.period.start) > 0) {
        $scope.status.invalidPagePeriodStart = false;
        $scope.settingsPeriodStart = DateConv.strtotime($scope.settings.period.start);
        $scope.flashTimePeriodNotice('start');
      } else {
        $scope.status.invalidPagePeriodStart = true;
      }
    });

    $scope.$watch('settings.period.end', function() {
      if (DateConv.strtotime($scope.settings.period.end) > 0) {
        $scope.status.invalidPagePeriodEnd = false;
        $scope.settingsPeriodEnd = DateConv.strtotime($scope.settings.period.end);
        $scope.flashTimePeriodNotice('end');
      } else {
        $scope.status.invalidPagePeriodEnd = true;
      }
    });

    $scope.$watch('settings.period.offset', function() {
      if ([-86400, -604800, -2592000].indexOf($scope.settings.period.offset) === -1) {
        $scope.settings.period.userDefined = true;
      } else {
        $scope.settings.period.userDefined = false;
      }
    });

    $scope.$watch('settings.visualization.type', function(){
      if ($scope.settings.visualization.type === 'range') {
        $scope.settings.visualization.chartValueDisabled = true;
      } else {
        $scope.settings.visualization.chartValueDisabled = false;
      }
    });

    $scope.addChart = function(series) {
      var graphConfig = {
        // title: series.name,
        title: '',
        yaxisTitle: $scope.settings.model.query,
        series: series,
        graphType: $scope.settings.visualization.type,
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

    $scope.showGraph = function() {
      var queries = Graph.preParse($scope.settings, $rootScope.config.currentProfile);
      $scope.status.isLoading = true;
      $scope.status.chartCounts = queries.charts.length;
      $scope.status.loadingPercent = '(0/' + $scope.status.chartCounts + ')';
      $scope.charts = [];
      Graph.get(queries, $scope.settings, $scope.addChart);
    };

  });

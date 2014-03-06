'use strict';

angular.module('graphEsApp')

  .controller('WorkbenchCtrl', function($rootScope, $scope, $timeout, $location, Head, List, DateConv, Graph, Archive) {
    Head.setTitle('Workbench');

    $scope.status = {};
    $scope.status.isLoading = false;
    $scope.status.archiveSaved = false;
    $scope.status.loadingPercent = '';
    $scope.status.periodTimerStart = null;
    $scope.status.periodTimerEnd = null;
    $scope.status.isShowTimerStart = false;
    $scope.status.isShowTimerEnd = false;
    $scope.status.invalidPagePeriodStart = false;
    $scope.status.invalidPagePeriodEnd = false;
    $scope.isControlPanelHidden = false;
    $scope.archive = {};
    $scope.charts = {total: 0, loaded: 0, data: {}};

    // $scope._tmpDimensions = {};

    if ($rootScope.currentWorkbench) {
      $scope.settings = angular.copy($rootScope.currentWorkbench);
      $rootScope.currentWorkbench = null;
    } else {
      $scope.settings = angular.copy($rootScope.config.currentProfile);
    }


    $scope.addTags = function (dimension) {
      if (dimension.tmpNew) {
        var split = dimension.tmpNew.split('|');
        for (var i = split.length - 1; i >= 0; i--) {
          if (split[i].trim()) {
            dimension.lists[split[i].trim()] = true;
          }
        }
      }
      dimension.tmpNew = '';
    };

    $scope.toggleDimension = function(dimension) {
      dimension.enabled = !dimension.enabled;
      if (dimension.enabled) {
        // Enable dimension
        List.get(List.getPattern(dimension.pattern))
          .success(function(lists){
            if (dimension.enabled) {
              dimension.lists = {};
              dimension.enableGroup = false;
              dimension.tmpNew = '';
              angular.forEach(lists.list, function(l){
                dimension.lists[l] = false;
              });
            }
          })
          .error(function(){
            window.alert('Could not get the list of filtering pattern!');
          });
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
      for (var i = $scope.settings.def.model.dimensions.length - 1; i >= 0; i--) {
        $scope.settings.def.model.dimensions[i].enableGroup = false;
      }
      if (!v) {
        dimension.enableGroup = true;
      } else {
        dimension.enableGroup = false;
      }
    };

    $scope.fastFill = function(start, end) {
      if (start) {
        $scope.settings.def.period.start = start;
      }
      if (end) {
        $scope.settings.def.period.end = end;
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

    $scope.editInConsole = function() {
      $rootScope.currentConsole = angular.copy($scope.settings);
      $location.path('/console');
    };

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

    $scope.showGraph = function() {
      var queries = Graph.preParse($scope.settings);
      $scope.generateArchiveName();
      $scope.status.isLoading = true;
      $scope.charts = {total: queries.length, loaded: 0, data: {}};
      $scope.status.loadingPercent = '(0/' + $scope.charts.total + ')';
      $scope.isControlPanelHidden = true;
      for (var i = queries.length - 1; i >= 0; i--) {
        Graph.getOne(queries[i], $scope.addChart, i);
      };
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


    $scope.$watch('settings.def.period.start', function() {
      if (DateConv.strtotime($scope.settings.def.period.start) > 0) {
        $scope.status.invalidPagePeriodStart = false;
        $scope.settingsPeriodStart = DateConv.strtotime($scope.settings.def.period.start);
        $scope.flashTimePeriodNotice('start');
      } else {
        $scope.status.invalidPagePeriodStart = true;
      }
    });

    $scope.$watch('settings.def.period.end', function() {
      if (DateConv.strtotime($scope.settings.def.period.end) > 0) {
        $scope.status.invalidPagePeriodEnd = false;
        $scope.settingsPeriodEnd = DateConv.strtotime($scope.settings.def.period.end);
        $scope.flashTimePeriodNotice('end');
      } else {
        $scope.status.invalidPagePeriodEnd = true;
      }
    });

    $scope.$watch('settings.def.period.offset', function() {
      if ([-86400, -604800, -2592000].indexOf($scope.settings.def.period.offset) === -1) {
        $scope.settings.def.period.userDefined = true;
      } else {
        $scope.settings.def.period.userDefined = false;
      }
    });

    $scope.$watch('settings.def.visualization.type', function(){
      if ($scope.settings.def.visualization.type === 'range') {
        $scope.settings.def.visualization.chartValueDisabled = true;
      } else {
        $scope.settings.def.visualization.chartValueDisabled = false;
      }
    });

  });

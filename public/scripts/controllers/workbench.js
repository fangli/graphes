'use strict';

angular.module('graphEsApp')

  .controller('WorkbenchCtrl', function($scope, $timeout, $location, $routeParams, $modal, Head, List, DateConv, Graph, Archive, Schema) {
    Head.setTitle('Workbench');

    $scope.loadDefaultSchema = function(id, callback) {
      Schema.get(id)
        .success(function(data) {
          $scope.settings = data;
          if (callback) {
            callback();
          }
        })
        .error(function(e) {
          window.alert(e);
        });
    };

    $scope.getDimensionValueList = function(dimension) {
      var ret = [];
      for (var singleDimension in dimension.lists) {
        ret.push(singleDimension);
      };
      return ret;
    };

    $scope.loadArchiveSchema = function(id, callback) {
      Archive.get(id)
        .success(function(data) {
          $scope.settings = data.settings;
          if (callback) {
            callback();
          }
        })
        .error(function(e) {
          window.alert(e);
        });
    };

    $scope.addTags = function (dimension) {
      if (dimension.tmpNew) {
        var split = dimension.tmpNew.split('|');
        for (var i = split.length - 1; i >= 0; i--) {
          var target = split[i].trim();
          if (target) {

            if (target.indexOf('*') === -1) {
              dimension.lists[target] = true;
            } else {
              for (var j in dimension.lists) {
                var match = j.match(angular.glob2regex(target));
                if (match && (match[0] === j)) {
                  dimension.lists[j] = true;
                }
              }
            }

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

    $scope.addChart = function(series, info, params) {

      if (!params) {
        params = {};
      } else {
        info.query.graphType = params.graphType || info.query.graphType;
        info.query.stacking = (typeof(params.stacking) === 'string')? params.stacking : info.query.stacking;
      }

      var graphConfig;
      var chartData;

      if (series) {
        graphConfig = {
          title: '',
          yaxisTitle: info.query.mainQuery,
          series: series,
          graphType: info.query.graphType,
          stacking: info.query.stacking,
        };
        chartData = Graph.parseGraphConfig(graphConfig);
      } else {
        chartData = angular.copy(Graph.nodataChart);
      }

      $scope.charts.data[angular.formatInt(info.id)] = {
        chartData: chartData,
        queryString: angular.toJson(info.query, true),
        $$$series: series,
        info: info,
      };

      $scope.charts.$$$loaded += 1;
      if ($scope.charts.$$$loaded >= $scope.charts.$$$total) {
        $scope.status.loadingPercent = '';
        $scope.status.isLoading = false;
      } else {
        $scope.status.loadingPercent = '(' + $scope.charts.$$$loaded + '/' + $scope.charts.$$$total + ')';
      }
    };

    $scope.showGraph = function() {
      var query;
      var oriQueries = Graph.getBasicQueries($scope.settings);
      $scope.generateArchiveName();
      $scope.status.isLoading = true;
      $scope.charts = {$$$total: oriQueries.length, $$$loaded: 0, data: {}};
      $scope.status.loadingPercent = '(0/' + $scope.charts.$$$total + ')';
      $scope.status.isControlPanelHidden = true;
      for (var i = oriQueries.length - 1; i >= 0; i--) {
        query = Graph.injectTimetoBasicQueries(angular.copy(oriQueries[i]));
        Graph.getOne(query, $scope.addChart, {'id': i, query: oriQueries[i]});
      }
    };

    $scope.refreshOne = function(id, oriQuery) {
      var query = Graph.injectTimetoBasicQueries(angular.copy(oriQuery));
      $scope.charts.data[angular.formatInt(id)].chartData.loading = true;
      Graph.getOne(query, $scope.addChart, {'id': id, query: oriQuery});
    };

    $scope.refreshAll = function() {
      for (var id in $scope.charts.data) {
        $scope.refreshOne(id, $scope.charts.data[id].info.query);
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
      
      var modalInstance = $modal.open({
        templateUrl: 'views/partials/workbench.archive.save.html',
        controller: 'ArchiveSaveCtrl',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          data: function () {
            return angular.copy($scope.archive);
          },
        }
      });

      modalInstance.result.then(function (url) {
        if (url) {
          $scope.status.archiveSaved = true;
          $scope.status.archiveUrl = url;
        }
      });

    };

    $scope.initialWatching = function() {
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
      $scope.status.isPageLoading = false;
    };

    // Initializing
    $scope.status = {
      isPageLoading: true,
      isLoading: false,
      archiveSaved: false,
      loadingPercent: '',
      periodTimerStart: null,
      periodTimerEnd: null,
      isShowTimerStart: false,
      isShowTimerEnd: false,
      invalidPagePeriodStart: false,
      invalidPagePeriodEnd: false,
      isControlPanelHidden: false,
    };

    $scope.archive = {};
    $scope.charts = {$$$total: 0, $$$loaded: 0, data: {}};

    // Routes processing
    if ($routeParams.id) {
      $scope.loadDefaultSchema($routeParams.id, $scope.initialWatching);
    } else if ($routeParams.archive) {
      $scope.loadArchiveSchema($routeParams.archive, $scope.initialWatching);
    }
  
  });

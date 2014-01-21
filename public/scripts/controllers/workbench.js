'use strict';

angular.module('graphEsApp')

  .controller('WorkbenchCtrl', function($rootScope, $scope, $timeout, Head, List, DateConv) {
    Head.setTitle('Workbench');

    $scope.status = {};
    $scope.status.graphCount = 0;
    $scope.status.periodTimerStart = null;
    $scope.status.periodTimerEnd = null;
    $scope.status.isShowTimerStart = false;
    $scope.status.isShowTimerEnd = false;
    $scope.status.invalidPagePeriodStart = false;
    $scope.status.invalidPagePeriodEnd = false;

    $scope._tmpDimensions = {};

    $scope.page = {
      model: {
        dimensions: [],
        query: '',
      },
      period: {
        start: '1 hour ago',
        end: 'now',
        compare: false,
        offsetBy: 0,
        offset: -86400,
        userDefined: false,
      },
      visualization: {
      }
    };

    $scope.recalculateGraphCount = function() {
      var totalCount = 1;
      for (var i = $scope.page.model.dimensions.length - 1; i >= 0; i--) {
        var cnt = 0;
        for (var name in $scope.page.model.dimensions[i].lists) {
          if ($scope.page.model.dimensions[i].lists[name] === true) {
            cnt += 1;
          }
        }
        totalCount = totalCount * cnt;
      }
      $scope.status.graphCount = totalCount;
    };

    $scope.toggleDimension = function(name) {
      $scope._tmpDimensions[name] = !$scope._tmpDimensions[name];
      if ($scope._tmpDimensions[name]) {
        // Enable dimension
        var dimension = angular.getInList('name', name, $rootScope.config.currentProfile.dimensions);
        List.get(List.getPattern(dimension.pattern))
          .success(function(lists){
            if ($scope._tmpDimensions[name]) {
              $scope.page.model.dimensions.push(dimension);
              $scope.page.model.dimensions[angular.posInList('name', name, $scope.page.model.dimensions)].lists = {};
              angular.forEach(lists.list, function(l){
                $scope.page.model.dimensions[angular.posInList('name', name, $scope.page.model.dimensions)].lists[l] = false;
              });
            }
          })
          .error(function(){
            window.alert('Could not get the list of filtering pattern!');
          });
      } else {
        // Disable dimension
        angular.removeInList('name', name, $scope.page.model.dimensions);
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

    $scope.fastFill = function(start, end) {
      if (start) {
        $scope.page.period.start = start;
      }
      if (end) {
        $scope.page.period.end = end;
      }
    };

    $scope.flashTimePeriodNotice = function (period) {
      if (period === "start") {
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

    $scope.$watch('page.period.start', function() {
      if (DateConv.strtotime($scope.page.period.start) > 0) {
        $scope.status.invalidPagePeriodStart = false;
        $scope.pagePeriodStart = DateConv.strtotime($scope.page.period.start);
        $scope.flashTimePeriodNotice('start');
      } else {
        $scope.status.invalidPagePeriodStart = true;
      }
    });

    $scope.$watch('page.period.end', function() {
      if (DateConv.strtotime($scope.page.period.end) > 0) {
        $scope.status.invalidPagePeriodEnd = false;
        $scope.pagePeriodEnd = DateConv.strtotime($scope.page.period.end);
        $scope.flashTimePeriodNotice('end');
      } else {
        $scope.status.invalidPagePeriodEnd = true;
      }
    });

    $scope.$watch('page.model.dimensions', function(){
      $scope.recalculateGraphCount();
    }, true);

    $scope.$watch('page.period.offset', function() {
      if ([-86400, -604800, -2592000].indexOf($scope.page.period.offset) === -1) {
        $scope.page.period.userDefined = true;
      } else {
        $scope.page.period.userDefined = false;
      }
    });

  });

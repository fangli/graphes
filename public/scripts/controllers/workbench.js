'use strict';

angular.module('graphEsApp')

  .controller('WorkbenchCtrl', function($rootScope, $scope, Head, List) {
    Head.setTitle('Workbench');

    $scope._tmpDimensions = {};

    $scope.page = {
      model: {
        dimensions: [],
        query: '',
      },
      period: {
        start: 'now-1h',
        end: 'now',
        compare: 0,
      },
      visualization: {
      }
    };

    $scope.$watch('_tmpDimensions', function() {
      angular.forEach($scope._tmpDimensions, function(v, name){
        if (v) {
          if (!angular.isInList('name', name, $scope.page.model.dimensions)) {
            var dimension = angular.getInList('name', name, $rootScope.config.currentProfile.dimensions);
            List.get(List.getPattern(dimension.pattern))
              .success(function(lists){
                $scope.page.model.dimensions.push(dimension);
                $scope.page.model.dimensions[angular.posInList('name', name, $scope.page.model.dimensions)].lists = {};
                angular.forEach(lists.list, function(l){
                  $scope.page.model.dimensions[angular.posInList('name', name, $scope.page.model.dimensions)].lists[l] = false;
                });
              })
              .error(function(){
                window.alert('Could not get the list of filtering pattern!');
              });
          }
        } else {
          //remove
          angular.removeInList('name', name, $scope.page.model.dimensions);
        }
      });
    }, true);

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

  });

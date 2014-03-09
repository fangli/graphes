'use strict';

angular.module('graphEsApp')

  .controller('DashlistCtrl', function($scope, Head, Dashboard, Lstorage) {
    Head.setTitle('Dashboards Manager');

    $scope.refreshDashboardList = function() {
      $scope.isLoading = true;
      Dashboard.get('')
        .success(function(data) {
          $scope.dashboards = data;
          $scope.isLoading = false;
        })
        .error(function() {
          $scope.isLoading = false;
          window.alert('Err: Unable to get dashboards list from GraphES server, please reload the page and try again!');
        });
    };

    $scope.refreshFavList = function() {
      $scope.favList = Lstorage.get('favList');
    };

    $scope.deleteDashboard = function(id) {
      Dashboard.remove(id)
        .success(function(){
          $scope.dashboards.splice(id, 1);
        })
        .error(function(e) {
          window.alert(e);
        });
    };

    $scope.toggleFav = function(id) {
      var currentList = Lstorage.get('favList');

      var _addList = [];
      for (var i = 0; i < currentList.length; i++) {
        if (angular.isInList('_id', currentList[i], $scope.dashboards)) {
          _addList.push(currentList[i]);
        }
      }

      if (_addList.indexOf(id) === -1) {
        _addList.push(id);
      } else {
        _addList.splice(_addList.indexOf(id), 1);
      }

      Lstorage.put('favList', _addList);
      $scope.refreshFavList();

    };
    

    $scope.refreshFavList();
    $scope.refreshDashboardList();

  }
);

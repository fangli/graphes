'use strict';

angular.module('graphEsApp')

  .controller('MainCtrl', function ($route, $cookies, $scope, $location, Head, $rootScope, Profile, Dashboard, Setfocus) {

    $scope.strProfile = 'Loading...';
    $scope.dashboardFilter = '';

    $rootScope.config = {'profiles': [], 'currentProfile': {}};

    $scope.isActive = function (viewLocation) {
      return $location.path().startsWith(viewLocation);
    };

    $scope.Head = Head;

    $scope.menus = [
      {'title': 'Workbench', 'href': '/workbench'},
      {'title': 'Archives', 'href': '/archive'},
    ];

    $scope.setProfile = function(name) {
      $cookies.currentProfileName = name;
      $rootScope.config.currentProfile = angular.getInList('name', name, $rootScope.config.profiles);

      if ($location.path() === '/workbench') {
        $route.reload();
      }
    };

    $scope.setFilterFocus = function() {
      Setfocus('menuDashboardFilter');
    };

    $scope.refreshProfileList = function() {
      Profile.query()
        .success(function(data) {
          $scope.strProfile = 'Profile';
          $rootScope.config.profiles = data;
          if (angular.isInList('name', $cookies.currentProfileName, data)) {
            $rootScope.config.currentProfile = angular.getInList('name', $cookies.currentProfileName, $rootScope.config.profiles);
          }
          if ($location.path() === '/workbench') {
            $route.reload();
          }
        })
        .error(function() {
          window.alert('Err: Unable to get configurations from GraphES server, please reload the page and try again!');
        });
      };

    $scope.refreshDashboardList = function() {
      $rootScope.config.isDashboardsRefreshing = true;
      Dashboard.get('')
        .success(function(data) {
          $rootScope.config.dashboards = data;
          $rootScope.config.isDashboardsRefreshing = false;
        })
        .error(function() {
          $rootScope.config.isDashboardsRefreshing = false;
          window.alert('Err: Unable to get dashboards list from GraphES server, please reload the page and try again!');
        });
    };

    $scope.$on('refreshDashboardList', function(){
      $scope.refreshDashboardList();
    });

    $scope.refreshProfileList();
    $scope.refreshDashboardList();

  });


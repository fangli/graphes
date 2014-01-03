'use strict';

angular.module('graphEsApp')

  .controller('MainCtrl', function ($route, $cookies, $scope, $location, Head, $rootScope, Profile) {

    $scope.strProfile = 'Loading...';

    $rootScope.config = {'profiles': [], 'currentProfile': {}};

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.Head = Head;

    $scope.menus = [
      {'title': 'Home', 'href': '/'},
      {'title': 'Workbench', 'href': '/workbench'},
      {'title': 'Dash', 'href': '/dash'},
      {'title': 'Shell', 'href': '/shell'},
    ];

    Profile.query()
      .success(function(data) {
        $scope.strProfile = 'Profile';
        $rootScope.config.profiles = data;
        if (angular.isInList('name', $cookies.currentProfileName, data)) {
          $rootScope.config.currentProfile = angular.getInList('name', $cookies.currentProfileName, $rootScope.config.profiles);
        }
      })
      .error(function() {
        window.alert('Err: Unable to get configurations from GraphES server, please reload the page and try again!');
      });

    $scope.setProfile = function(name) {
      $cookies.currentProfileName = name;
      $rootScope.config.currentProfile = angular.getInList('name', name, $rootScope.config.profiles);

      if ($location.path() === '/workbench') {
        $route.reload();
      }

    };

  });


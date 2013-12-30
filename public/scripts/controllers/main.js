'use strict';

angular.module('graphEsApp')

  .controller('MainCtrl', function ($cookies, $http, $scope, $location, Head, $rootScope) {

    $scope.strProfile = "Loading...";

    $rootScope.config = {'profiles': {}, 'currentProfile': {}};

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

    $http.get('/api/db/profiles')
      .success(function(data) {
        $scope.strProfile = "Profile";
        $rootScope.config.profiles = data;
        if (data[$cookies.currentProfile] !== undefined) {
          $rootScope.config.currentProfile = $rootScope.config.profiles[$cookies.currentProfile];
        };
      })
      .error(function(data) {
        alert('Error: Unable to get profiles');
      });

    $scope.setProfile = function(name) {
      $cookies.currentProfile = name;
      $rootScope.config.currentProfile = $rootScope.config.profiles[name];
    }    

  });


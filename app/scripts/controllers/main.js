'use strict';

angular.module('GraphES')

  .controller('MainCtrl', function ($scope, $location, Head) {

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.Head = Head;

    $scope.menus = [
      {'title': 'Home', 'href': '/'},
      {'title': 'Dash', 'href': '/dash'},
      {'title': 'Workbench', 'href': '/workbench'},
      {'title': 'Profile', 'href': '/profile'},
      {'title': 'Shell', 'href': '/shell'},
    ];

  });


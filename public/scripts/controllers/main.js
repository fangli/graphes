'use strict';

angular.module('graphEsApp')

  .controller('MainCtrl', function ($scope, $location, Head) {

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.Head = Head;

    $scope.menus = [
      {'title': 'Home', 'href': '/'},
      {'title': 'Profiles', 'href': '/profile'},
      {'title': 'Workbench', 'href': '/workbench'},
      {'title': 'Dash', 'href': '/dash'},
      {'title': 'Shell', 'href': '/shell'},
    ];

  });


'use strict';

angular.module('graphEsApp')

  .controller('ProfileCtrl', function($scope, Head) {
    Head.setTitle('Profiles');
    $scope.currentProfile = {
      name: 'test',
      indices: {pattern: '[ops-]YY-MM-DD'},
      fragments: [
        ''
      ]
    };
  }
);

'use strict';

angular.module('graphEsApp')

  .controller('WorkbenchCtrl', function($scope, Head) {
    Head.setTitle('Workbench');

    $scope.toggleChecked = {};

  }
);

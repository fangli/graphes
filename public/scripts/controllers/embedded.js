'use strict';

angular.module('graphEsApp')

  .controller('EmbeddedCtrl', function($scope, $location, Head) {
    Head.setTitle('Embedded');

    $scope.baseLink = $scope.archiveUrl = $location.protocol() + '://' + $location.host() + ((($location.port() === 80) || ($location.port() === 443))?'':(':' + $location.port()));

    $scope.iframeContent = ['<iframe src="' + $scope.baseLink + '/embedded/chart/?', '&k1=v1&k2=v2" width="500" height="300" frameBorder="0">Browser not compatible.</iframe>'];

  }
);

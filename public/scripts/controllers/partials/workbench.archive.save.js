'use strict';

angular.module('graphEsApp')

  .controller('ArchiveSaveCtrl', function($scope, $modalInstance, $location, Archive, Setfocus, data) {

    $scope.loadingStatus = 'loading';

    $scope.close = function(){
      $modalInstance.close($scope.archiveUrl);
    };

    $scope.saveArchive = function() {
      $scope.loadingStatus = 'loading';
      Archive.save(data)
        .success(function(result) {
          $scope.loadingStatus = 'ok';
          $scope.archiveId = result._id;
          $scope.archiveUrl = $location.protocol() + '://' + $location.host() + ((($location.port() === 80) || ($location.port() === 443))?'':(':' + $location.port()))  + '/archive/' + result._id;
          new Setfocus('archiveUrlInput');
        })
        .error(function(e) {
          $scope.errMsg = e;
          $scope.loadingStatus = 'error';
        });
    };

    $scope.saveArchive();

  });

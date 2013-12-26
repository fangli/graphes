'use strict';

angular.module('graphEsApp')

  .controller('ProfileCtrl', function($scope, Head, $http) {
    Head.setTitle('Profiles');

    $scope.profiles = {};

    $http.get('/api/db/profiles')
      .success(function(data) {
        $scope.profiles = data;
      })
      .error(function(data) {
        alert('We got an error');
      });

    

    $scope.showCurrent = function(name) {
      $scope.currentProfile = angular.copy($scope.profiles[name]);
      $scope.showingCurrent = true;
    };

    $scope.cancelCurrent = function() {
      $scope.currentProfile.showing = false;
      $scope.showingCurrent = false;
    };

    $scope.newCurrent = function() {
      $scope.currentProfile = {};
      $scope.showingCurrent = true;
    };

    $scope.removeSelect = function(name) {
      $http.delete('/api/db/profiles', {data: {name: name}})
        .success(function() {
          delete $scope.profiles[name];
        })
        .error(function() {
          alert('We got an error');
        });
    };

  }
);

'use strict';

angular.module('graphEsApp')

  .controller('ProfileCtrl', function($scope, Head, $http) {
    Head.setTitle('Profiles');

    $scope.loadProfiles = function() {
      $scope.profiles = {};
      $scope.isLoading = true;
      $http.get('/api/db/profiles')
        .success(function(data) {
          $scope.profiles = data;
          $scope.isLoading = false;
          // For test
          // $scope.showCurrent("farm");
        })
        .error(function(data) {
          $scope.isLoading = false;
          alert('We got an error');
        });
    };

    $scope.removeDimension = function (index) {
      $scope.currentProfile.dimensions.splice(index, 1);
    };

    $scope.addNewDimension = function () {
      $scope.currentProfile.dimensions.push({name:'', pattern:[]});
    };

    $scope.showCurrent = function(name) {
      $scope.currentProfile = angular.copy($scope.profiles[name]);
      $scope.showingCurrent = true;
    };

    $scope.cancelCurrent = function() {
      $scope.currentProfile.showing = false;
      $scope.showingCurrent = false;
    };

    $scope.newCurrent = function() {
      $scope.currentProfile = {
        name: '',
        description: '',
        pattern: '',
        dimensions: [],
      };
      $scope.showingCurrent = true;
    };

    $scope.saveCurrentProfile = function() {
      $http.post('/api/db/profiles', $scope.currentProfile)
        .success(function(data) {
          $scope.profiles[$scope.currentProfile['name']] = angular.copy($scope.currentProfile);
          $scope.cancelCurrent();
        })
        .error(function(){
          alert("We are unable to submit your request.");
        });
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


    $scope.loadProfiles();

  }
);

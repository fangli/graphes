'use strict';

angular.module('graphEsApp')

  .controller('ProfileCtrl', function($scope, Head, $http, $rootScope) {
    Head.setTitle('Profiles');

    $scope.removeDimension = function (index) {
      $scope.currentProfile.dimensions.splice(index, 1);
    };

    $scope.addNewDimension = function () {
      $scope.currentProfile.dimensions.push({name:'', pattern:[]});
    };

    $scope.showCurrent = function(name) {
      $scope.currentProfile = angular.copy($rootScope.config.profiles[name]);
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

    $scope.fixCurrentProfileConfig = function() {
      if ($rootScope.config.profiles[$rootScope.config.currentProfile.name] !== undefined) {
        $rootScope.config.currentProfile = $rootScope.config.profiles[$rootScope.config.currentProfile.name];
      } else {
        $rootScope.config.currentProfile = {};
      }
    };

    $scope.saveCurrentProfile = function() {
      $http.post('/api/db/profiles', $scope.currentProfile)
        .success(function(data) {
          $rootScope.config.profiles[$scope.currentProfile.name] = angular.copy($scope.currentProfile);
          $scope.fixCurrentProfileConfig();
          $scope.cancelCurrent();
        })
        .error(function(){
          alert("We are unable to submit your request.");
        });
    };

    $scope.removeSelect = function(name) {
      $http.delete('/api/db/profiles', {data: {name: name}})
        .success(function() {
          delete $rootScope.config.profiles[name];
          $scope.fixCurrentProfileConfig();
        })
        .error(function() {
          alert('We got an error');
        });
    };

    $scope.reloadProfiles = function() {
      $rootScope.config.profiles = {};
      $scope.isLoading = true;
      $http.get('/api/db/profiles')
        .success(function(data) {
          $scope.isLoading = false;
          $rootScope.config.profiles = data;
          $scope.fixCurrentProfileConfig();
        })
        .error(function(data) {
          $scope.isLoading = false;
          alert('Error: Unable to get profiles');
        });
    };

  }
);

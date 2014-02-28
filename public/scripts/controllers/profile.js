'use strict';

angular.module('graphEsApp')

  .controller('ProfileCtrl', function($scope, $rootScope, Head, Profile) {
    Head.setTitle('Profiles');

    $scope.currentProfile = {};

    $scope.isNew = function() {
      if (angular.isInList('name', $scope.currentProfile.name, $rootScope.config.profiles)) {
        return false;
      } else {
        return true;
      }
    };

    $scope.removeDimension = function (index) {
      $scope.currentProfile.def.model.dimensions.splice(index, 1);
    };

    $scope.addNewDimension = function () {
      $scope.currentProfile.def.model.dimensions.push({name:'', pattern:[]});
    };

    $scope.showCurrent = function(index) {
      $scope.currentProfile = angular.copy($rootScope.config.profiles[index]);
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
        def: {
          model: {
            query: '*',
            dimensions: [],
          },
          period: {
            start: '1 day ago',
            end: 'now',
            compare: false,
            offset: -86400,
            userDefined: false,
          },
          visualization: {
            type: 'area',
            chartValue: 'mean',
            chartValueDisabled: false,
            valueField: '_value',
            stacking: "",
            timeField: '@timestamp',
            pointIntervalOpt: 'interval',
            pointInterval: '2m',
            pointPoints: '100',
          }
        }
      };
      $scope.showingCurrent = true;
    };

    $scope.fixCurrentProfileConfig = function() {
      if (angular.isInList('name', $rootScope.config.currentProfile.name, $rootScope.config.profiles)) {
        $rootScope.config.currentProfile = angular.getInList('name', $rootScope.config.currentProfile.name, $rootScope.config.profiles);
      } else {
        $rootScope.config.currentProfile = {};
      }
    };

    $scope.saveCurrentProfile = function() {
      Profile.save($scope.currentProfile)
        .success(function() {
          if (angular.isInList('name', $scope.currentProfile.name, $rootScope.config.profiles)) {
            $rootScope.config.profiles[angular.posInList('name', $scope.currentProfile.name, $rootScope.config.profiles)] = angular.copy($scope.currentProfile);
          } else {
            $rootScope.config.profiles.push(angular.copy($scope.currentProfile));
          }
          $scope.fixCurrentProfileConfig();
          $scope.cancelCurrent();
        })
        .error(function(){
          window.alert('We are unable to submit your request.');
        });
    };

    $scope.removeSelect = function(index) {
      Profile.remove($rootScope.config.profiles[index].name)
        .success(function() {
          $rootScope.config.profiles.splice(index, 1);
          $scope.fixCurrentProfileConfig();
        })
        .error(function() {
          window.alert('We got an error');
        });
    };

    $scope.reloadProfiles = function() {
      $rootScope.config.profiles = {};
      $scope.isLoading = true;

      Profile.query()
        .success(function(data) {
          $scope.isLoading = false;
          $rootScope.config.profiles = data;
          $scope.fixCurrentProfileConfig();
        })
        .error(function() {
          $scope.isLoading = false;
          window.alert('Error: Unable to reload the profiles, please reload the page and try again!');
        });
    };


  });

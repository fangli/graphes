'use strict';

angular.module('graphEsApp')

  .controller('SchemaCtrl', function($location, $route, $scope, Head, Schema) {
    Head.setTitle('Schemas');

    $scope.schemas = [];
    $scope.currentSchema = {};

    $scope.reloadSchemas = function() {
      $scope.schemas = {};
      $scope.isLoading = true;

      Schema.get('')
        .success(function(data) {
          $scope.isLoading = false;
          $scope.schemas = data;
        })
        .error(function() {
          $scope.isLoading = false;
          window.alert('Error: Unable to reload the schemas, please reload the page and try again!');
        });
    };

    $scope.removeDimension = function (index) {
      $scope.currentSchema.def.model.dimensions.splice(index, 1);
    };

    $scope.addNewDimension = function () {
      $scope.currentSchema.def.model.dimensions.push({name:'', pattern:[]});
    };

    $scope.showCurrent = function(index) {
      $scope.currentSchema = angular.copy($scope.schemas[index]);
      $scope.showingCurrent = true;
    };

    $scope.cancelCurrent = function() {
      $scope.showingCurrent = false;
    };

    $scope.madeCurrentDuplicate = function() {
      $scope.currentSchema._id = '';
      $scope.currentSchema.name = $scope.currentSchema.name + '(Duplicated)';
    };

    $scope.newCurrent = function() {
      $scope.currentSchema = {
        _id: '',
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
            timeField: '@timestamp',
            pointIntervalOpt: 'interval',
            pointInterval: '2m',
            pointPoints: '100',
          },
          visualization: {
            type: 'area',
            chartValue: 'mean',
            chartValueDisabled: false,
            valueField: '_value',
            stacking: '',
          }
        }
      };
      $scope.showingCurrent = true;
    };

    $scope.saveCurrentSchema = function() {
      Schema.save($scope.currentSchema._id, $scope.currentSchema)
        .success(function() {
          $route.reload();
        })
        .error(function(){
          window.alert('We are unable to submit your request.');
        });
    };

    $scope.removeSelect = function(index) {
      Schema.remove($scope.schemas[index]._id)
        .success(function() {
          $scope.schemas.splice(index, 1);
        })
        .error(function() {
          window.alert('We got an error');
        });
    };

    $scope.reloadSchemas();

    if ($location.path() === '/workbench/schema/new') {
      $scope.newCurrent();
    }

  });

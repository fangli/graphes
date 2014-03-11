'use strict';

var app = angular.module('graphEsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap',
  'highcharts-ng',
  'xeditable',
  'LocalStorageModule',
  'chieffancypants.loadingBar',
]);


app.config(function ($routeProvider, $httpProvider, $locationProvider, cfpLoadingBarProvider) {
    
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    $locationProvider.html5Mode(true);
    cfpLoadingBarProvider.includeBar = false;

    $routeProvider
      .when('/dash', {
        templateUrl: 'views/dashlist.html',
        controller: 'DashlistCtrl',
      })
      .when('/dash/new', {
        templateUrl: 'views/dash.html',
        controller: 'DashCtrl',
      })
      .when('/dash/id/:id', {
        templateUrl: 'views/dash.html',
        controller: 'DashCtrl',
      })
      .when('/dash/id/:id/edit', {
        templateUrl: 'views/dash.html',
        controller: 'DashCtrl',
      })


      .when('/workbench/schema', {
        templateUrl: 'views/schema.html',
        controller: 'SchemaCtrl',
      })
      .when('/workbench/schema/new', {
        templateUrl: 'views/schema.html',
        controller: 'SchemaCtrl',
      })

      .when('/workbench/archive/:archive', {
        templateUrl: 'views/workbench.html',
        controller: 'WorkbenchCtrl',
      })
      .when('/workbench/id/:id', {
        templateUrl: 'views/workbench.html',
        controller: 'WorkbenchCtrl',
      })

      .when('/archive/:archiveId?', {
        templateUrl: 'views/archive.html',
        controller: 'ArchiveCtrl',
      })

      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
      })

      .otherwise({
        redirectTo: '/dash'
      });

  });

app.run(function(editableOptions, editableThemes) {
  editableThemes.bs3.inputClass = 'input-sm';
  editableThemes.bs3.buttonsClass = 'btn-sm';
  editableOptions.theme = 'bs3';
});

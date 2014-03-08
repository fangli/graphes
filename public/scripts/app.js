'use strict';

var app = angular.module('graphEsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'highcharts-ng',
  'xeditable',
]);


app.config(function ($routeProvider, $httpProvider, $locationProvider) {
    
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    $locationProvider.html5Mode(true);

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

      .when('/workbench', {
        templateUrl: 'views/workbench.html',
        controller: 'WorkbenchCtrl',
      })

      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
      })

      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
      })

      .when('/archive/:archiveId?', {
        templateUrl: 'views/archive.html',
        controller: 'ArchiveCtrl',
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

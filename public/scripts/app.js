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
      .when('/', {
        templateUrl: 'views/index.html',
        controller: 'IndexCtrl',
      })

      .when('/dash', {
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

      .when('/console', {
        templateUrl: 'views/console.html',
        controller: 'ConsoleCtrl',
      })

      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
      })

      .when('/snapshot/:snapshotId?', {
        templateUrl: 'views/snapshot.html',
        controller: 'SnapshotCtrl',
      })

      .otherwise({
        redirectTo: '/'
      });

  });

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

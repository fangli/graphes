'use strict';

var app = angular.module('graphEsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
]);


app.config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/index.html',
        controller: 'IndexCtrl'
      })

      .when('/dash', {
        templateUrl: 'views/dash.html',
        controller: 'DashCtrl'
      })

      .when('/workbench', {
        templateUrl: 'views/workbench.html',
        controller: 'WorkbenchCtrl'
      })

      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })

      .when('/shell', {
        templateUrl: 'views/shell.html',
        controller: 'ShellCtrl'
      })

      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });

    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';

  });


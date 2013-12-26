'use strict';

angular.module('graphEsApp')

  .directive('ngNavbar', function(){
    return {
      restrict: 'A',
      scope: {},
      templateUrl: 'views/navbar.html',
    };
  })


  .directive('ngFooter', function(){
    return {
      restrict: 'A',
      scope: {},
      templateUrl: 'views/footer.html',
    };
  })


;

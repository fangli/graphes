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

  .directive('ngConfirmClick', [
    function(){
      return {
        link: function (scope, element, attr) {
          var msg = attr.ngConfirmClick || 'Are you sure?';
          var clickAction = attr.confirmedClick;
          element.bind('click',function () {
            if ( window.confirm(msg) ) {
              scope.$eval(clickAction);
            }
          });
        }
      };
    }
  ])

  .directive('ngFocusOn', function() {
    return function(scope, elem, attr) {
      scope.$on('focusOn', function(e, name) {
        if(name === attr.ngFocusOn) {
          elem[0].focus();
          elem[0].select();
        }
      });
    };
  })
  .factory('Setfocus', function ($rootScope, $timeout) {
    return function(name) {
      $timeout(function (){
        $rootScope.$broadcast('focusOn', name);
      });
    };
  })

;

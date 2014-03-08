'use strict';

angular.module('graphEsApp')

  .directive('ngJsonobj', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        function fromUser(text) {
          if (!text || text.trim() === '') {
            return {};
          } else {
            try {
              return angular.fromJson(text);
            } catch(e) {
              return {};
            }
          }
        }

        function toUser(object) {
          return angular.toJson(object);
        }

        ngModelCtrl.$parsers.push(fromUser);
        ngModelCtrl.$formatters.push(toUser);
        scope.$watch(attrs.ngModel, function(newValue, oldValue) {
          if (newValue !== oldValue) {
            ngModelCtrl.$setViewValue(toUser(newValue));
            ngModelCtrl.$render();
          }
        }, true);
      }
    };
  });

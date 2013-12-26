'use strict';

angular.module('GraphES')

  .factory('Head', function() {
    var title = 'GraphES';
    return {
      title: function() { return title; },
      setTitle: function(newTitle) { title = newTitle + " - GraphES"; }
    };
  }

);

'use strict';

angular.isInList = function (k, v, list) {
  for (var i in list) {
    if ((k !== undefined) && (v !== undefined) && (list[i][k] === v)) {
      return true;
    }
  }
  return false;
};


angular.getInList = function (k, v, list) {
  for (var i in list) {
    if ((list[i][k] === v) && (v !== undefined)) {
      return list[i];
    }
  }
  return null;
};

angular.posInList = function (k, v, list) {
  for (var i in list) {
    if ((k !== undefined) && (v !== undefined) && (list[i][k] === v)) {
      return i;
    }
  }
  return null;
};

angular.removeInList = function (k, v, list) {
  for (var i = list.length - 1; i >= 0; i--) {
    if ((list[i][k] === v) && (v !== undefined)) {
      list.splice(i, 1);
    }
  }
};

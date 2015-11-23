'use strict';

angular.module('flawwengApp')
  .directive('navbar', function () {
    return {
      templateUrl: 'components/navbar/navbar.html',
      restrict: 'E',
      controller: 'navbarCtrl'
    };
  });
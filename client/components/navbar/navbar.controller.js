'use strict';

angular.module('flawwengApp')
.controller('navbarCtrl', function ($rootScope,$scope, $location,$window) {
  $scope.currentUser ={"name" : "invité"};

  $scope.isCollapsed = true;

  $scope.isActive = function(route) {
    return route === $location.path();
  };

  $scope.$on('event:google-signin-success', function (event,authResult, currentUser) {
    $scope.currentUser =JSON.parse($window.sessionStorage.currentUser);
 });  

   $scope.$on('event:google-logout', function (event,authResult, currentUser) {
    $scope.currentUser ={"name" : "invité"};
 });  
});
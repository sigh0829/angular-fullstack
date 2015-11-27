'use strict';

angular.module('flawwengApp')
.controller('sidebarLeftCtrl', function ($scope) {

	$scope.menu=[];

   $scope.$on('event:sidebarletf-update', function (event,menu) {
   	$scope.menu = menu;
   	$scope.$apply();
	});  

});
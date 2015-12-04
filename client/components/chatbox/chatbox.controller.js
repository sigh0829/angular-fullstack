'use strict';

angular.module('flawwengApp')
.controller('chatboxCtrl', function ($rootScope,$scope) {
	$scope.message='';
	$scope.currentChats=[];
	$scope.$on('event:chat-to', function (event,contact) {
		$scope.currentChats.push(contact);
	});  

	$scope.send = function(contact){

	};
});
'use strict';

angular.module('flawwengApp')
.controller('sidebarLeftCtrl', function ($rootScope,$scope) {

	$scope.menu=[];
	$scope.contacts = [];
	$scope.$on('event:sidebarleft-update', function (event,menu) {
		$scope.menu = menu;
	});  

	// On get connected contacts event, update the element.
	$scope.$on('event:connected-contacts', function (event,connectedContacts) {
		/*for(var i in $scope.contacts ){
			var currentContact =  $scope.contacts[i];
			currentContact.online =  _.findWhere(connectedContacts, {name :  currentContact.name})!=undefined;
		} */
		console.log(connectedContacts);
		$scope.contacts = connectedContacts;
	});  


	$scope.talkTo = function (contact){
		$rootScope.$broadcast('event:chat-to', contact);
	}

});
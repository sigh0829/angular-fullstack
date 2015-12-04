'use strict';

angular.module('flawwengApp')
.directive('chatbox', function () {
	return {
		templateUrl: 'components/chatbox/chatbox.html',
		restrict: 'E',
		controller: 'chatboxCtrl'
	};
})
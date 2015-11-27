'use strict';

angular.module('flawwengApp')
.directive('sidebarleft', function () {
	return {
		templateUrl: 'components/sidebar/sidebar-left.html',
		restrict: 'E',
		controller: 'sidebarLeftCtrl'
	};

});
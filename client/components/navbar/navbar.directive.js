'use strict';

angular.module('flawwengApp')
.directive('navbar', function () {
	return {
		templateUrl: 'components/navbar/navbar.html',
		restrict: 'E',
		controller: 'navbarCtrl'
	};
}).directive('dropdown', function(){
	return {
		restrict: 'A',
		link: function (scope, element, attrs){
			element.bind('click', function(event){
				var dropdownmenu = element.find("ul.dropdown-menu");
				if (dropdownmenu.is(':visible')) {
					dropdownmenu.slideUp('fast');
				} else{
					dropdownmenu.slideDown('fast');
				}
			});
			element.bind('focusout', function(event){
				var dropdownmenu = element.find("ul.dropdown-menu");
				if (dropdownmenu.is(':visible')) {
					dropdownmenu.slideUp('fast');
				}
			});
		}
	}

});
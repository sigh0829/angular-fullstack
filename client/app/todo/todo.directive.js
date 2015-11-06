todo.directive('todoEscape', function () {
	var ESCAPE_KEY = 27;
	return function (scope, elem, attrs) {
		elem.bind('keydown', function (event) {
			if (event.keyCode === ESCAPE_KEY) {
				scope.$apply(attrs.todoEscape);
			}

		});
		scope.$on('$destroy', function () {
			elem.unbind('keydown');
		});
	};
}).directive('todoFocus', ['$timeout', function ($timeout) {
	return function (scope, elem, attrs) {
		scope.$watch(attrs.todoFocus, function (newval) {
			if (newval) {
				$timeout(function () {
					elem[0].focus();
				}, 0, false);
			}
		});
	};
}])
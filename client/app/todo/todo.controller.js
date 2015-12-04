var todo = angular.module('todo', ['ui.bootstrap']);
todo.controller('todoCtrl', function ($rootScope, $scope,$uibModal,todoService) {
	$rootScope.$broadcast('event:sidebarleft-update', []);
	$scope.todos =[];
	$scope.newTodo={};
	$scope.editedTodo = null;
	$scope.add = function(){
		if($scope.newTodo.title!=""){
			todoService.saveTodo($scope.newTodo).then(function(todo){
				$scope.todos.push(todo);
				$scope.newTodo={};
			}, function (error){
				alert(error)
			});
		}
	}

	$scope.removeTodo = function (todo) {
		todos.splice(todos.indexOf(todo), 1);
	};

	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;
		todo.title = todo.title.trim();

		if (!todo.title) {
			$scope.removeTodo(todo);
		}
	};

	$scope.saveEdits = function (todo, event) {
		if (event === 'blur' && $scope.saveEvent === 'submit') {
			$scope.saveEvent = null;
			return;
		}
		$scope.saveEvent = event;
		if ($scope.reverted) {
			$scope.reverted = null;
			return;
		}
		todo.title = todo.title.trim();
		if (todo.title === $scope.originalTodo.title) {
			$scope.editedTodo = null;
			return;
		}
		todoService.updateTodo(todo).then(function(todo){
		}, function (error){
			alert(error)
		}).finally(function () {
			$scope.editedTodo = null;
		});;
	};


	$scope.revertEdits = function (todo) {
		todos[todos.indexOf(todo)] = $scope.originalTodo;
		$scope.editedTodo = null;
		$scope.originalTodo = null;
		$scope.reverted = true;
	};


	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		$scope.originalTodo =createTodoFromOject(todo);
	};

	todoService.getTodos().then(function(results){
		$scope.todos = results;
	}, function(error){
		alert("Impossible de récupérer les todos.")
	});

});


/*
* Map an object in a Todo object.
*/
createTodoFromOject = function (object){
	// Todo : Treat the case of the object is undefined, return null/empty object?
	todo = new Object();
	for(var prop in object){
		if(todo.hasOwnProperty(prop)){
			todo[prop] = object[prop];
		}
	}
	return todo;
}


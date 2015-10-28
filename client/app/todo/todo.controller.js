var todo = angular.module('todo', ['ui.bootstrap']);
todo.controller('todoCtrl', function ($scope,$uibModal,todoService) {
	$scope.todos =[];
	$scope.add = function(){
		var modalInstance = $uibModal.open({
			templateUrl : 'app/todo/partial/addTodo.html',
			controller : 'addModalTodoCtrl',
			size : 'lg',
			resolve : {
				todo : function() {
					return new Todo();
				}
			}
		});
		modalInstance.result.then(function (newTodo) {
			todoService.saveTodo(newTodo).then(function(todo){
				$scope.todos.push(todo);
				console.log(todo)
			}, function (error){
				alert(error)
			});
		}, function () {
		//$log.info('Modal dismissed at: ' + new Date());
	});
	}
	$scope.todos = getTodos(todoService);
	
}).controller('addModalTodoCtrl',function($scope,$uibModalInstance,todo){
	$scope.todo=todo;

	$scope.add = function(){
		$uibModalInstance.close($scope.todo);
	}
	$scope.cancel = function(){
		$uibModalInstance.dismiss();
	}
	

});

/**
* Todo class
*/
Todo  = function(){
	this.id=-1;
	this.label="";
	this.toString =  function(){
		return this.id + ' - ' + this.label;
	} 
}

/*
* Map an object in a Todo object.
*/
createTodoFromOject = function (object){
	// Todo : Treat the case of the object is undefined, return null/empty object?
	todo = new Todo();
	for(var prop in object){
		if(todo.hasOwnProperty(prop)){
			todo[prop] = object[prop];
		}
	}
	return todo;
}

getTodos = function(todoService){
	todos = [];
	todoService.getTodos().then(function(results){
		angular.forEach(results, function(value,key){
		this.push(createTodoFromOject(value));
	},todos);

	}, function(error){
		alert("Impossible de récupérer les todos.")
	});
	return todos;
};


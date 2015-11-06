todo.service('todoService', function($q, $http){
	this.getTodos = function(){
		var deffered = $q.defer();
		$http.get('/api/todo').then(function(data, status) {
			deffered.resolve(data.data);
		}, function (data, status){
			console.log(data)
			deffered.reject(data);
		});
		return deffered.promise;
	}

	this.saveTodo = function(todo){
		var deffered = $q.defer();
		$http.post('/api/todo',todo).then(function(data, status) {
			deffered.resolve(data.data);
		}, function (data, status){
			deffered.reject(data);
		});
		return deffered.promise;
	}
	
	this.updateTodo = function(todo){
		var deffered = $q.defer();
		console.log(todo);
		$http.post('/api/todo/'+todo.id,todo).then(function(data, status) {
			deffered.resolve(data.data);
		}, function (data, status){
			deffered.reject(data);
		});
		return deffered.promise;
	}


});
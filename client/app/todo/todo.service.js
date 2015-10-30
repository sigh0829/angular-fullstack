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
		$http.post('/api/todos',todo).then(function(data, status) {
			deffered.resolve(data.data);
		}, function (data, status){
			console.log(data)
			deffered.reject(data);
		});
		return deffered.promise;
	}

});
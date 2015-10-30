kanban.service('kanbanService', function($q, $http){
	this.getKanban = function(){
		var deffered = $q.defer();
		$http.get('/api/kanban').then(function(data, status) {
			deffered.resolve(data.data);
		}, function (data, status){
			deffered.reject(data);
		});
		return deffered.promise;
	}

	this.getKanbanById = function(id){
		var deffered = $q.defer();
		$http.get('/api/kanban/'+id).then(function(data, status) {
			deffered.resolve(data.data);
		}, function (data, status){
			deffered.reject(data);
		});
		return deffered.promise;
	}


	this.addTask = function(idKanban, task){
		$http.post('/api/kanban/'+idKanban+'/column/'+task.idColumn+'/task',task).then(function(data, status) {
			deffered.resolve(data.data);
		}, function (data, status){
			deffered.reject(data);
		});
	}

	this.modifyTask = function(idKanban, task){
		$http.put('/api/kanban/'+idKanban+'/column/'+task.idColumn+'/task',task).then(function(data, status) {
			deffered.resolve(data.data);
		}, function (data, status){
			deffered.reject(data);
		});
	}

	this.deleteTask = function(idKanban, idColumn, idTask){
		var deffered = $q.defer();
		$http.delete('/api/kanban/'+idKanban+'/column/'+idColumn+'/task/'+idTask).then(function(data, status) {
			deffered.resolve(data.data);
		}, function (data, status){
			deffered.reject(data);
		});
		return deffered.promise;
	}

});
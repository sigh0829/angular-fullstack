var kanban = angular.module('kanban', ['ui.bootstrap','ui.sortable']);

Task  = function(){
	this.id=-1;
	this.idColumn=-1;
	this.name='';
	this.description='';
	this.owner='';
	this.endDate='';
	this.timeEstimate=''
	this.timeSpent=''
	this.toString =  function(){
		return this.id + ' - ' + this.name;
	} 
}

kanban.controller('kanbanCtrl', function ($scope,$uibModal, kanbanService) {
	$scope.selectedKanban=null;;
	$scope.kanbans =[];
	$scope.currentKanban = null;


	$scope.selectKanban = function(kanbanSelected){
		kanbanService.getKanbanById(kanbanSelected.id).then(function(data){
			$scope.currentKanban = data;
		},function(error){
			alert('La récupération de la liste des kanban a échoué.');
		}); 

	}

	$scope.sortableOptions = {
		placeholder: "task",
		connectWith: ".column-container",
		update : function(evt, ui){
			columns = $scope.currentKanban.columns;
			console.log(ui);
			if(ui.item[0].id!=undefined && ui.sender!=undefined){
				idTask = ui.item[0].id;
				idTargetColumn=evt.target.id;
				for ( id in columns){
					task = _.findWhere(columns[id].tasks,{id:idTask});
					if(task!=undefined){
						break;
					}
				}
				task.newColumn = idTargetColumn;
				kanbanService.modifyTask($scope.currentKanban.id, task).then(function (data){
					task.idColumn = idTargetColumn;	
				}, function (error){
			// @TODO : Force to reload cause modify is displayed, work on scope bean.
			alert('Une erreur est survenue lors de la création de la tâche.' + error);
		});
			}
		}
	};

	$scope.add = function(kanbanSelected, col){
		var modalInstance = $uibModal.open({
			templateUrl : 'app/kanban/partial/modifyTask.html',
			controller : 'modifyModalTaskCtrl',
			size : 'lg',
			resolve : {
				task : function() {
					return new Task;
				},
				isAddMode : function(){
					return true;
				}
			}
		});
		modalInstance.result.then(function (newTask) {
			newTask.idColumn = col.id
			kanbanService.addTask(kanbanSelected.id, newTask).then(function (data){
				col.tasks.push(data);	
			}, function (error){
				alert('Une erreur est survenue lors de la création de la tâche.');
			});

		}, function () {
		});
	}
	$scope.modify = function(task){
		task.endDate = task.endDate!=null?new Date(task.endDate):task.endDate;
		var modalInstance = $uibModal.open({
			templateUrl : 'app/kanban/partial/modifyTask.html',
			controller : 'modifyModalTaskCtrl',
			size : 'lg',
			resolve : {
				task : function() {
					return task;
				},
				isAddMode : function(){
					return false;
				}
			}
		});
		modalInstance.result.then(function (modifiedTask) {
			kanbanService.modifyTask($scope.currentKanban.id, modifiedTask).then(function (data){
			//	index = _.findIndex(col.tasks, {'id' : data.id});
				//col.tasks[index] = data;
			}, function (error){
			// @TODO : Force to reload cause modify is displayed, work on scope bean.
			alert('Une erreur est survenue lors de la création de la tâche.');
		});
		}, function () {
		});
	}
	$scope.delete = function(kanbanSelected, column,task){
		kanbanService.deleteTask(kanbanSelected.id, column.id, task.id).then(function(data){
			column.tasks = _.without(column.tasks,task);
		},function(error){
			alert('La récupération de la liste des kanban a échoué.');
		}); 
	}

	kanbanService.getKanban().then(function(data){
		$scope.kanbans = data;
	},function(error){
		alert('La récupération de la liste des kanban a échoué.');
	});

}).controller('modifyModalTaskCtrl', function($scope,$uibModalInstance,task,isAddMode){
	$scope.title=isAddMode?'Ajouter une tâche.':'Modifier une tâche';
	$scope.owners=[{
		name:'flawweng'
	}];

	$scope.task = task;

	$scope.endDate = {
		opened: false
	};

	$scope.openEndDate = function($event) {
		$scope.endDate.opened = true;
	};

	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();
	$scope.maxDate = new Date(2099, 12, 31);

	$scope.modify = function(){
		$uibModalInstance.close($scope.task);
	}

	$scope.cancel = function(){
		$uibModalInstance.dismiss();
	}
});

createTaskFromObject = function (object){
	// Todo : Treat the case of the object is undefined, return null/empty object?
	task = new Task();
	for(var prop in object){
		if(task.hasOwnProperty(prop)){
			task[prop] = object[prop];
		}
	}
	return task;
}
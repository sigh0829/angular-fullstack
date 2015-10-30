var kanban = angular.module('kanban', ['ui.bootstrap']);

Task  = function(){
	this.id=-1;
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
	$scope.owners=[{
		name:'flawweng'
	}];
	
	$scope.columns=[];
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

	$scope.onDrop = function (data, targetColId) {  
		task = createTaskFromObject(data);
		columns = $scope.columns;
		for ( id in columns){
			col = columns[id];
			isTaskAlreadyExist = !(_.findWhere(col.tasks,{id:task.id})==undefined);
			isSameColId = col.id==targetColId;
			if(!isTaskAlreadyExist && isSameColId){
				col.tasks.push(task);
			} else if(isTaskAlreadyExist && !isSameColId){
				_.remove(col.tasks, function(n){
					return _.isEqual(n.id,task.id);
				});
			}
		}
		$scope.$apply();
	}
	$scope.add = function(col){
		var modalInstance = $uibModal.open({
			templateUrl : 'app/kanban/partial/modifyTask.html',
			controller : 'modifyModalTaskCtrl',
			size : 'lg',
			resolve : {
				task : function() {
					return new Task();
				},
				isAddMode : function(){
					return true;
				}
			}
		});
		modalInstance.result.then(function (newTask) {
			/*kanbanService.addTask(newTask){

			}*/
			col.tasks.push(newTask);
		}, function () {
		});
	}
	$scope.modify = function(task){
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
			console.log(modifiedTask);
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

kanban.directive('kanbanBoardDragg', function () {
	return {
		link: function ($scope, element, attrs) {
			var dragData = "";
			$scope.$watch(attrs.kanbanBoardDragg, function (newValue) {
				dragData = newValue;
			});
			element.bind('dragstart', function (event) {
				event.originalEvent.dataTransfer.setData("Text", JSON.stringify(dragData));
			});
		}
	};
});

kanban.directive('kanbanBoardDrop', function () {
	return {
		link: function ($scope, element, attrs) {
			var dragOverClass = attrs.kanbanBoardDrop;
            //  Prevent the default behavior. This has to be called in order for drob to work
            cancel = function (event) {
            	if (event.preventDefault) {
            		event.preventDefault();
            	}

            	if (event.stopPropigation) {
            		event.stopPropigation();
            	}
            	return false;
            };
            element.bind('dragover', function (event) {
            	cancel(event);
            	event.originalEvent.dataTransfer.dropEffect = 'move';
            	element.addClass(dragOverClass);                
            });

            element.bind('drop', function (event) {
            	cancel(event);
            	element.removeClass(dragOverClass);                
            	var droppedData = JSON.parse(event.originalEvent.dataTransfer.getData('Text'));
            	$scope.onDrop(droppedData, element.attr('id'));

            });
            element.bind('dragleave', function (event) {
            	element.removeClass(dragOverClass);
            });
        }
    };
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
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

kanban.controller('kanbanCtrl', function ($scope,$uibModal) {
	$scope.owners=[{
		name:'flawweng'
	}];

	$scope.columns = [
	{
		id:1,name:'A faire',tasks:[
		createTaskFromObject({
			id: 10,
			name:"Développer en Angular",
			description : 'Approfondir ses connaissances sur la technologie.',
			owner:'flawweng',
			endDate:'',
			timeEstimate:'12',
			timeSpent:'0'
		}), createTaskFromObject({
			id:11,
			name:"Se sensibiliser aux technogies mobiles",
			description : 'Approfondir ses connaissances sur la technologie.',
			owner:'flawweng',
			endDate:'',
			timeEstimate:'12',
			timeSpent:'0'
		})
		]
	},{
		id:2,name:'En cours',tasks:[]
	}, {
		id:3,name:"Réalisé",tasks:[]
	},{
		id:4,name:'Abandonné',tasks:[]
	}
	];
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
	$scope.delete = function(column,task){
		column.tasks = _.without(column.tasks,task);
		//task = undefined;
	}

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
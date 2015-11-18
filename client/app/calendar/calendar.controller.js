var calendar = angular.module('calendar', ['ui.bootstrap','ui.calendar']);


calendar.controller('calendarCtrl', function($scope,$uibModal){
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();

	CalendarEvent  = function(title, start, end){
		this.id=-1;
		this.title=title;
		this.start=start,
		this.end=end,
		this.toString =  function(){
			return this.id + ' - ' + this.title + ' - '+ this.startDate + ' - '+ this.endDate;
		} 
	}

	/* event source that pulls from google.com */
	$scope.eventSource = {
		url: "https://calendar.google.com/calendar/feeds/fr.french%23holiday%40group.v.calendar.google.com/public/basic?key=AIzaSyDKO_AeL_SKDzwdM_S9wqOqojBd4A3a3KE",
            className: 'gcal-event'          // an option!
        };
        /* event source that contains custom events on the scope */
        $scope.events = [
        new CalendarEvent("Today is gonna the day", new Date(y,m,d),new Date(y,m,d+1))
        //{title: 'All Day Event',start: new Date(y, m, 1)},
        //{title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
        //{id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
        //{id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
        //{title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
        //{title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ];

        /* alert on eventClick */
        $scope.alertOnEventClick = function( date, jsEvent, view){
        	alert(date.title + ' was clicked ');
        };
        /* alert on Drop */
        $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
        	alert('Event Droped to make dayDelta ' + delta);
        };
        /* alert on Resize */
        $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
        	alert('Event Resized to make dayDelta ' + delta);
        };
        
        /* Render Tooltip */
        $scope.eventRender = function( event, element, view ) { 
        	element.attr({'tooltip': event.title,
        		'tooltip-append-to-body': true});
        //$compile(element)($scope);
    };

    $scope.onDayClick = function(date, allDay, jsEvent, view){
    	var modalInstance = $uibModal.open({
    		templateUrl : 'app/calendar/partial/modifyEvent.html',
    		controller : 'modifyEventCtrl',
    		size : 'lg',
    		resolve : {
    			calendarEvent : function() {
    				var currentDate = new Date();
    				var startDate = new Date(date.year(), date.month(), date.date(),currentDate.getHours(),0);
    				return new CalendarEvent("Nouveau événement",startDate, 
    					new Date(startDate));
    			},
    			isAddMode : function(){
    				return true;
    			}
    		}
    	});

    	modalInstance.result.then(function (calendarEvent) {
    		$scope.events.push(calendarEvent);
    	}, function () {
    	});

    };
    /* config object */
    $scope.uiConfig = {
    	calendar:{
    		height: 450,
    		editable: true,
    		header:{
    			left: 'title',
    			center: '',
    			right: 'today prev,next'
    		},
    		dayClick : $scope.onDayClick,
    		eventClick: $scope.alertOnEventClick,
    		eventDrop: $scope.alertOnDrop,
    		eventResize: $scope.alertOnResize,
    		eventRender: $scope.eventRender,
    		dayNames:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],
    		dayNamesShort:["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"]

    	}
    };

    $scope.eventSources = [$scope.events, $scope.eventSource];

}).controller('modifyEventCtrl', function($scope, $uibModalInstance, calendarEvent){
	$scope.hours=['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];	
	$scope.minutes=['0','15','30','45'];

	$scope.title='Ajouter un événement.';
	$scope.calendarEvent = {};
	angular.copy(calendarEvent,$scope.calendarEvent);

	$scope.startHour=$scope.calendarEvent.start.getHours()+'';
	$scope.startMinute = $scope.calendarEvent.start.getMinutes()+'';
	$scope.endHour=$scope.calendarEvent.end.getHours()+'';
	$scope.endMinute = $scope.calendarEvent.end.getMinutes()+'';
	$scope.modify = function(){
		console.log($scope.calendarEvent.start.setHours($scope.startHour));
		$scope.calendarEvent.start.setMinutes($scope.startMinute);
		$scope.calendarEvent.end.setHours($scope.endHour);
		$scope.calendarEvent.end.setMinutes($scope.endMinute);
		$uibModalInstance.close($scope.calendarEvent);

	}

	$scope.cancel = function(){
		$uibModalInstance.dismiss();
	}

});
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
 $scope.googleEvents = [];

 gapi.client.load('calendar', 'v3').then(function(){
 /* request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 250,
    'orderBy': 'startTime'
  }).execute(function(resp) {
   var events = resp.items;
   console.log(resp);
   if (events.length > 0) {
    for (i = 0; i < events.length; i++) {
      $scope.googleEvents.push(new CalendarEvent(
        events[i].summary,moment(events[i].start.dateTime),moment(events[i].end.dateTime)
        ));
    }};
    console.log($scope.googleEvents);
    $scope.$apply();
  })*/

 request = gapi.client.calendar.calendarList.list({}).execute(function(resp) {
  var calendars = resp.items;
  for (i = 0; i < calendars.length; i++) {
    var calendar = calendars[i];
  //  console.log(calendar);
  gapi.client.calendar.events.list({
    'calendarId': calendar.id,
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 250,
    'orderBy': 'startTime'
  }).execute(function(resp){
   var events = resp.items;
   for (i = 0; i < events.length; i++) {
    $scope.googleEvents.push(new CalendarEvent(
      events[i].summary,moment(events[i].start.dateTime),moment(events[i].end.dateTime)
      ));
  }
  console.log($scope.googleEvents)
  $scope.$apply();
});
}
 //console.log(resp);
})

});


/* event source that contains custom events on the scope */
$scope.events = [
new CalendarEvent("Today is gonna the day", new Date(y,m,d),new Date(y,m,d+1))
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

   $scope.eventSources = [$scope.events,$scope.googleEvents];

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
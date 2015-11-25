'use strict';
var firstOrRefreshLoad = true;
var isSignin =false;
angular.module('flawwengApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap','todo','kanban','calendar'
  ])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'app/login/login.html',
    controllerAs: 'login'
  })
  .when('/todo', {
    templateUrl: 'app/todo/todo.html',
    controller: 'todoCtrl',
    controllerAs: 'todo'
  }).when('/kanban', {
    templateUrl: 'app/kanban/kanban.html',
    controller: 'kanbanCtrl',
    controllerAs: 'kanban'
  }).when('/calendar', {
    templateUrl: 'app/calendar/calendar.html',
    controller: 'calendarCtrl',
    controllerAs: 'calendar'
  }).when('/about', {
    templateUrl: 'app/about/about.html',
    css: 'app/about/about.css'
  }).otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(true);
})
.run(['$rootScope','$location','$window','$timeout',
  function ($rootScope,$location,$window,$timeout) {
   /*googleAuthObj.signIn().then(function(val){
    console.log('sign in');
    isSignin = true;
  }); */
 /* googleAuthObj.signOut().then(function(){
    console.log('sign out')
  });
*/
googleAuthObj.isSignedIn.listen(function(val){
  console.log(val);
    isSignin = val;    
  if(!val){
    $rootScope.$apply(function(){
      $location.path("/login");
    });
  } else {
    $rootScope.$apply(function(){
      $location.path("/");
    });
  }
}); 

$rootScope.$on('$routeChangeSuccess', function (event, next, current) {
  if(firstOrRefreshLoad){
   $timeout(function() {
     if(!gapi.auth2.getAuthInstance().currentUser.get().isSignedIn()){
      $location.path("/login");
      isSignin=false;
    }
    firstOrRefreshLoad = false;
  }, 3000);
 } 
 if(!isSignin){
   $location.path("/login");

 }
  // console.log(gapi.auth2.getAuthInstance().currentUser.get().isSignedIn())
  // console.log('Changement de route :'+isSignin);
  
}); 
}
]);


/*
$(document).ready(function () {
  $('.show-sidebar').on('click', function (e) {
    e.preventDefault();
    $('div#main').toggleClass('sidebar-show');
    //setTimeout(MessagesMenuWidth, 250);
  });
});
*/
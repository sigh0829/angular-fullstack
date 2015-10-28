'use strict';

angular.module('flawwengApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap','todo','kanban'
  ])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider.when('/todo', {
    templateUrl: 'app/todo/todo.html',
    controller: 'todoCtrl',
    controllerAs: 'todo'
  }).when('/kanban', {
    templateUrl: 'app/kanban/kanban.html',
    controller: 'kanbanCtrl',
    controllerAs: 'kanban'
  }).when('/about', {
    templateUrl: 'app/about/about.html',
    css: 'app/about/about.css'
  }).otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(true);
});

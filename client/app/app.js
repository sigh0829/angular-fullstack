'use strict';

angular.module('angularFullstackApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap','todo'
  ])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider.when('/todo', {
    templateUrl: 'app/todo/todo.html',
    controller: 'todoCtrl',
    controllerAs: 'todo'
  })
  .otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(true);
});

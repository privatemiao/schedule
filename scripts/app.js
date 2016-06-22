'use strict';

/**
 * @ngdoc overview
 * @name test2App
 * @description # test2App
 * 
 * Main module of the application.
 */
angular.module('test2App', [ 'ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch' ]).config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'views/dashboard.html',
		controller : 'DashboardController',
		controllerAs: 'dashboardController'
	}).when('/person/:userId/:date', {
		templateUrl : 'views/person.html',
		controller : 'PersonController',
		controllerAs : "personController"
	}).otherwise({
		redirectTo : '/'
	});
});

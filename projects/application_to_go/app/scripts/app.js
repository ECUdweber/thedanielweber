'use strict';

/**
 * @ngdoc overview
 * @name applicationToGoApp
 * @description
 * # applicationToGoApp
 *
 * Main module of the application.
 */

angular
  .module('applicationToGoApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.grid',
    'ui.grid.pagination',
    'ui.bootstrap',
    'customSsnModule',
    'firebase'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/customers.html',
        controller: 'CustomersCtrl',
        controllerAs: 'customers'
      })
      .when('/customers/:customerId', {
        templateUrl: 'views/customer_edit.html',
        controller: 'CustomerDetailCtrl',
        controllerAs: 'customer_detail'
      })      
      .when('/customers', {
        templateUrl: 'views/customers.html',
        controller: 'CustomersCtrl',
        controllerAs: 'customers'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

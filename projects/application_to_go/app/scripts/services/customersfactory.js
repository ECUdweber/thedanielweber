'use strict';

/**
 * @ngdoc service
 * @name applicationToGoApp.customersFactory
 * @description
 * # customersFactory
 * Factory in the applicationToGoApp.
 */

var customers_route = "/api/customers/";

angular.module('applicationToGoApp', ["firebase"])
  .factory('customersFactory', function customersFactory($resource, $firebaseObject) {
    return $resource(customers_route + ':id',
      {id:'@id'},
      {'update': {method:'PUT'}}
    );
  }); 

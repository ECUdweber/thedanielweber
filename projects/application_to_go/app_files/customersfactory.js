'use strict';

/**
 * @ngdoc service
 * @name applicationToGoApp.customersFactory
 * @description
 * # customersFactory
 * Factory in the applicationToGoApp.
 */

var customers_route = "/api/customers/";

angular.module('applicationToGoApp')
  .factory('customersFactory', function customersFactory($resource) {
    return $resource(customers_route + ':id',
      {id:'@id'},
      {'update': {method:'PUT'}}
    );
  }); 

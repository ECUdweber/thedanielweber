'use strict';

/**
 * @ngdoc service
 * @name applicationToGoApp.customersFactory
 * @description
 * # customersFactory
 * Factory in the applicationToGoApp.
 */

var customers_route = "/api/customers/";
var FIREBASE_URL = "https://app-to-go.firebaseio.com";

angular.module('applicationToGoApp')
	.factory('customersFactory', function($firebaseArray) {
	    var customers = $firebaseArray(new Firebase(FIREBASE_URL));

	    var Customer = {
	        all: function () {
	          return customers;
	        },
	        create: function (item) {
	          return customers.$add(item);
	        },
	        get: function (itemId) {
	          return $firebase(ref.child('items').child(itemId)).$asObject();
	        },
	        update: function (itemId, item) {
	          return $firebase(ref.child('items').child(itemId)).update(item);
	        },
	        delete: function (item) {
	          return customers.$remove(item);
	        }
	    };
	    return Customer;
	});

/*
angular.module('applicationToGoApp', ["firebase"])
  .factory('customersFactory', function customersFactory($resource, $firebaseObject) {
    return $resource(customers_route + ':id',
      {id:'@id'},
      {'update': {method:'PUT'}}
    );
  }); 
*/
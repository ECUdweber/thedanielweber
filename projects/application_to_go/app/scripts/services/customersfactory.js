'use strict';

/**
 * @ngdoc service
 * @name applicationToGoApp.customersFactory
 * @description
 * # customersFactory
 * Handles CRUD apps for customers
 */

var customers_route = "/api/customers/";
var FIREBASE_URL = "https://app-to-go.firebaseio.com";

angular.module('applicationToGoApp')
	.factory('customersFactory', function($firebaseArray, $filter) {

		var ref = new Firebase(FIREBASE_URL);
		var customers = $firebaseArray(ref);

	    var Customer = {
	        all: function () {
	          return customers;
	        },
	        create: function (item) {
	          return customers.$add(item);
	        },
	        get: function (itemId) {
	        	//console.log("Getting customer with id of: ", itemId);

	        	var customerById = $filter('filter')(customers, {id: itemId })[0];
	        	//console.log("object_by_id: ", customerById);

	        	return customerById;
	        },
			update: function (itemId, item) {
				console.log("Will update item: ", item);

				var customer = $filter('filter')(customers, function (d) {return d.id === item.id;})[0];

				//list[2].foo = "bar";

				customers.$save(customer).then(function(ref) {
				  ref.key() === customer.id; // true
				});				

				return;
			},	        
	        delete: function (item) {
				var customer = $filter('filter')(customers, function (d) {return d.id === item.id;})[0];

				customers.$remove(customer).then(function(ref) {
				  ref.key() === customer.id; // true
				  return customer;
				});
	        }
	    };
	    return Customer;
	});
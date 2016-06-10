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
	          return $firebase(ref.child('items').child(itemId)).$asObject();
	        },
			update: function (itemId, item) {
			  return ref.child('items').child(itemId).set(item);
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
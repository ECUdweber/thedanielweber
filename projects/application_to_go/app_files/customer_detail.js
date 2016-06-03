'use strict';

/**
 * @ngdoc function
 * @name applicationToGoApp.controller:CustomerDetailCtrl
 * @description
 * # CustomerDetailCtrl
 * Controller of the applicationToGoApp
 */

var genderDropdownOptions = ["Male", "Female"];

var titleDropdownOptions = [
	["Mr.","Dr."],
  ["Ms.","Mrs.","Dr."]
];  

angular.module('applicationToGoApp')
  .controller('CustomerDetailCtrl', function ($scope, $location, $routeParams, customersFactory) {
    
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];  

    $scope.genderDropdown = genderDropdownOptions;
    $scope.titleDropdown = [];

  	$scope.customer = {
  		gender: "Choose a gender",
  		title: "Choose gender to get options"
  	};

  	$scope.customerId = $routeParams.customerId; 

    $scope.getTitleDropdownOptions = function(option, index) {
    	$scope.customer.gender = option;
    	$scope.customer.title = "Choose a title";

        var key = $scope.genderDropdown.indexOf(index);

        // Here you could actually go out and fetch the options for a server.
        var titleOptions = titleDropdownOptions[index];
        
        // Now set the options.
        // If you got the results from a server, this would go in the callback
        $scope.titleDropdown = titleOptions;
    };

	  $scope.saveCustomer = function (isValid) {

        if (isValid) {
			      customersFactory.update({id: $scope.customerId}, $scope.customer);
            alert("UPDATE SENT! Should I redirect to customer search page or show a dialog of sorts?");
			     //$location.path("#/customers");	                  
        }	

    };

    $scope.refresh = function () {    
      $scope.customer = customersFactory.get({id: $scope.customerId});
      if($scope.customer.gender === "")
        $scope.customer.gender = "Choose a gender";      

      if(!$scope.customer.title)
        $scope.customer.title = "Choose gender to get options";      
    };     

    $scope.refresh();  	  

  });

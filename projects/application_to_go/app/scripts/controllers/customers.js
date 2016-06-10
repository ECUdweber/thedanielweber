'use strict';

/**
 * @ngdoc function
 * @name applicationToGoApp.controller:CustomersCtrl
 * @description
 * # CustomersCtrl
 * Controller of the applicationToGoApp
 */
angular.module('applicationToGoApp')
  .controller('CustomersCtrl', function ($scope, $http, customersFactory, uiGridConstants, modalService) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ]; 

    $scope.customersSearch = {
    	"firstName": "",
    	"lastName": ""
	};          

    $scope.searchCustomers = function () {
        console.log("Searching customers.");

		$http.get("/api/customers/search", {
		    params: { firstName: $scope.customersSearch.firstName, lastName: $scope.customersSearch.lastName, page: $scope.pagination.pageNumber, itemsPerPage: $scope.pagination.itemsPerPage }
		})
        .then(function (result) {
        	$scope.customersGridOptions.data = result.data.customers;
        	$scope.customersData = result.data.customers;
        	$scope.pagination.totalItems = result.data.totalItems;
        });
    };    

    $scope.removeRow = function(row) {
		var index = $scope.customersData.indexOf(row.entity);
		//console.log("DELETE ROW.", index);
		$scope.customersData.splice(index, 1);
    };

	$scope.deleteCustomer = function (row) {

        var modalOptions = {
            closeButtonText: 'No',
            actionButtonText: 'Yes',
            headerText: 'Confirmation',
            bodyText: 'Are you sure you want to delete?'
        };

        modalService.showModal({}, modalOptions).then(function (result) {
       
	        customersFactory.delete({id: row.entity.id}, function(data) {
	            $scope.refresh();
	        });			                

        });  
       
	};    

	var removeTemplate = '<div class="customer_action_cell"><div class="edit_div"><a ng-href="#/customers/{{row.entity.id}}" class="glyphicon glyphicon-pencil edit_customer_cell">&nbsp;</a></div>&nbsp;<div class="glyphicon glyphicon-trash edit_customer_cell" ng-click="grid.appScope.deleteCustomer(row);">&nbsp;</div></div>';		

    $scope.customersGridOptions = { 
    	useExternalPagination: false,
        enableFiltering: true,
    	useExternalSorting: false,
		columnDefs: [
			{ field: 'actions', sortable: false, width: '5%', displayName: 'Actions', enableFiltering: false, cellTemplate: removeTemplate},
			{ field: 'firstName', displayName: 'First name'},
			{ field: 'lastName', displayName: 'Last name'},
            { field: 'nickName', displayName: 'Nickname'},
            { field: 'maritalStatus', displayName: 'Marital Status'},
            { field: 'middleName', displayName: 'Middle name'}            
        ],        	
    	data : 'customersData' 
    }; 

	$scope.refresh = function () {
        $scope.customersData = customersFactory.all();
	};

	$scope.refresh(); 
  });

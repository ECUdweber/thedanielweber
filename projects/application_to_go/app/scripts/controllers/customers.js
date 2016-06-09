'use strict';

/**
 * @ngdoc function
 * @name applicationToGoApp.controller:CustomersCtrl
 * @description
 * # CustomersCtrl
 * Controller of the applicationToGoApp
 */
angular.module('applicationToGoApp')
  .controller('CustomersCtrl', function ($scope, $http, $firebaseArray, customersFactory, uiGridConstants, modalService) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ]; 

    $scope.customersSearch = {
    	"firstName": "",
    	"lastName": ""
	};          

    var ref = new Firebase("https://app-to-go.firebaseio.com");
    // download the data into a local object
    $scope.customersData = $firebaseArray(ref);
    

    // this waits for the data to load and then logs the output. Therefore,
    // data from the server will now appear in the logged output. Use this with care!
    $scope.customersData.$loaded()
      .then(function() {
        console.log($scope.customersData);
      })
      .catch(function(err) {
        console.error(err);
      });


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


    $scope.pagination = {
        pageSize: 10,
        pageNumber: 1,
        itemsPerPage: 10,
        totalItems: 0,
        getTotalPages: function () {
            return Math.ceil(this.totalItems / this.pageSize);
        },
        nextPage: function () {
            if (this.pageNumber < this.getTotalPages()) {
                this.pageNumber++;
                $scope.load();
            }
        },
        previousPage: function () {
            if (this.pageNumber > 1) {
                this.pageNumber--;
                $scope.load();
            }
        }
    };  	

	//called when navigate to another page in the pagination
	$scope.selectPage = function () {
		var page = $scope.pagination.pageNumber;
	    $scope.pagination.pageNumber = page;
		$scope.refresh();
	};

    $scope.customersGridOptions = { 
    	useExternalPagination: false,
        enableFiltering: true,
    	useExternalSorting: false,
		columnDefs: [
			{ field: 'actions', sortable: false, width: '5%', displayName: 'Actions', cellTemplate: removeTemplate},
			{ field: 'firstName', displayName: 'First name'},
			{ field: 'lastName', displayName: 'Last name'},
            { field: 'nickName', displayName: 'Nickname'},
            { field: 'maritalStatus', displayName: 'Marital Status'},
            { field: 'middleName', displayName: 'Middle name'}            
        ],        	
    	data : 'customersData' 
    }; 

	$scope.refresh = function () {

		$http.get("/api/customers/", {
		//customersFactory.query(), {	    
	    	params: { page: $scope.pagination.pageNumber, itemsPerPage: $scope.pagination.itemsPerPage }
	    })
	    .success(function (data) {
			$scope.customersData = data.customers;
			$scope.pagination.totalItems = data.totalItems;
	    });

	};

    $scope.getDataFromFirebase = function () {
        console.log("Getting data from firebase.");
        $scope.customersData = $firebaseObject(ref);
    };    

    //$scope.getDataFromFirebase();

	//$scope.refresh(); 
  });

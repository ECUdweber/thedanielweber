var mainApp = angular.module("myApp", ['ngRoute', 'mm.foundation', 'grocery_module']);

mainApp.config(['$routeProvider',
   function($routeProvider) {
      $routeProvider.
         when('/groceries', {
            templateUrl: 'templates/groceries/groceries.html',
            controller: 'GroceriesController'
         }).      
         when('/addGroceryItem', {
            templateUrl: 'templates/groceries/addGroceryItem.html',
            controller: 'AddGroceryItemController'
         }).
         when('/viewGroceryItem', {
            templateUrl: 'templates/groceries/viewGroceryItem.html',
            controller: 'ViewGroceryItemController'
         }).
         otherwise({
            redirectTo: '/groceries',
            controller: 'GroceriesController'
         });
   }]);
   
mainApp.controller('mainController', 
  function($scope, $route, $routeParams, $location) {
    console.log("Main Controller is here...");
    $scope.route = $route;
    $scope.location = $location;
    $scope.routeParams = $routeParams;
  }
);    
    
mainApp.controller('userController', 
  function($scope) {
    $scope.fName = '';
    $scope.lName = '';
    
    $scope.passw1 = '';
    $scope.passw2 = '';
    
    $scope.users = [
    {id:1, fName:'Chips',  lName:"$2.99" },
    {id:2, fName:'Meat',   lName:"$5.50" },
    {id:3, fName:'Milk',   lName:"$3.22" },
    {id:4, fName:'Eggs',  lName:"$1.89" },
    {id:5, fName:'Butter',  lName:"$3.99" },
    {id:6, fName:'Cereal', lName:"$4.99" }
    ];
    $scope.edit = true;
    $scope.error = false;
    $scope.incomplete = false;
    
    $scope.editUser = function(id) {
      if (id == 'new') {
        $scope.edit = true;
        $scope.incomplete = true;
        $scope.fName = '';
        $scope.lName = '';
      } 
      else {
        $scope.edit = false;
        $scope.fName = $scope.users[id-1].fName;
        $scope.lName = $scope.users[id-1].lName;
      }
    };
    
    $scope.$watch('passw1',function() {$scope.test();});
    $scope.$watch('passw2',function() {$scope.test();});
    $scope.$watch('fName', function() {$scope.test();});
    $scope.$watch('lName', function() {$scope.test();});
    
    $scope.saveUser = function() {
    	console.log("Saving this user. Not really yet...");
    };
    
    $scope.test = function() {
      if ($scope.passw1 !== $scope.passw2) {
        $scope.error = true;
        } else {
        $scope.error = false;
      }
      $scope.incomplete = false;
      if ($scope.edit && (!$scope.fName.length ||
      !$scope.lName.length ||
      !$scope.passw1.length || !$scope.passw2.length)) {
           $scope.incomplete = true;
      }
    };  
  }
);    
var grocery_module = angular.module("grocery_module", []);
    
grocery_module.controller('AddGroceryItemController', 
  function($scope) {
    console.log("Add Grocery Item Controller...");
  }
); 

grocery_module.controller('ViewGroceryItemController', 
  function($scope) {
    console.log("View Grocery Item Controller...");
  }
);

grocery_module.controller('GroceriesController', 
  function($scope) {
    $scope.log = function(msg, obj) {
      console.log(msg, obj);
    };  
  
    $scope.log("Groceries Controller...", '');
  
    $scope.isOver5 = "Under $5";
    $scope.item_being_edited = "";
  
    $scope.fName = '';
    $scope.lName = '';
    
    $scope.passw1 = '';
    $scope.passw2 = '';
    
    $scope.users = [
    {id:1, fName:'Chips', lName:"$2.99", price:"2.99" },
    {id:2, fName:'Meat', lName:"$5.50", price:"5.50" },
    {id:3, fName:'Milk', lName:"$3.22", price:"3.22" },
    {id:4, fName:'Eggs', lName:"$1.89", price:"1.89" },
    {id:5, fName:'Butter', lName:"$3.99", price:"3.99" },
    {id:6, fName:'Cereal', lName:"$4.99", price:"4.99" }
    ];
    
    $scope.edit = true;
    $scope.error = false;
    $scope.incomplete = false;
    
    $scope.editUser = function(id) {
      $scope.item_being_edited = $scope.users[id - 1]; 
    
    	$scope.isOver5 = "";    	    	
    	$scope.isOver5 = $scope.item_being_edited.price > 5 ? "OVER $5" : "Under $5";
      //$scope.isOver5 = "Under $5";       	
    	//if($scope.item_being_edited.price > 5) $scope.isOver5 = "OVER $5";       
    
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
    	$scope.log("Will save eventually", '');
      //$scope.isOver5 = "Under $5";       	
    	//if($scope.item_being_edited.price > 5) $scope.isOver5 = "OVER $5";        
    };
    
    $scope.test = function() {
      // Ternary if is better
    
      
    
      if ($scope.passw1 !== $scope.passw2) {
        $scope.error = true;
      } 
      else {
        $scope.error = false;
      }
      
      $scope.incomplete = false;
      if ($scope.edit && (!$scope.fName.length || !$scope.lName.length || !$scope.passw1.length || !$scope.passw2.length)) {
           $scope.incomplete = true;
      }
      
    };
        
  }
);   
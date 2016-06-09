'use strict';

describe('Controller: CustomerDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('applicationToGoApp'));

  var CustomerDetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CustomerDetailCtrl = $controller('CustomerDetailCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CustomerDetailCtrl.awesomeThings.length).toBe(3);
  });
});

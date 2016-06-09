'use strict';

describe('Service: customersFactory', function () {

  // load the service's module
  beforeEach(module('applicationToGoApp'));

  // instantiate service
  var customersFactory;
  beforeEach(inject(function (_customersFactory_) {
    customersFactory = _customersFactory_;
  }));

  it('should do something', function () {
    expect(!!customersFactory).toBe(true);
  });

});

'use strict';

/**
 * @ngdoc function
 * @name applicationToGoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the applicationToGoApp
 */
angular.module('applicationToGoApp')
  .controller('MainCtrl', function () {
    console.log("Main is here.");
    
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

  });

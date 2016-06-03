'use strict';

/**
 * @ngdoc directive
 * @name applicationToGoApp.directive:formatSsn
 * @description
 * # formatSsn
 */

var customSsnModule = angular.module("customSsnModule", [])

customSsnModule.directive('ssnInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('formatSsnFilter')(value, false));
            };

            // This runs when we update the ssn input
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('formatSsnFilter')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
});

customSsnModule.filter('formatSsnFilter', function() {
	    /* 
	    Format ssn as: xxx-xx-xxxx
	    */
	    
	    return function (inputValue) {
		    /* 
		    @param {inputValue | String} inputValue - Input that will be formatted as SSN
		    Returns formatted inputValue: ###-##-####
		    	if inputValue.length < 4: ###-__-____
		    	else if inputValue.length < 6: ###-##-____
		    	else if inputValue.length > 6: ###-##-x
		    */
	        if (!inputValue) {
	        	return '';
	        }

	        inputValue = String(inputValue);

	        // Will return formattedNumber. 
	        var formattedNumber = inputValue;

			var ssnStart = inputValue.substring(0,3);
			var ssnMiddle = inputValue.substring(3, 5);
			var ssnEnd = inputValue.substring(5, 9);	

			var inputLength = inputValue.length;

			if(inputLength < 4) {
				formattedNumber = ssnStart + "-__-____";
			}
			else if(inputLength > 3 && inputLength < 6) {
				formattedNumber = ssnStart + "-" + ssnMiddle + "-____";
			}
			else {
				formattedNumber = ssnStart + "-" + ssnMiddle + "-" + ssnEnd;
			}			

			return formattedNumber;
	    };
	});	
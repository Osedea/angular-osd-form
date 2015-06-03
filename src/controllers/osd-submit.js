(function () {

    // @ngInject
    function OsdSubmitCtrl($rootScope, $scope, lodash) {
        var self = this;
        var ngFormCtrl = null;

        self.attempted = false;
        self.validators = [];

        /**
         * Listens for the osdReset event. This sets
         * the 'attempted' state of the form to false.
         */
        $scope.$on('osdReset', function (event, data) {
            self.setAttempted(false);
        });

        /**
         * Listens for the osdValidate event. This forces
         * validation of the form and sets the 'osdValid'
         * attribute on ngFormCtrl.
         *
         */
        $scope.$on('osdValidate', function (event, data) {
            self.validateForm();
        });

        /**
         * Broadcasts osdInvalid event. This occurs
         * when a form submission is attempted and the
         * form is invalid.
         *
         */
        self.onInvalid = function () {
            $rootScope.$broadcast('osdInvalid', ngFormCtrl);
        };

        /**
         * Adds a validator to the list of validators.
         * Validators can also be added through the 'validator' attribute
         * in the osdError directive.
         *
         * @param attr
         * @param validator
         */
        self.addFieldValidator = function (attr, validator) {
            if(!ngFormCtrl[attr]) {
                ngFormCtrl[attr] = { $error: {} };
            }

            ngFormCtrl[attr].$error.validator = false;
            self.validators.push({attr: attr, fn: validator});
        };

        /**
         * Loops through all validators, sets form.[attr].$error.validator = false
         * if validator fails. Returns false if any validator fails.
         *
         * @returns {boolean}
         */
        self.validateFields = function () {
            var result = true;

            lodash.forEach(self.validators, function (validator) {
                if (!validator.fn({key: validator.attr})) {
                    ngFormCtrl[validator.attr].$error.validator = true;
                    result = false;
                }
            });

            return result;
        };

        /**
         * Checks if an error should be displayed for a specific field.
         * Errors will only display when a submission has been attempted.
         * Checks if either a validator fails, or if an angular form
         * validation fails.
         *
         * @param attr
         * @param errorType
         * @returns {boolean}
         */
        self.fieldShowsError = function (attr, errorType) {
            // If submit has not been attempted, don't show an error
            if (!self.attempted) {
                return false;
            }

            if (errorType !== 'validator') {
                return ngFormCtrl[attr] &&
                        ngFormCtrl[attr].$error &&
                        lodash.has(ngFormCtrl[attr].$error, errorType) &&
                        ngFormCtrl[attr].$error[errorType];
            }

            // Loop through validators and check for matching attribute. If
            // attribute matches, check if validator passes.
            return lodash.some(self.validators, function (validator) {
                if (validator.attr !== attr) {
                    return false;
                }
                var validatorSuccess = validator.fn({ key: attr });

                ngFormCtrl[validator.attr].$error.validator = !validatorSuccess;

                return !validatorSuccess;
            });
        };

        self.validateForm = function () {
            var result = self.validateFields() && ngFormCtrl.$valid;

            ngFormCtrl.osdValid = result;

            return result;
        };

        self.setAttempted = function (attempted) {
            self.attempted = attempted;
        };

        self.setNgFormCtrl = function (ctrl) {
            ngFormCtrl = ctrl;
        };

        self.getNgFormCtrl = function () {
            return ngFormCtrl;
        };
    }

    angular.module('osdForm')
        .controller('OsdSubmitCtrl', OsdSubmitCtrl);
}());

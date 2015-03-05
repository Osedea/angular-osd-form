(function() {
    function osdSubmit() {
        return {
            restrict: 'A',

            require: [
                'osdSubmit',
                '?form'
            ],

            scope: {
                osdSubmit: '&',
            },

            controller: ['$rootScope', '$scope', function($rootScope, $scope) {
                var self = this;
                var ngFormCtrl = null;

                self.attempted = false;
                self.validators = [];

                /**
                 * Listens for the osdReset event. This sets
                 * the 'attempted' state of the form to false.
                 */
                $scope.$on('osdReset', function(event, data) {
                    self.setAttempted(false);
                });

                /**
                 * Listens for the osdValidate event. This forces
                 * validation of the form and sets the 'osdValid'
                 * attribute on ngFormCtrl.
                 *
                 */
                $scope.$on('osdValidate', function(event, data) {
                    self.validateForm();
                });


                /**
                 * Broadcasts osdInvalid event. This occurs
                 * when a form submission is attempted and the
                 * form is invalid.
                 *
                 */
                self.onInvalid = function() {
                    $rootScope.$broadcast('osdInvalid', ngFormCtrl);
                };

                /**
                 * Adds a validator to the list of validators.
                 * Validators can be added through the 'validator' attribute
                 * in the osdError directive.
                 *
                 * @param attr
                 * @param validator
                 */
                self.addFieldValidator = function(attr, validator) {
                    self.validators.push({attr: attr, fn: validator});
                };

                /**
                 * Loops through all validators, sets form.[attr].$error.validator = false
                 * if validator fails. Returns false if any validator fails.
                 *
                 * @returns {boolean}
                 */
                self.validateFields = function() {
                    var result = true;

                    self.validators.forEach(function(validator) {
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
                 * Checks if either a 'validator' fails, or if a basic form
                 * validation fails.
                 *
                 * @param attr
                 * @param errorType
                 * @returns {boolean}
                 */
                self.fieldShowsError = function(attr, errorType) {
                    if (!self.attempted || (errorType && !ngFormCtrl[attr].$error[errorType])) return false;

                    var validatorFailed = self.validators.some(function(validator) {
                        if (validator.attr !== attr) return false;

                        var validatorSuccess = validator.fn({key: attr});

                       ngFormCtrl[validator.attr].$error.validator = !validatorSuccess;

                        return !validatorSuccess;
                    });

                    return validatorFailed || ngFormCtrl[attr].$invalid;
                };

                self.validateForm = function() {
                    var result =  self.validateFields() && ngFormCtrl.$valid;

                    ngFormCtrl.osdValid = result;

                    return result;
                };

                self.setAttempted = function(attempted) {
                    self.attempted = attempted;
                };

                self.setNgFormCtrl = function(ctrl) {
                    ngFormCtrl = ctrl;
                };
            }],

            compile: function(cElement, cAttributes, transclude) {
                return {

                    pre: function(scope, formElement, attrs, ctrls) {
                        var submitCtrl = ctrls[0];
                        var formCtrl = ctrls[1];

                        submitCtrl.setNgFormCtrl(formCtrl);

                        scope.osd = scope.osd || {};
                        scope.osd[attrs.name] = submitCtrl;
                    },

                    post: function(scope, formElement, attrs, ctrls) {
                        var submitCtrl = ctrls[0];
                        var formCtrl = ctrls[1];

                        formElement.bind('submit', function(event) {
                            submitCtrl.setAttempted(true);

                            if (!submitCtrl.validateForm()) {
                                submitCtrl.onInvalid();

                                if (!scope.$$phase) scope.$apply();

                                return false;
                            }

                            scope.osdSubmit();
                            scope.$apply();
                        });
                    }
                };
            }
        };
    }

    function osdField() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,

            scope: {
                attr: '@',
            },

            template:   '<div class="form-group" ng-class="{ \'has-error\': showError() }">' +
                            '<div ng-transclude></div>' +
                        '</div>',

            require: '^osdSubmit',

            controller: ['$scope', function($scope) {
                var self = this;

                self.getAttr = function() {
                    return $scope.attr;
                };
            }],

            link: function($scope, $element, $attrs, $ctrl) {
                $scope.showError = function() {
                    return $ctrl.fieldShowsError($scope.attr, $scope.type);
                };
            },
        };
    }

    function osdError() {
        return {
            restrict: 'E',
            replace: true,

            scope: {
                attr: '@',
                errorType: '@',
                msg: '@',
                validator: '&',
            },

            template: '<span class="help-block" ng-show="showError()">{{ msg }}</span>',

            require: [
                '^osdField',
                '^osdSubmit',
            ],

            link: function($scope, $element, $attrs, $ctrl) {
                var fieldCtrl = $ctrl[0];
                var submitCtrl = $ctrl[1];

                // Create vars so they aren't cleared during $digest
                var attr = $scope.attr || fieldCtrl.getAttr();
                var type = $scope.errorType || 'required';

                if ($attrs.validator) {
                    submitCtrl.addFieldValidator(attr, $scope.validator);
                    type = 'validator';
                }

                $scope.showError = function() {
                    return submitCtrl.fieldShowsError(attr, type);
                };
            }
        };
    }

    angular.module('osdForm', [])
        .directive('osdError', osdError)
        .directive('osdField', osdField)
        .directive('osdSubmit', osdSubmit);
})();

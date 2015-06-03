(function () {

    angular.module('osdForm', ['ngLodash']);

})();

(function () {

    // @ngInject
    function OsdFormConfig() {
        var self = this;
        self.config = {
            useBootstrap: true,
            useSemanticUi: false
        };

        self.useBootstrap = function () {
            self.config.useBootstrap = true;
            self.config.useSemanticUi = !self.config.useBootstrap;
        };

        self.useSemanticUi = function () {
            self.config.useSemanticUi = true;
            self.config.useBootstrap = !self.config.useSemanticUi;
        };

        self.$get = function () {
            return self;
        };

        return self;
    }

    angular.module('osdForm')
        .provider('OsdFormConfig', OsdFormConfig);
})();

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

(function () {

    // @ngInject
    function OsdFieldCtrl($scope, lodash) {
        var self = this;

        $scope.submitCtrl = null;

        self.errorTypes = [];

        self.getAttr = function () {
            return $scope.attr;
        };

        self.addErrorType = function (type) {
            self.errorTypes.push(type);
        };

        // Loop through all child osdError directives, checking for errors
        $scope.showError = function () {
            return lodash.some(self.errorTypes, function (type) {
                return $scope.submitCtrl.fieldShowsError($scope.attr, type);
            });
        };
    }

    angular.module('osdForm')
        .controller('OsdFieldCtrl', OsdFieldCtrl);
}());

(function () {

    // @ngInject
    function osdValidators() {
        var self = this;

        // Returns true if name is a validator defined on osdValidators
        self.isBuiltInValidator = function (name) {
            return self.hasOwnProperty(name);
        };

        // Returns true if the list of attributes are all strictly equal
        self.strictMatchValidator = function (ngFormCtrl, attr, attrs) {
            return function () {
                return attrs.every(function (a) {
                    return ngFormCtrl[a].$viewValue === ngFormCtrl[attrs[0]].$viewValue;
                });
            };
        };

        // Returns true if the list of attributes are sorted in increasing order
        self.strictIncreaseValidator = function (ngFormCtrl, attr, attrs) {
            return function () {
                for (var i = 1; i < attrs.length; i++) {
                    if (ngFormCtrl[attrs[i]].$viewValue <= ngFormCtrl[attrs[i - 1]].$viewValue) {
                        return false;
                    }
                }

                return true;
            };
        };

        // Returns true if the field date is in the past.
        self.pastDateValidator = function (ngFormCtrl, attr) {
            return function () {
                var currentDate = (new Date()).getTime();
                var fieldDate = (new Date(ngFormCtrl[attr].$viewValue)).getTime();

                return fieldDate < currentDate;
            };
        };

        // Returns true if the field date is in the future.
        self.futureDateValidator = function (ngFormCtrl, attr) {
            return function () {
                var currentDate = (new Date()).getTime();
                var fieldDate = (new Date(ngFormCtrl[attr].$viewValue)).getTime();

                return fieldDate > currentDate;
            };
        };

        return self;
    }

    angular.module('osdForm')
        .service('osdValidators', osdValidators);
})();

(function () {

    // @ngInject
    function osdError(OsdFormConfig, osdValidators) {
        return {
            restrict: 'EA',
            replace: true,

            scope: {
                attrs: '=',
                errorType: '@',
                msg: '@',
                validator: '&'
            },

            template: OsdFormConfig.config.useBootstrap ?
                '<span class="help-block" ng-if="showError()">{{ $parent.msg }}</span>' :
                '<span class="ui red pointing prompt label transition visible" ng-if="showError()">{{ $parent.msg }}</span>',

            require: [
                '^osdField',
                '^osdSubmit',
                '^?form'
            ],

            link: function ($scope, $element, $attrs, $ctrl) {
                var fieldCtrl = $ctrl[0];
                var submitCtrl = $ctrl[1];
                var ngFormCtrl = $ctrl[2];

                var attr = $scope.attr || fieldCtrl.getAttr();
                var type = $scope.errorType || 'required';

                var validatorName;

                $scope.showError = function () {
                    if (type == 'validator') {
                        return submitCtrl.attempted && !$scope.validator({key: attr });
                    }

                    return submitCtrl.fieldShowsError(attr, type);
                };


                if (!$attrs.validator) {
                    return fieldCtrl.addErrorType(type);
                }

                type = 'validator';
                fieldCtrl.addErrorType(type);
                validatorName = $attrs.validator.replace('()', '');

                if (osdValidators.isBuiltInValidator(validatorName)) {
                    $scope.validator = osdValidators[validatorName](ngFormCtrl, attr, $scope.attrs);
                }

                submitCtrl.addFieldValidator(attr, $scope.validator);
            }
        };
    }

    angular.module('osdForm')
        .directive('osdError', osdError);
})();

(function () {

    // @ngInject
    function osdField(OsdFormConfig) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,

            scope: {
                attr: '@'
            },

            template: OsdFormConfig.config.useBootstrap ?
                '<div class="form-group" ng-class="{ \'has-error\': showError() }">' +
                    '<div ng-transclude></div>' +
                '</div>' :
                '<div class="field" ng-class="{ \'error\': showError() }">' +
                    '<div ng-transclude></div>' +
                '</div>',

            require: '^osdSubmit',
            controller: 'OsdFieldCtrl',

            link: function($scope, $elem, $attrs, $ctrl) {
                $scope.submitCtrl = $ctrl;
            }
        };
    }

    angular.module('osdForm')
        .directive('osdField', osdField);
})();

(function () {

    function osdSubmit() {
        return {
            restrict: 'A',

            require: [
                'osdSubmit',
                '?form'
            ],

            scope: {
                osdSubmit: '&'
            },

            controller: 'OsdSubmitCtrl',

            compile: function (cElement, cAttributes, transclude) {
                return {

                    pre: function (scope, formElement, attrs, ctrls) {
                        var submitCtrl = ctrls[0];
                        var formCtrl = ctrls[1];

                        submitCtrl.setNgFormCtrl(formCtrl);

                        scope.osd = scope.osd || {};
                        scope.osd[attrs.name] = submitCtrl;
                    },

                    post: function (scope, formElement, attrs, ctrls) {
                        var submitCtrl = ctrls[0];

                        formElement.bind('submit', function (event) {
                            submitCtrl.setAttempted(true);

                            if (!submitCtrl.validateForm()) {
                                submitCtrl.onInvalid();

                                if (!scope.$$phase) scope.$apply();

                                return false;
                            }

                            scope.osdSubmit();
                            if (!scope.$$phase) scope.$apply();
                        });
                    }
                };
            }
        };
    };

    angular.module('osdForm')
        .directive('osdSubmit', osdSubmit);
})();

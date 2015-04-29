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

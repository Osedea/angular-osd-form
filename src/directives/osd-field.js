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

            template: OsdFormConfig.useBootstrap ?
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

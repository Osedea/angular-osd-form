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

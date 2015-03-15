describe('osdValidators: ', function () {
    var $rootScope, $scope, $ctrl, ngFormCtrl;

    beforeEach(module('osdForm'));

    beforeEach(inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $ctrl = $controller('OsdSubmitCtrl', {
            $rootScope: $rootScope,
            $scope: $scope
        });
    }));

    beforeEach(inject(function ($compile) {
        $element =
            '<form name="osdForm" osd-submit="">' +
                '<osd-field attr="firstName">' +
                    '<label for="firstName">First Name</label>' +
                    '<input name="firstName" ng-model="firstName" required/>'+
                    '<osd-error msg="First name required"></osd-error>' +
                '</osd-field>' +
                '<osd-field attr="lastName">' +
                    '<label for="lastName">Last Name</label>' +
                    '<input name="lastName" ng-model="lastName" required/>'+
                    '<osd-error validator="strictMatchValidator()" attrs="[\'firstName\', \'lastName\']" msg="Fields did not match"></osd-error>' +
                '</osd-field>' +
            '</form>';

        $scope.size = 100;

        element = $compile($element)($scope);

        $scope.$digest();

        ngFormCtrl = $scope.osdForm;
    }));


    describe('strictMatchValidator: ', function () {
        it('sets validator error to false if the listed attributes are all strictly equal (===)', function () {
            $ctrl.setNgFormCtrl(ngFormCtrl);
            $ctrl.setAttempted(true);

            $scope.firstName = 'Angus';
            $scope.lastName = 'Angus';

            $scope.$apply();

            $rootScope.$broadcast('osdValidate');

            expect(ngFormCtrl.lastName.$error.validator).toBe(false);
        });

        it('sets validator error to true if the listed attributes are not all strictly equal (===)', function () {
            $ctrl.setNgFormCtrl(ngFormCtrl);
            $ctrl.setAttempted(true);

            $scope.firstName = 'Angus';
            $scope.lastName = 'MacIsaac';

            $scope.$apply();

            $rootScope.$broadcast('osdValidate');

            expect(ngFormCtrl.lastName.$error.validator).toBe(true);
        });
    });
});

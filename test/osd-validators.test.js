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
                    '<input name="firstName" ng-model="firstName" required/>'+
                    '<osd-error msg="First name required"></osd-error>' +
                '</osd-field>' +
                '<osd-field attr="lastName">' +
                    '<input name="lastName" ng-model="lastName" required/>'+
                    '<osd-error validator="strictMatchValidator()" attrs="[\'firstName\', \'lastName\']" msg=""></osd-error>' +
                '</osd-field>' +
                '<osd-field attr="countOne">' +
                    '<input name="countOne" ng-model="countOne"/>'+
                    '<osd-error msg="First name required"></osd-error>' +
                '</osd-field>' +
                    '<osd-field attr="countTwo">' +
                    '<input name="countTwo" ng-model="countTwo" required/>'+
                    '<osd-error validator="strictIncreaseValidator" attrs="[\'countOne\', \'countTwo\']" msg=""></osd-error>' +
                '</osd-field>' +
            '</form>';

        $scope.size = 100;

        element = $compile($element)($scope);

        $scope.$digest();

        ngFormCtrl = $scope.osdForm;

        $ctrl.setNgFormCtrl(ngFormCtrl);
        $ctrl.setAttempted(true);
    }));


    describe('strictMatchValidator: ', function () {
        it('sets validator error to false if the listed attributes are all strictly equal (===)', function () {
            $scope.firstName = 'Angus';
            $scope.lastName = 'Angus';

            $scope.$apply();

            $rootScope.$broadcast('osdValidate');

            expect(ngFormCtrl.lastName.$error.validator).toBe(false);
        });

        it('sets validator error to true if the listed attributes are not all strictly equal (===)', function () {
            $scope.firstName = 'Angus';
            $scope.lastName = 'MacIsaac';

            $scope.$apply();

            $rootScope.$broadcast('osdValidate');

            expect(ngFormCtrl.lastName.$error.validator).toBe(true);
        });
    });

    describe('strictIncreaseValidator: ', function () {
        it('sets validator error to false if the listed attributes are in strict increasing order', function () {
            $scope.countOne = 10;
            $scope.countTwo = 20;

            $scope.$apply();

            $rootScope.$broadcast('osdValidate');

            expect(ngFormCtrl.countTwo.$error.validator).toBe(false);
        });

        it('sets validator error to true if the listed attributes are not in strict increasing order', function () {
            $scope.countOne = 20;
            $scope.countTwo = 10;

            $scope.$apply();

            $rootScope.$broadcast('osdValidate');

            expect(ngFormCtrl.countTwo.$error.validator).toBe(true);
        });

        it('sets validator error to true if the listed attributes are equal', function () {
            $scope.countOne = 10;
            $scope.countTwo = 10;

            $scope.$apply();

            $rootScope.$broadcast('osdValidate');

            expect(ngFormCtrl.countTwo.$error.validator).toBe(true);
        });
    });
});

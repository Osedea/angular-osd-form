describe('OsdSubmitCtrl: ', function () {
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
                    '<osd-error attr="firstName" msg="First name required"></osd-error>' +
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

    it('can set attempted', function () {
        $ctrl.setAttempted(true);

        expect($ctrl.attempted).toBe(true);
    });

    it('can set ngFormCtrl', function () {
        $ctrl.setNgFormCtrl(ngFormCtrl);

        expect($ctrl.getNgFormCtrl()).toBe(ngFormCtrl);
    });

    it('emits an event when onInvalid is called', function () {
        spyOn($rootScope, '$broadcast');

        $ctrl.setNgFormCtrl(ngFormCtrl);

        $ctrl.onInvalid();

        expect($rootScope.$broadcast).toHaveBeenCalledWith('osdInvalid', ngFormCtrl);
    });

    it('resets the attempted state when osdReset is called', function () {
        $ctrl.attempted = true;

        $rootScope.$broadcast('osdReset');

        expect($ctrl.attempted).toBe(false);
    });

    it('runs the validation when osdValidate is called', function () {
        spyOn($ctrl, 'validateForm');

        $rootScope.$broadcast('osdValidate');

        expect($ctrl.validateForm).toHaveBeenCalled();
    });

    it('adds a validator when one is passed to the addValidator function', function () {
        $ctrl.setNgFormCtrl(ngFormCtrl);

        var attr = "firstName";
        var validator = function () {
            return true;
        };

        $ctrl.addFieldValidator(attr, validator);

        expect($ctrl.validators[0].attr).toBe(attr);
        expect($ctrl.validators[0].fn).toBe(validator);
    });

    it('sets required error to true if a required field is empty and the form is submitted', function() {
        $ctrl.setNgFormCtrl(ngFormCtrl);

        $rootScope.$broadcast('osdValidate');

        expect(ngFormCtrl.firstName.$error.required).toBe(true);
    });

    describe('validateFields', function() {
        it('return false if there is a validator that returns false', function() {
            $ctrl.setNgFormCtrl(ngFormCtrl);

            $ctrl.addFieldValidator("firstName", function() { return false });

            $rootScope.$broadcast('osdValidate');

            expect($ctrl.validateFields()).toBe(false);
        });

        it('returns true if all validators return true', function() {
            $ctrl.setNgFormCtrl(ngFormCtrl);

            $ctrl.addFieldValidator("firstName", function() { return true; });
            $ctrl.addFieldValidator("lastName", function() { return true; });

            $rootScope.$broadcast('osdValidate');

            expect($ctrl.validateFields()).toBe(true);
        });
    });

    describe('validateForm', function() {
        it('return false if any fields are false', function() {
            $ctrl.setNgFormCtrl(ngFormCtrl);

            $rootScope.$broadcast('osdValidate');

            expect($ctrl.validateForm()).toBe(false);
        });

        it('returns true if all validators return true', function() {
            $ctrl.setNgFormCtrl(ngFormCtrl);

            $scope.firstName = "Angus";
            $scope.lastName = "Angus";

            $scope.$apply();

            $rootScope.$broadcast('osdValidate');

            expect($ctrl.validateForm()).toBe(true);
        });
    });
});

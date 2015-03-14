describe('Angular OSD Form: ', function() {
    var $rootScope, $scope, $ctrl;

    beforeEach(module('osdForm'));

    beforeEach(inject(function(_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $ctrl = $controller('OsdSubmitCtrl', {
            $rootScope: $rootScope,
            $scope: $scope
        });
    }));

    it('emits an event when onInvalid is called', function() {
        spyOn($rootScope, '$broadcast');

        var ngFormCtrl = { fake: "test" };

        $ctrl.setNgFormCtrl(ngFormCtrl);

        $ctrl.onInvalid();

        expect($rootScope.$broadcast).toHaveBeenCalledWith('osdInvalid', ngFormCtrl);
    });

    it('resets the attempted state when osdReset is called', function() {
        $ctrl.attempted = true;

        $rootScope.$broadcast('osdReset');

        expect($ctrl.attempted).toBe(false);
    });

    it('runs the validation when osdValidate is called', function() {
        spyOn($ctrl, 'validateForm');

        $rootScope.$broadcast('osdValidate');

        expect($ctrl.validateForm).toHaveBeenCalledWith('osdInvalid', ngFormCtrl);
    });
});

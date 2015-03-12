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

        $ctrl.onInvalid();

        expect($rootScope.$broadcast).toHaveBeenCalledWith('osdInvalid', null);
    });
});
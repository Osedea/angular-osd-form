(function () {

    // @ngInject
    function OsdFieldCtrl($scope) {
        var self = this;

        $scope.submitCtrl = null;

        self.errorTypes = [];

        self.getAttr = function () {
            return $scope.attr;
        };

        self.addErrorType = function(type) {
            self.errorTypes.push(type);
        };

        // Loop through all child osdError directives, checking for errors
        $scope.showError = function () {
            return self.errorTypes.some(function(type) {
                return $scope.submitCtrl.fieldShowsError($scope.attr, type);
            });
        };
    }

    angular.module('osdForm')
        .controller('OsdFieldCtrl', OsdFieldCtrl);
})();

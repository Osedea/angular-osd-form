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

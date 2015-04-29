(function () {

    // @ngInject
    function OsdFormConfig() {
        var self = this;
        self.config = {
            useBootstrap: true,
            useSemanticUi: false
        };

        self.useBootstrap = function () {
            self.config.useBootstrap = true;
            self.config.useSemanticUi = !self.config.useBootstrap;
        };

        self.useSemanticUi = function () {
            self.config.useSemanticUi = true;
            self.config.useBootstrap = !self.config.useSemanticUi;
        };

        self.$get = function () {
            return self;
        };

        return self;
    }

    angular.module('osdForm')
        .provider('OsdFormConfig', OsdFormConfig);
})();

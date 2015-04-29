(function () {

    // @ngInject
    function OsdFormConfig() {
        var self = this;
        var config = {
            useBootstrap: true,
            useSemanticUi: false
        };

        self.useBootstrap = function () {
            config.useBootstrap = true;
            config.useSemanticUi = !config.useBootstrap;
        };

        self.useSemanticUi = function () {
            config.useSemanticUi = true;
            config.useBootstrap = !config.useSemanticUi;
        };

        self.$get = function () {
            return config;
        };

        return self;
    }

    angular.module('osdForm')
        .provider('OsdFormConfig', OsdFormConfig);
})();

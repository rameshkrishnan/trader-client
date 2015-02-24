(function() {
    'use strict';

    angular
        .module('app.user')
        .run(execute);

    execute.$inject = ['$rootScope'];

    /* @Inject*/
    function execute($rootScope) {

        $rootScope.$watch(function() {
            return sessionStorage.getItem('trader_id');
        }, function (newValue, oldValue) {
            if ((oldValue !== null && newValue !== oldValue) || newValue === null) {
                $rootScope.$broadcast('userLoggedOut');
            }
        });
    }

})();
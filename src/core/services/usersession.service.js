(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('userSessionService', userSessionService);

    userSessionService.$inject = ['exception', '$state', 'userService'];

    /* @ngInject */
    function userSessionService(exception, $state, userService) {

        if (typeof Storage === undefined) {
            exception.catcher('Failed to create user session')('Storage not supported by the browser');
            $state.go('login');
        }

        var service = {
            clearSession: clearSession,
            getUsername: getUsername,
            getUserId: getUserId,
            setUserId: setUserId
        };

        return service;

        function clearSession() {
            sessionStorage.removeItem('trader_id');
            sessionStorage.removeItem('trader_name');
        }

        function getUsername() {
            return sessionStorage.getItem('trader_name');
        }

        function getUserId() {
            return sessionStorage.getItem('trader_id');
        }

        function setUserId(id) {
            var user = userService.get(id);
            if ( user !== null ) {
                sessionStorage.setItem('trader_id', user.id);
                sessionStorage.setItem('trader_name', user.name);
                return 1;
            } else {
                clearSession();
                return 0;
            }
        }
    }
})();
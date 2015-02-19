(function(){
    'use strict';
    
    angular
        .module('app.core')
        .factory('userSessionService', userSessionService);
        
    userSessionService.$inject = ['exception', '$location', 'userService'];
    
    /* @ngInject */
    function userSessionService(exception, $location, userService) {
        
        if(typeof Storage === undefined) {
            exception.catcher('Failed to create user session')('Storage not supported by the browser');
            $location.path('/');
        }

        var service = {
            getUsername: getUsername,
            getUserId: getUserId,
            setUserId: setUserId
        };
        
        return service;
        
        function getUsername() {
            return sessionStorage.getItem('trader_name');
        }
        
        function getUserId() {
            return sessionStorage.getItem('trader_id');
        }

        function setUserId(id) {
            return userService.get(id).then(function(user){
                if(user !== null) {
                    sessionStorage.setItem('trader_id', user.id);
                    sessionStorage.setItem('trader_name', user.name);
                    return 1;
                } else {
                    sessionStorage.removeItem('trader_id');
                    sessionStorage.removeItem('trader_name');
                }
                return 0;
            });
        }

    }
})();
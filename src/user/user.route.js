(function(){
    'use strict';
    
    angular
        .module('app.user')
        .run(appRun);
        
    appRun.$inject = ['routerHelper'];
    
    /* @ngInject */
    function appRun(routerHelper){
        routerHelper.configureStates(getStates());
    }
    
    function getStates(){
        return [
            {
                state: 'login',
                config: {
                    url: '/login',
                    templateUrl: 'user/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    title: 'Login',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-login"></i> Login',
                        loginRequired: false
                    }
                }
            }
        ];
    }

})();
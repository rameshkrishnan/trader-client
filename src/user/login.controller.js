(function(){
    'use strict';
    
    angular
        .module('app.user')
        .controller('LoginController', LoginController);
        
    LoginController.$inject = ['$scope', '$location', 'userService', 'userSessionService', 'logger'];
    
    /* @ngInject */
    function LoginController($scope, $location, userService, userSessionService, logger) {
        var vm = this;
        
        vm.selectUserId = null;
        vm.users = null;
        vm.onSubmit = onSubmit;
        
        activate();
        
        function activate() {
            return getUsers().then(function(){
                logger.info('Login View Activated');
            })
        }
        
        function getUsers() {
            return userService.getAll().then(function(data){
                vm.users = data;
                return vm.users;
            })
        }
        
        function onSubmit() {
            userSessionService.setUserId(vm.selectUserId).then(function(success) {
                if(success) {
                    $scope.$emit('userLoggedIn');
                    logger.info('User ' + vm.selectUserId + ' loggedin.');
                    $location.path('/');                    
                }
            });            
        }
    }
})();
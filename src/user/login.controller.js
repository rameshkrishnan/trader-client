(function() {
    'use strict';

    angular
        .module('app.user')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$state', 'userService', 'userSessionService', 'logger'];

    /* @ngInject */
    function LoginController($scope, $state, userService, userSessionService, logger) {
        var vm = this;

        vm.selectUserId = null;
        vm.users = null;
        vm.onSubmit = onSubmit;

        activate();

        function activate() {
            return getUsers().then(function() {
                logger.info('Login View Activated');
            });
        }

        function getUsers() {
            return userService.getAll().then(function(data) {
                vm.users = data;
                return vm.users;
            });
        }

        function onSubmit() {
            var success = userSessionService.setUserId(vm.selectUserId);
            if (success) {
                $scope.$emit('userLoggedIn');
                logger.info('User ' + vm.selectUserId + ' loggedin.');
                $state.go('dashboard.table');
            }
        }
    }
})();
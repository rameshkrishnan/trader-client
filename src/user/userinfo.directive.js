(function() {
    'use strict';

    angular
        .module('app.user')
        .directive('userinfo', userInfoDirective);

    userInfoDirective.$inject = ['userSessionService', '$state'];

    /* @ngInject */
    function userInfoDirective(userSessionService, $state) {

        var directive = {
            restrict: 'E',
            templateUrl: 'src/user/userinfo.html',
            link: link,
            controller: UserInfoController,
                controllerAs: 'dvm',
                bindToController: true
        };

        return directive;

        function link(scope) {
            scope.$on('userLoggedIn', function() {
                scope.dvm.username = userSessionService.getUsername();
            });
            scope.$on('userLoggedOut', function() {
                scope.dvm.username = null;
                $state.go('login');
            });
        }

    }

    UserInfoController.$inject = ['userSessionService'];

    /* @ngInject */
    function UserInfoController(userSessionService) {

        var dvm = this;

        dvm.signout = function() {
            userSessionService.clearSession();
        };
        dvm.username = userSessionService.getUsername();
    }

})();
/* jshint -W024 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('userService', userService);

    userService.$inject = ['$http', '$location', '$filter', 'exception', 'api', 'logger'];
    /* @ngInject */
    function userService($http, $location, $filter, exception, api, logger) {
        
        var users = null,
            service = {
                getAll: getAllUsers,
                get: get
            };

        return service;
        
        function get(id) {
            return $filter('getBy')('id', id, users);
        }
        
        function getAllUsers() {
            return $http.get(api + '/users')
                .then(getComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for userService.getAllUsers')(message);
                    $location.url('/login');
                });

            function getComplete(data) {
                logger.info('Pulled User List from Server.');
                users = data.data;
                return users;
            }
        }
    }
})();

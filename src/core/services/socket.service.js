(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('socketService', socketService);

    socketService.$inject = ['$rootScope', 'api', 'io'];

    /* $ngInject */
    function socketService($rootScope, api, io) {

        var socket = io(api),
            service = {
                on: on,
                remove: removeSocket
            };

        return service;

        function on(eventName, callback) {
            socket.on(eventName, callback);
        }

        function removeSocket() {
            socket.removeAllListeners();
        }
    }

})();
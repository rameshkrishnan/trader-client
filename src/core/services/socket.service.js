(function() {
	'use strict';

	angular
		.module('app.core')
		.factory('socketService', socketService);

	socketService.$inject = ['$rootScope', 'api'];

	/* $ngInject */
	function socketService($rootScope, api) {
		var socket = io(api);

		var service = {
			on: on,
			remove: removeSocket
		}

		return service;

		function on(eventName, callback) {
			socket.on(eventName, callback);
		}
		function removeSocket(){
			socket.removeAllListeners();
		}	
	}
})();
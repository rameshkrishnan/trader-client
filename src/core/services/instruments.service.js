(function(){
	'use strict';

	angular
		.module('app.core')
		.factory('instrumentService', instrumentService);

	instrumentService.$inject = ['api', '$http', 'exception'];

	/* @ngInject */
	function instrumentService(api, $http, exception) {

		var url = api + '/instruments',
			service = {
				get: get
			};

		return service;

		function get() {
			return $http.get(url)
				.then(getComplete)
				.catch(function(message) {
                    exception.catcher('XHR Failed for orderService.deleteAll')(message)
                });

            function getComplete(data) {
                return data.data;
            }
		}

	}

})();
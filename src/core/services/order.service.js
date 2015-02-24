/* jshint -W024 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('orderService', orderService);

    orderService.$inject = ['$http', 'exception', 'api', 'userSessionService', 'logger', '$filter','instrumentService'];
    /* @ngInject */
    function orderService($http, exception, api, userSessionService, logger, $filter,instrumentService) {
        
        var url = api + '/orders',
            service = {
                createOrder: createOrder,
                deleteAll: deleteAll,
                getAll: getAll
            };

        return service;

        function createOrder(qty) {

            instrumentService.get().then(function(instruments) {

                var userId = userSessionService.getUserId(),
                    side = ['Buy','Sell'];

                for(var i=1;i<=qty;i++) {

                    var sideIndex = random(0,1),
                        instrumentsIndex = random(0, instruments.length-1),
                        quantity = random(1000, 20000),
                        price = random(1,1000);

                    var orderData = {
                        side: side[sideIndex],
                        symbol: instruments[instrumentsIndex].symbol,
                        quantity: quantity,
                        limitPrice: price,
                        traderId: userId
                    };
                    $http.post(url, orderData)
                        .then(postComplete(i))
                        .catch(postError);
                }
            });

            function postComplete(i) {
                logger.info('Order ' + i + ' has been successfully placed to server for execution');
            }
            
            function postError(message) {
                exception.catcher('XHP Failed for orderService.createOrder')(message);
            }

        }

        function deleteAll() {
            return $http.delete(url)
                .then(getComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for orderService.deleteAll')(message);
                });

            function getComplete() {
                logger.info('All orders deleted');
            }
        }

        function getAll() {

            var userId = userSessionService.getUserId();

            return $http.get(url)
                .then(getComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for orderService.getAll')(message);
                });

            function getComplete(data) {
                return $filter('getAllBy')('traderId', userId, data.data);
            }
        }

        function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

    }
})();

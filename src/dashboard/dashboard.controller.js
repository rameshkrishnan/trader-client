(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = [ 'logger', 'orderService', 'socketService', '$filter', '$scope', '$state'];

    /* @ngInject */
    function DashboardController(logger, orderService, socketService, $filter, $scope, $state) {
        var vm = this;

        vm.orders = null;

        vm.deleteAll = deleteAll;
        vm.go = go;
        vm.refresh = refresh;
        vm.submitTrade = submitTrade;

        setEvents();
        activate();

        function activate() {
            return getOrders().then(function() {
                logger.info('Activated Dashboard View');
            });
        }

        function deleteAll() {
            orderService.deleteAll();
        }

        function getOrders() {
            return orderService.getAll().then(function(data) {
                vm.orders = data;
                return vm.orders;
            });
        }

        function go(state) {
            $state.go(state);
        }

        function refresh() {
            getOrders();
            logger.info('Orders refreshed');
        }

        function setEvents() {

            angular.element('#tradeModal').on('hidden.bs.modal', clearTradeForm);
            
            socketService.remove();
            socketService.on('allOrdersDeletedEvent', allOrdersDeletedEvent);
            socketService.on('executionCreatedEvent', executionCreatedEvent);
            socketService.on('orderCreatedEvent', orderCreatedEvent);
            socketService.on('placementCreatedEvent', placementCreatedEvent);

            function allOrdersDeletedEvent() {
                vm.orders = [];
                logger.log('allOrdersDeletedEvent');
            }
            function clearTradeForm() {
                vm.qty = null;
                angular.element('input[name="qty"]').val(null);
            }
            function executionCreatedEvent(data) {

                var index = $filter('getIndexBy')('id', data.orderId, vm.orders),
                    item = vm.orders[index];

                item.quantityExecuted += data.quantityExecuted;
                item.executionPrice = data.executionPrice;
                item.status = data.status;

                $scope.$apply();

                logger.log('executionCreatedEvent #' + data.orderId);
            }
            function orderCreatedEvent(data) {

                vm.orders.push(data);

                logger.log('orderCreatedEvent');
            }
            function placementCreatedEvent(data) {

                var index = $filter('getIndexBy')('id', data.orderId, vm.orders),
                    item = vm.orders[index];

                item.quantityPlaced += data.quantityPlaced;
                item.status = data.status;

                $scope.$apply();

                logger.log('placementCreatedEvent #' + data.orderId);
            }

        }

        function submitTrade() {
            orderService.createOrder(vm.qty);
            angular.element('#tradeModal').modal('hide');
        }
    }
})();

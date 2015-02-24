(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('trade', tradeDirective);

    tradeDirective.$inject = [];

    /* @ngInject*/
    function tradeDirective() {

        var directive = {
            restrict: 'E',
            templateUrl: 'src/core/directives/trade.html',
            controller: TradeController,
                controllerAs: 'dvm',
                bindToController: true
        };

        return directive;

    }

    TradeController.$inject = ['ngDialog', '$scope', 'orderService', '$location'];

    /* @ngInject*/
    function TradeController(ngDialog, $scope, orderService, $location) {
        var dvm = this;

        dvm.openTrade = openTrade;
        dvm.go = go;
        $scope.submitTrade = submitTrade;

        function go(path) {
            $location.path(path);
        }

        function openTrade() {
            ngDialog.open({
                template: 'tradeDialog',
                controller: TradeController,
                scope: $scope,
                className: 'ngdialog-theme-default'
            });
        }

        function submitTrade() {
            orderService.createOrder($scope.qty);
            $scope.closeThisDialog();
        }
    }

})();
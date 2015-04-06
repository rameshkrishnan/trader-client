/* jshint -W117 */
describe('DashboardController', function() {
    'use strict';

    var controller,
        scope,
        $q,
        $state,
        orderService,
        socketService,
        logger;

    beforeEach(function() {
        module('app.dashboard');
        module('app.user');
        module('app.core');
    });

    beforeEach(function () {
        orderService = {
            getAll: jasmine.createSpy(),
            deleteAll: jasmine.createSpy(),
            createOrder: jasmine.createSpy()
        };
        logger = {
            info: jasmine.createSpy(),
            log: jasmine.createSpy()
        };
        module(function ($provide) {
            $provide.value('orderService', orderService);
            $provide.value('logger', logger);
        });
    });

    beforeEach(
        inject(function (_$rootScope_, $controller, _$q_, _orderService_, _logger_, _$state_, _socketService_) {
            $q = _$q_;
            orderService = _orderService_;
            socketService = _socketService_;
            scope = _$rootScope_.$new();
            logger = _logger_;
            $state = _$state_;
            var deferred = $q.defer();
            deferred.resolve({
                data: 'orders'
            });
            orderService.getAll.and.returnValue(deferred.promise);

            controller = $controller('DashboardController', {
                $scope: scope,
                orderService: orderService,
                logger: logger,
                $state: $state
            });
            scope.vm = controller;
            scope.$digest();
        })
    );

    it('should have a scope', function () {
        expect(scope).toBeDefined();
    });

    it('should have called orderService', function() {
        expect(orderService.getAll).toHaveBeenCalled();
        expect(orderService.getAll.calls.count()).toEqual(1);
    });

    it('should have activated dashboard view', function () {
        expect(logger.info).toHaveBeenCalledWith('Activated Dashboard View');
    });

    it('should have orders object', function() {
        expect(controller.orders).toEqual({ data : 'orders' });
    });

    it('should have delete all orders functionality', function() {
        controller.deleteAll();
        expect(orderService.deleteAll).toHaveBeenCalled();
    });

    it('should have refresh functionality', function() {
        controller.refresh();
        expect(orderService.getAll.calls.count()).toEqual(2);
        expect(logger.info).toHaveBeenCalledWith('Orders refreshed');
    });

    it('should have submit function with user specified quantity to create order', function() {
        controller.qty = 5;
        controller.submitTrade();
        expect(orderService.createOrder).toHaveBeenCalledWith(5);
    });

    it('should have functionality to goto a state', function() {
        spyOn($state, 'go');
        controller.go('dashboard.chart');
        expect($state.go).toHaveBeenCalledWith('dashboard.chart');
    });

    it('should listen server event allOrdersDeletedEvent', function() {
        //socketService.emit('allOrdersDeletedEvent');
    });
});

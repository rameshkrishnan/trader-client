/* jshint -W024, -W030, -W098, -W117 */
describe('orderService', function() {
    'use strict';

    var orderService,
        userSessionService,
        instrumentService,
        $http,
        logger,
        exception,
        url = 'http://localhost:8080/orders';

    beforeEach(module('app.core'));

    beforeEach(function() {
        instrumentService = {
            get: jasmine.createSpy()
        };
        userSessionService = {
            getUserId: jasmine.createSpy()
        };
        logger = {
            info: jasmine.createSpy()
        };
        exception = {
            catcher: jasmine.createSpy()
        };

        module(function($provide) {
            $provide.value('instrumentService', instrumentService);
            $provide.value('userSessionService', userSessionService);
            $provide.value('exception', exception);
            $provide.value('logger', logger);
        });
    });

    beforeEach(
        inject(function(_$httpBackend_, _orderService_, _instrumentService_,
                        _userSessionService_, _exception_, _logger_
                        ) {
            $http = _$httpBackend_;
            orderService = _orderService_;
            userSessionService = _userSessionService_;
            instrumentService = _instrumentService_;
            exception = _exception_;
            logger = _logger_;
        })
    );

    it('should be defined', function() {
        expect(orderService).toBeDefined();
        expect(orderService.getAll).toBeDefined();
        expect(orderService.createOrder).toBeDefined();
        expect(orderService.deleteAll).toBeDefined();
    });

    it('should make HTTP GET request for orderService.getAll (Success Call)', function() {
        var actualResult,
            responseData = [
                {traderId:'AR', orders:'orders'},
                {traderId:'BR', orders:'orders'}
            ],
            expectedResult = [
                {traderId:'AR', orders:'orders'}
            ];

        $http.expectGET(url).respond(200, responseData);
        userSessionService.getUserId.and.returnValue('AR');
        orderService.getAll().then(function(data) {
            actualResult = data;
        });
        $http.flush();
        expect(actualResult).toEqual(expectedResult);
    });

    it('should make HTTP GET request for orderService.getAll (Failure Call)', function() {
        var actualResult,
            expectedCatcherLog = 'XHR Failed for orderService.getAll';

        $http.expectGET(url).respond(404, '');
        orderService.getAll().then(function(response) {
            actualResult = response;
        });
        $http.flush();
        expect(actualResult).not.toBeDefined();
        expect(exception.catcher).toHaveBeenCalledWith(expectedCatcherLog);
    });

    it('should make HTTP DELETE request for orderService.deleteAll (Success Call)', function() {
        var expectedInfoLog = 'All orders deleted';
        $http.expectDELETE(url).respond(200);
        orderService.deleteAll();
        $http.flush();
        expect(logger.info).toHaveBeenCalledWith(expectedInfoLog);
    });

    it('should make HTTP DELETE request for orderService.deleteAll (Failure Call)', function() {
        var expectedCatcherLog = 'XHR Failed for orderService.deleteAll';
        $http.expectDELETE(url).respond(404, '', {}, 'Page not found');
        orderService.deleteAll();
        $http.flush();
        expect(exception.catcher).toHaveBeenCalledWith(expectedCatcherLog);
    });

    it('should make HTTP POST request for orderService.createOrder (Success Call)', inject(function(_$q_) {
        var instruments = [
                {symbol:'AAPL', name:'Apple Inc.', lastTrade:700.23},
                {symbol:'ADBE', name:'Adobe Systems Inc.', lastTrade:33.49},
                {symbol:'AKAM', name:'Akamai Technologies Inc.', lastTrade:38.33}
            ],
            $q = _$q_,
            defered = $q.defer(),
            qty = 5,
            expectedInfoLog = 'Order ' + qty + ' has been successfully placed to server for execution',
            orderData = {
                side: 'Buy',
                symbol: 'AAPL',
                quantity: 1000,
                limitPrice: 700,
                traderId: 'AR'
            };

        defered.resolve(instruments);
        instrumentService.get.and.returnValue(defered.promise);
        userSessionService.getUserId.and.returnValue('AR');
        //$http.expectPOST(url).respond(200, '', {}, expectedInfoLog);
        orderService.createOrder(qty);
        //$http.flush();

        //expect(exception.catcher).toHaveBeenCalledWith('XHR Failed for orderService.createOrder');
        //expect(logger.info).toHaveBeenCalledWith(expectedInfoLog);
    }));
});

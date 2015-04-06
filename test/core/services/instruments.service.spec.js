/* jshint -W117 */
describe('instrumentService', function() {
    'use strict';

    var instrumentService,
        $http,
        exception,
        url = 'http://localhost:8080/instruments';

    beforeEach(module('app.core'));

    beforeEach(function() {
        exception = {
            catcher: jasmine.createSpy()
        };
    });

    beforeEach(
        inject(function(_$httpBackend_, _exception_, _instrumentService_) {
            $http = _$httpBackend_;
            exception = _exception_;
            instrumentService = _instrumentService_;
        })
    );

    it('should be defined', function() {
        expect(instrumentService).toBeDefined();
        expect(instrumentService.get).toBeDefined();
    });

    it('should make HTTP GET request for instrumentService.get method (Success Call)', function() {
        var responseData = [
                {symbol:'AAPL', name:'Apple Inc.', lastTrade:700.23},
                {symbol:'ADBE', name:'Adobe Systems Inc.', lastTrade:33.49},
                {symbol:'AKAM', name:'Akamai Technologies Inc.', lastTrade:38.33}
            ],
            actualResult,
            expectedResult = responseData;
        $http.expectGET(url).respond(200, responseData);
        instrumentService.get().then(function(response) {
            actualResult = response;
        });
        $http.flush();

        expect(actualResult).toEqual(expectedResult);
    });

    it('should make HTTP GET request for instrumentService.get method (Failure Call)', function() {
        var actualResult;
        $http.expectGET(url).respond(404);
        instrumentService.get().then(function(response) {
            actualResult = response;
        });
        $http.flush();
        expect(actualResult).not.toBeDefined();
    });
});
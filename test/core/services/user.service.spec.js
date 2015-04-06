/* jshint -W024, -W030, -W098, -W117 */
describe('userService', function() {
    'use strict';

    var userService,
        $http,
        $state,
        logger,
        exception,
        url = 'http://localhost:8080/users';

    beforeEach(module('app.core'));

    beforeEach(function() {
        logger = {
            info: jasmine.createSpy()
        };
        exception = {
            catcher: jasmine.createSpy()
        };
        $state = {
            go: jasmine.createSpy()
        };

        module(function($provide) {
            $provide.value('logger', logger);
            $provide.value('exception', exception);
            $provide.value('$state', $state);
        });
    });

    beforeEach(
        inject(function(_$httpBackend_, _$state_, _userService_, _exception_, _logger_) {
            $http = _$httpBackend_;
            userService = _userService_;
            exception = _exception_;
            logger = _logger_;
            $state = _$state_;
        })
    );

    it('should be defined', function() {
        expect(userService).toBeDefined();
        expect(userService.getAll).toBeDefined();
        expect(userService.get).toBeDefined();
    });

    it('should make HTTP GET request call for userService.getAll (Success Call)', function() {
        var actualResult,
            responseData = [
                {id:'AM', name:'Amadeus Mozart'},
                {id:'AR', name:'A. R. Rahman'}
            ],
            expectedResult = [
                {id:'AM', name:'Amadeus Mozart'},
                {id:'AR', name:'A. R. Rahman'}
            ],
            expectedInfoLog = 'Pulled User List from Server.';

        $http.expectGET(url).respond(200, responseData);
        userService.getAll().then(function(data) {
            actualResult = data;
        });
        $http.flush();
        expect(actualResult).toEqual(expectedResult);
        expect(logger.info).toHaveBeenCalledWith(expectedInfoLog);
    });

    it('should make HTTP GET request call for orderService.getAll (Failure Call)', function() {
        var actualResult,
            expectedCatcherLog = 'XHR Failed for userService.getAllUsers';

        $http.expectGET(url).respond(404, '');
        userService.getAll().then(function(data) {
            actualResult = data;
        });
        $http.flush();
        expect(actualResult).not.toBeDefined();
        expect(exception.catcher).toHaveBeenCalledWith(expectedCatcherLog);
    });

    it('should return one user object for the call to userService.get method', function() {
        var actualResult,
            expectedResult = {id:'AR', name:'A. R. Rahman'},
            responseData = [
                {id:'AM', name:'Amadeus Mozart'},
                {id:'AR', name:'A. R. Rahman'}
            ];

        $http.expectGET(url).respond(200, responseData);
        userService.getAll().then(function() {
            actualResult = userService.get('AR');
        });
        $http.flush();
        expect(actualResult).toEqual(expectedResult);
    });
});

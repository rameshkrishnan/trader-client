/* jshint -W117 */
describe('userSessionService', function() {
    'use strict';

    var userSessionService,
        userService;

    beforeEach(module('app.core'));

    beforeEach(
        inject(function(_userSessionService_, _userService_) {
            userSessionService = _userSessionService_;
            userService = _userService_;
        })
    );

    it('should be defind', function() {
        expect(userSessionService).toBeDefined();
        expect(userSessionService.clearSession).toBeDefined();
        expect(userSessionService.getUserId).toBeDefined();
        expect(userSessionService.getUsername).toBeDefined();
        expect(userSessionService.setUserId).toBeDefined();
    });

    it('should call method clearSession', function() {
        spyOn(sessionStorage, 'removeItem');
        userSessionService.clearSession();
        expect(sessionStorage.removeItem).toHaveBeenCalled();
    });

    it('should have getUsername method and it should return username', function() {
        var actualResult,
            username = 'A. R. Rahman',
            expectedResult = username;

        spyOn(sessionStorage, 'getItem').and.returnValue(username);
        actualResult = userSessionService.getUsername();
        expect(actualResult).toBe(expectedResult);
    });

    it('should have getUserId method and it should return userId', function() {
        var actualResult,
            username = 'AR',
            expectedResult = username;

        spyOn(sessionStorage, 'getItem').and.returnValue(username);
        actualResult = userSessionService.getUserId();
        expect(actualResult).toBe(expectedResult);
    });

    it('should have method to set user with available user (success return)', function() {
        var user = {id:'AR', name:'A. R. Rahman'},
            actualResult,
            expectedResult = 1;

        spyOn(userService, 'get').and.returnValue(user);
        actualResult = userSessionService.setUserId('AR');

        expect(actualResult).toEqual(expectedResult);
    });

    it('should have method to set user with unavailable user (cleared session)', function() {
        var actualResult,
            expectedResult = 0;

        spyOn(userService, 'get').and.returnValue(null);
        actualResult = userSessionService.setUserId('BR');

        expect(actualResult).toEqual(expectedResult);
    });
});
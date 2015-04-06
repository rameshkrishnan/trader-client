/* jshint -W117 */
describe('LoginController', function() {
    'use strict';

    var controller,
        scope,
        logger,
        $q,
        $state,
        userService,
        users;

    beforeEach(module('app.user'));

    beforeEach(function() {
        userService = {
            getAll: jasmine.createSpy(),
            get: jasmine.createSpy()
        };
        logger = {
            info: jasmine.createSpy()
        };
        $state = {
            go: jasmine.createSpy()
        };

        module(function($provide) {
            $provide.value('userService', userService);
            $provide.value('logger', logger);
            $provide.value('$state', $state);
        });
    });

    beforeEach(
        inject(function(_$rootScope_, _$q_, $controller, _logger_, _$state_, _userService_) {
            scope = _$rootScope_.$new();
            logger = _logger_;
            $state = _$state_;
            $q = _$q_;
            userService = _userService_;

            users = [
                {id:'AM', name:'Amadeus Mozart'},
                {id:'AR', name:'A. R. Rahman'}
            ];
            var defered = $q.defer();
            defered.resolve(users);
            userService.getAll.and.returnValue(defered.promise);

            controller = $controller('LoginController', {
                $scope: scope,
                logger: logger,
                $state: $state,
                userService: userService
            });
            scope.vm = controller;
            scope.$digest();
        })
    );

    it('should be defined', function() {
        expect(scope).toBeDefined();
    });

    it('should have called userService.getAll', function() {
        expect(userService.getAll).toHaveBeenCalled();
        expect(userService.getAll.calls.count()).toEqual(1);
    });

    it('should have users list array', function() {
        expect(controller.users).toEqual(users);
    });

    it('should have activated the login view', function() {
        var expectedResult = 'Login View Activated';
        expect(logger.info).toHaveBeenCalledWith(expectedResult);
    });

    it('should make call to onSubmit to login', function() {
        var selectedUser = {id:'AR', name:'A. R. Rahman'},
            expectedResult = 'User ' + selectedUser.id + ' loggedin.';

        userService.get.and.returnValue(selectedUser);
        controller.selectUserId = selectedUser.id;
        controller.onSubmit();

        expect(logger.info).toHaveBeenCalledWith(expectedResult);
    });

    /*afterAll(function() {
        sessionStorage.clear();
    });*/
});
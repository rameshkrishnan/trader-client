/* jshint -W117 */
describe('routerHelper', function() {
    'use strict';

    var provider,
        $rootScope,
        $state,
        routerHelper,
        userSessionService;

    beforeEach(function() {
        module('fw.router');
        module('app.core');
    });

    beforeEach(function() {
        angular
            .module('providerModule', [])
            .config(['routerHelperProvider', function(routerHelperProvider) {
                provider = routerHelperProvider;
            }]);

        module('providerModule');

        userSessionService = {
            getUserId: jasmine.createSpy()
        };
        module(function($provide) {
            $provide.value('userSessionService', userSessionService);
        });

        inject(function(_$rootScope_, _routerHelper_, _$state_, _userSessionService_) {
            $rootScope = _$rootScope_;
            routerHelper = _routerHelper_;
            $state = _$state_;
            userSessionService = _userSessionService_;
        });
    });

    it('should be defined', function() {
        expect(routerHelper).toBeDefined();
    });

    it('should trigger the watched function $stateChangeSuccess', function() {
        $rootScope.$emit('$stateChangeSuccess', {title:''});
    });

    it('should update the window title based on the state title', function() {
        var config = {
                docTitle: 'Trader Client'
            },
            toState = {
                title: 'Dashboard'
            },
            expectedResult = config.docTitle + ' ' + toState.title;

        provider.configure(config);
        $rootScope.$emit('$stateChangeSuccess', toState);

        expect($rootScope.title).toEqual(expectedResult);
    });

    describe('should trigger the watched function $stateChangeStart', function() {
        var toState = {
                settings: {
                    loginRequired: true
                }
            };

        beforeEach(function() {
            spyOn($state, 'go');
        });

        it('should have login redirection', function() {
            userSessionService.getUserId.and.returnValue(null);
            $rootScope.$emit('$stateChangeStart', toState);
            expect($state.go).toHaveBeenCalledWith('login');
        });

        it('should have dashboard redirection', function() {
            toState.settings.loginRequired = false;
            toState.name = 'login';
            userSessionService.getUserId.and.returnValue('AR');
            $rootScope.$emit('$stateChangeStart', toState);
            expect($state.go).toHaveBeenCalledWith('dashboard.table');
        });
    });

    it('should trigger the watched function $stateChangeError', function() {
        var toState = {
                title:'',
                name:'',
                loadedTemplateUrl:''
            },
            toParams, fromState, fromParams,
            error = {
                data: ''
            };
        spyOn($state, 'go');
        $rootScope.$emit('$stateChangeError', toState, toParams, fromState, fromParams, error);
        expect($state.go).toHaveBeenCalledWith('login');

        // TESTING : Provide an exit clause if it tries to do it twice.
        $rootScope.$emit('$stateChangeError', toState, toParams, fromState, fromParams, error);
        expect($state.go.calls.count()).toEqual(1);
    });
});
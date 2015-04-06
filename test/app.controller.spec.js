/* jshint -W117 */
describe('AppController', function() {
    'use strict';

    var controller,
        scope,
        $state,
        routerHelper;

    beforeEach(module('app'));

    beforeEach(
        inject(function($controller, _$rootScope_, _routerHelper_, _$state_) {
            scope = _$rootScope_.$new();
            $state = _$state_;
            routerHelper = _routerHelper_;

            controller = $controller('AppController', {
                $scope : scope,
                $state : $state,
                routerHelper : routerHelper
            });
            scope.vm = controller;
            scope.$digest();
        })
    );

    it('should be defined', function() {
        expect(scope).toBeDefined();
    });

    it('should not have empty navRoutes', function() {
        expect(controller.navRoutes.length).toBeGreaterThan(0);
    });

    it('should have 3 navRoutes items', function() {
        expect(controller.navRoutes.length).toEqual(3);
    });

    it('should have active state identifier', function() {
        expect(controller.isActive({title:''})).toEqual('');
        $state.current.title = 'Login';
        expect(controller.isActive({title:'Login'})).toEqual('active');
        expect(controller.isActive({title:'Dashboard'})).toEqual('');
    });
});
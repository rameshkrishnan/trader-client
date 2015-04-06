/* jshint -W117 */
describe('userInfoDirective', function() {
    'use strict';

    var $compile,
        $rootScope,
        $state,
        userSessionService;

    beforeEach(function() {
        module('app.user');
        module('templates');
    });

    beforeEach(
        inject(function(_$compile_, _$state_, _$rootScope_, _userSessionService_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $state = _$state_;
            userSessionService = _userSessionService_;
        })
    );

    it('Replaces the element with the appropriate content', function() {
        var $controller,
            scope = $rootScope.$new(),
            element = $compile('<userinfo></userinfo>')(scope),
            templateLoggedIn, templateLoggedOut,
            selectedUser = {id:'AR', name:'A. R. Rahman'},
            expectedResultWithLoggedIn = '<span class="label-username" data-ng-bind="dvm.username">' +
                                            selectedUser.name + '</span>',
            expectedResultWithOutLoggedIn = '<span class="label-username" data-ng-bind="dvm.username"></span>';

        scope.$digest();
        scope.$emit('userLoggedIn');
        $controller = element.controller('userinfo');
        templateLoggedIn = element.html();
        spyOn($state, 'go');
        $controller.signout();
        $rootScope.$digest();
        templateLoggedOut = element.html();

        expect(templateLoggedIn).toContain(expectedResultWithLoggedIn);
        expect(templateLoggedOut).toContain(expectedResultWithOutLoggedIn);
    });
});
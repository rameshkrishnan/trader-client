/* jshint -W117 */
describe('user.run', function() {
    'use strict';

    var $rootScope;

    beforeEach(module('app.user'));

    beforeEach(
        inject(function(_$rootScope_) {
            $rootScope = _$rootScope_;
        })
    );

    it('should listen for $watch', function() {
        sessionStorage.setItem('trader_id', 'AR');
        $rootScope.$digest();
        spyOn($rootScope, '$broadcast');
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
        sessionStorage.setItem('trader_id', 'BR');
        $rootScope.$digest();
        expect($rootScope.$broadcast).toHaveBeenCalled();
    });
});
/* jshint -W117 */
describe('atBarchart', function() {
    'use strict';

    var $compile,
        $rootScope,
        scope,
        element,
        template,
        $window,
        orders = [
            {
                id: 1,
                creationTime: '2015-03-14T12:22:46.496Z',
                side: 'Buy',
                symbol: 'EA',
                quantity: 10392,
                quantityPlaced: 10392,
                quantityExecuted: 10392,
                limitPrice: 962,
                priority: 50,
                status: 'Executed',
                traderId: 'BS'
            }
        ],
        expectedResult = '<g class="plot" transform="translate(20,50)">' +
                            '<g class="bar" x="0">' +
                                '<text x="10" y="18.5" style="text-anchor: end">1</text>' +
                                '<rect class="qty" x="20" y="0" height="37" width="-120"></rect>' +
                                '<rect class="qty_placed" x="20" y="0" height="37" width="-120"></rect>' +
                                '<rect class="qty_executed" x="20" y="0" height="37" width="-120"></rect>' +
                                '<text class="qty_text" y="18.5" x="-20">10392</text>' +
                                '<line class="qty_line" y1="37" y2="37" x1="-100" x2="-20"></line>' +
                            '</g>' +
                          '</g>';

    beforeEach(module('app.core'));

    beforeEach(
        inject(function(_$compile_, _$rootScope_, _$window_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $window = _$window_;
        })
    );

    beforeEach(function() {
        scope = $rootScope.$new();
        element = $compile('<at-barchart id="chart" data-chartdata="orders"></at-barchart>')(scope);

        jasmine.clock().install();
    });
    /*
    function mockLodashDebounceForAngularJS(fn, ms) {
        var callPromise;
        return function () {
            $timeout.cancel(callPromise);
            console.log('debounce "' + fn.name + '" ' + ms + 'ms');
            callPromise = $timeout(fn, ms);
            //callPromise.then(function () {
            //    console.info(fn.name + ' was called after debounce of ' + ms + 'ms');
            //});
        };
    }
*/
    it('should replace with SVG based chart with data', function() {

        scope.orders = orders;
        scope.$digest();
        template = element.html();

        expect(template).toContain(expectedResult);
    });

    it('should replace with SVG based chart without data', function() {
        var orders = [],
            expectedResult = '<g class="plot" transform="translate(20,50)">' +
                                '<text class="no_order" x="-40" y="25">No orders available</text>' +
                             '</g>';

        scope.orders = orders;
        scope.$digest();
        template = element.html();

        expect(template).toContain(expectedResult);
    });

    it('resize the window to redraw chart', function() {

        scope.orders = orders;
        scope.$digest();
        //spyOn(_, 'debounce').and.callFake(mockLodashDebounceForAngularJS);
        angular.element($window).trigger('resize');
        //jasmine.clock().tick(251);

        template = element.html();

        expect(template).toContain(expectedResult);
    });

    it('should remove drawResize after destroy', function() {
        scope.$broadcast('$destroy');
        // angular._data( $($window)[0], 'events' );
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });
});
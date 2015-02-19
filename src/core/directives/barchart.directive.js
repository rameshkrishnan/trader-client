// Usage
// <div data-at-barchart assets="vm.orders"></div>
/* global d3 */
/* jshint -W126 */

(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('atBarchart', barchartDirective);

    barchartDirective.$inject = ['$window'];

    /* @ngInject */
    function barchartDirective($window) {

        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                assets: '='
            }
        };
        return directive;

        function link(scope, element) {

            d3.select('#chart').append('svg');

            scope.$watch('assets', draw, true);
            angular.element($window).on('resize', draw);
            scope.$on('$destroy', function() {
                angular.element($window).off('resize', draw);
            });

            function draw() {

                var assets = scope.assets;
                if(assets === null) return;
                
                var w = element.width(), 
                    h = assets.length * 35,
                    svg = d3.select('#chart svg')
                            .attr({
                                width: w,
                                height: h
                            });

                svg.selectAll('*').remove();

                function givemexscale(d){
                    return d3.scale.linear()
                        .domain([0,d])
                        .range([0,w-125]);
                }

                svg.append('g').selectAll('rect').data(assets)
                    .enter()
                    .append("rect")
                    .attr({
                        height : 30,
                        width : function(d,i){ return givemexscale(d.quantity)(d.quantity)},
                        y : function(d,i){return i * 36},
                        fill : '#fff4d2'
                    });

                svg.append('g').selectAll('rect').data(assets)
                    .enter()
                    .append("rect")
                    .attr({
                        height : 30,
                        width : function(d,i){ return givemexscale(d.quantity)(d.quantityPlaced)},
                        y : function(d,i){return i * 36},
                        fill : '#fecc88'
                    });

                svg.append('g').selectAll('rect').data(assets)
                    .enter()
                    .append("rect")
                    .attr({
                        height : 30,
                        width : function(d,i){ return givemexscale(d.quantity)(d.quantityExecuted)},
                        y : function(d,i){return i * 36},
                        fill : '#ff8000'
                    });

                svg.append('g').selectAll('text').data(assets)
                    .enter()
                    .append("text")
                    .attr({
                        x : w-100,
                        y : function(d,i){return i * 36 + 20},
                        fill : '#000',
                    })
                    .style('background', '#fff')
                    .text(function(d,i){return d.quantity});

            }
        }
    }
    
})();

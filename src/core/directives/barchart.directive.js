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
            var tableRowHeight = 35;

            var base = d3.select(element[0]).append('svg');
            var barChart = new BarChart(base);
            barChart.barHeight(tableRowHeight);

            scope.$watch('assets', draw, true);

            angular.element($window).on('resize', draw);

            scope.$on('$destroy', function() {
                angular.element($window).off('resize', draw);
            });

            function draw() {
                var assets = scope.assets;

                if (!assets) { return; }

                barChart
                    .width(element.width())
                    .draw(assets);
            }
        }
    }
    
    function BarChart(base) {
        this.base = base;

        this.margin = {top: 50, right: 7, bottom: 30, left: 5};
        this.axisMargin = 20;

        this.x = d3.scale.linear();

        this.y = d3.scale.ordinal();

        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .orient('top')
            .tickFormat(function(d) { return d + "%"; });

        this.base
            .attr('class', 'chart');

        this.xAxisBase = this.base.append('g')
            .attr('class', 'x axis');

        this.plotBase = this.base.append('g')
            .attr('class', 'plot')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }

    BarChart.prototype.width = function(newWidth) {
        this.w = newWidth;
        this.plotWidth = this.w - this.margin.left - this.margin.right;
        this.base.attr('width', this.w);
        this.x.range([0, this.plotWidth - 114]);
        return this;
    };

    BarChart.prototype.barHeight = function(newBarHeight) {
        this.bh = newBarHeight;
        return this;
    };

    BarChart.prototype.draw = function(data) {
        
        var self = this,
            make_x_axis = function() {
                return d3.svg.axis()
                    .scale(self.x)
                    .orient("bottom")
                    .ticks(10);
            };

        this.plotHeight = this.bh * data.length + 50;
        this.h = this.plotHeight + this.margin.top + this.margin.bottom;
        this.base.attr('height', this.h);
        this.y.rangeBands([0, this.plotHeight], 0.05, 0);
        this.xAxisBase.attr(
            'transform',
            'translate(25,' + (this.axisMargin) + ')'
        );

        this.x.domain([0,100]);
        this.y.domain([0,data.length]);

        //this.xAxis.tickValues(this.x.domain());
        this.xAxisBase.call(this.xAxis);
        
        this.xAxisBase
            .append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + self.h + ")")
            .call(make_x_axis()
                .tickSize(-self.h, 0, 0)
                .tickFormat('')
            );

        this.plotBase.selectAll('.bar').remove();
        
        var barsEnter = this.plotBase.selectAll('.bar')
                            .data(data)
                            .enter()
                            .append('g')
                            .attr('class', 'bar');

        barsEnter
            .append("rect")
            .attr({
                height : self.bh,
                width : function(d,i){ return self.givemexscale(d.quantity)(d.quantity)},
                x : 20,
                y : function(d,i){return i * (self.bh + 5)},
                fill : '#fff4d2'
            });
        
        barsEnter
            .append("rect")
            .attr({
                height : self.bh,
                width : function(d,i){ return self.givemexscale(d.quantity)(d.quantityPlaced)},
                x : 20,
                y : function(d,i){return i * (self.bh + 5)},
                fill : '#fecc88'
            });

        barsEnter
            .append("rect")
            .attr({
                height : self.bh,
                width : function(d,i){ return self.givemexscale(d.quantity)(d.quantityExecuted)},
                x : 20,
                y : function(d,i){return i * (self.bh + 5)},
                fill : '#ff8000'
            });

        barsEnter
            .append("text")
            .attr({
                x : self.w-30,
                y : function(d,i){return 20 + i * (self.bh + 5)},
                fill : '#000',
                style : 'text-anchor: end'
            })
            .text(function(d,i){return d.quantity});
        
        barsEnter
            .append("line")
            .attr({
                x1 : self.w-105,
                y1 : function(d,i){return i * (self.bh + 5) + self.bh},
                x2 : self.w-10,
                y2 : function(d,i){return i * (self.bh + 5) + self.bh},
            })
            .attr("stroke-width", 1)
            .attr("stroke", "#fecc88");
        
        barsEnter
            .append("text")
            .attr({
                x : 16,
                y : function(d,i){return i * (self.bh + 5) + ((self.bh + 5) / 2)},
                fill : '#000',
                style : 'text-anchor: end'
            })
            .text(function(d,i){return d.id});
    };
    
    BarChart.prototype.givemexscale = function (d){
        return d3.scale.linear()
            .domain([0,d])
            .range([0,this.w-125]);
    };

})();

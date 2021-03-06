app.directive("treemap", function($http) {
    return {
        restrict: "E",
        scope: {
            divId: '@',
            data: '='
        },
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
            $scope.$watch("data",function(newVal,oldVal) {
                var margin = {top: 40, right: 10, bottom: 10, left: 10},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var color = d3.scale.category20c();

                $scope.treemap = d3.layout.treemap()
                    .size([width, height])
                    .sticky(true)
                    .value(function(d) { return d.size; });

                var div = d3.select($scope.divId)
                    .style("position", "relative")
                    .style("width", (width + margin.left + margin.right) + "px")
                    .style("height", (height + margin.top + margin.bottom) + "px")
                    .style("left", margin.left + "px")
                    .style("top", margin.top + "px");

                var node = div.datum($scope.data).selectAll(".node")
                    .data($scope.treemap.nodes)
                    .enter().append("div")
                    .attr("class", "node")
                    .call(position)
                    .style("background", function(d) { return d.children ? color(d.name) : null; })
                    .text(function(d) { return d.children ? null : d.name; });

                function position() {
                    this.style("left", function(d) { return d.x + "px"; })
                        .style("top", function(d) { return d.y + "px"; })
                        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
                        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
                }
            });




        }],
        templateUrl:'templates/treemap.html',
        link: function(scope, element, attrs) {

        }
    };
});

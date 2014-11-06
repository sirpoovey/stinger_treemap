angular.module("StingerWidgetsApp",['angular-treemap']).controller('StingerViz',function($scope,$compile,$http,$window,$timeout) {
    function getStingerData(alg, metric, size, wait) {

        var args = {"jsonrpc":"2.0", "method":"get_data_array_sorted_range", "params":{"name":alg,"data":metric,
            "strings":true,"offset":0,"wait_for_update":wait,"count":size,"order":"DESC"}, "id":1};
        var config = {
            headers: {
                "Content-Type":"application/x-www-form-urlencoded"
            }
        };


        var promise = $http.post('http://' + window.location.hostname + ':8088/jsonrpc',args,config)
            .success(function(data, status, headers, config) {

                var pagerankData = {
                    "name": "Top " + $scope.algorithm.name,
                    "children": [],
                    "color":200
                };

                for (var i=0; i < data.result[metric].value.length; i++) {
                    pagerankData.children.push({
                        "name":data.result[metric].vertex_str[i],
                        "value":data.result[metric].value[i],
                        "color":50
                    })
                }

                $scope.treeData = pagerankData;
            }).error(function(data,status,headers,config) {
                console.log('Damnit');
            });

        promise.then(function () {
           getStingerData(alg,metric,size,true);
        });
    }

    $scope.formatName = function(name) {
        return name;
    };

    $scope.onDetail = function(d) {
        console.log(d);
        return d;
    }

    $scope.items = [
        { id: 1, name: 'Pagerank' },
        { id: 2, name: 'Betweenness Centrality' }
    ];

    $scope.algorithm = $scope.items[0];

    $scope.sizes = [
        { id: 30, name: '30' },
        { id: 50, name: '50' },
        { id: 100, name: '100' }
    ];

    $scope.size = $scope.sizes[0];

    $scope.treeData = {};

    $scope.$watchGroup(['algorithm','size'],function(newVals) {
        if (!$scope.algorithm || !$scope.size) {
            return;
        }
        var alg;
        var metric;
        if ($scope.algorithm.id==1) {
            alg = "pagerank";
            metric = "pagerank";
        } else if ($scope.algorithm.id==2) {
            alg = "betweenness_centrality";
            metric = "bc";
        }

        getStingerData(alg,metric,$scope.size.id,false);

    });

});
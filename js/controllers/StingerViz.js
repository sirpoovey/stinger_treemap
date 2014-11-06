angular.module("StingerWidgetsApp",['angular-treemap']).controller('StingerViz',function($scope,$compile,$http,$window,$timeout) {
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

    $scope.selectedItem = null;

    $scope.treeData = {};

    $scope.$watch('algorithm',function(newVal) {
        if (!newVal) {
            return;
        }
        if (newVal.id==1) {
            var args = {"jsonrpc":"2.0", "method":"get_data_array_sorted_range", "params":{"name":"pagerank","data":"pagerank",
                "strings":true,"offset":0,"wait_for_update":false,"count":30,"order":"DESC"}, "id":1};
            var config = {
                headers: {
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            };


            $http.post('http://' + window.location.hostname + ':8088/jsonrpc',args,config)
                .success(function(data, status, headers, config) {
                    $scope.rawTreeData = data.result.pagerank;

                    var pagerankData = {
                        "name": "Top Pagerank",
                        "children": [],
                        "color":200
                    };

                    for (var i=0; i < data.result.pagerank.value.length; i++) {
                        pagerankData.children.push({
                            "name":data.result.pagerank.vertex_str[i],
                            "value":data.result.pagerank.value[i],
                            "color":50
                        })
                    }

                    $scope.treeData = pagerankData;
                }).error(function(data,status,headers,config) {
                    console.log('Damnit');
                });
        } else if (newVal.id==2) {
            var args = {"jsonrpc":"2.0", "method":"get_data_array_sorted_range", "params":{"name":"betweenness_centrality","data":"bc",
                "strings":true,"offset":0,"wait_for_update":false,"count":30,"order":"DESC"}, "id":1};
            var config = {
                headers: {
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            };


            $http.post('http://' + window.location.hostname + ':8088/jsonrpc',args,config)
                .success(function(data, status, headers, config) {
                    $scope.rawTreeData = data.result.bc;


                    var betweennessData = {
                        "name": "Top Betweenness",
                        "children": [],
                        "color":200
                    };

                    for (var i=0; i < data.result.bc.value.length; i++) {
                        betweennessData.children.push({
                            "name":data.result.bc.vertex_str[i],
                            "value":data.result.bc.value[i],
                            "color":50
                        })
                    }

                    $scope.treeData = betweennessData;
                }).error(function(data,status,headers,config) {
                    console.log('Damnit');
                });
        }
    });

});
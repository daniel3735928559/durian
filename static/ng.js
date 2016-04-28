var app = angular.module('app',[]);

app.controller("ElderberryController", ['$scope','$http', '$window', '$timeout', '$location', function($scope, $http, $window, $timeout, $location){    
    //alert('q');
    $scope.data = {};
    $scope.data_filter = "";
    $scope.algorithms = ["regression","lasso"]
    $scope.lasso_param = 0.01;
    $scope.selected_alg = $scope.algorithms[0];
    $scope.classes = ["unknown","positive-intense","postive-mellow", "negative-intense", "negative-mellow"];
    $scope.training_methods = ["all","changed"];
    $scope.training_method = $scope.training_methods[0];
    $scope.rainbow = ["#ffcc66", "#ccff66", "#66ccff", "#ff6fcf", "#ff6666","#6c6cfc"];

    $scope.get_params = function(){
	if($scope.selected_alg == "regression")
	    return 0;
	if($scope.selected_alg == "lasso")
	    return parseFloat($scope.lasso_param);
    }
    $scope.set_alg = function(a){
	$scope.selected_alg = a;
    }
    $scope.set_train = function(a){
	$scope.training_method = a;
	console.log($scope.lasso_param);
    }
    $scope.set_selection = function(data){
	//console.log("DATA",data);
	$scope.data = data;
	$scope.$apply();
    }
    
    $scope.class_change = function(table_index, class_index, data_index){
	var arr = canvas.getObjects();
	arr[data_index].label = class_index;
	arr[data_index].fill = $scope.rainbow[class_index];
	$scope.data[table_index][0] = class_index;

	for (i in $scope.classes){
	    dist[classes[i]] = 0
	}

	for (i = 0; i < arr.length; i++){
	    dist[$scope.classes[arr[i].label]] += 1 
	}

	dataset = []
	for(i in dist){
	    dataset.push({category: i, measure: dist[i]})
	}

	d3.select("svg").remove();
	dsPieChart(dataset);
	
	canvas.renderAll();
	socket.emit('label_change', {'index':data_index,'label':class_index});
    }
}]);




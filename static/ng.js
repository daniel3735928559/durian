var app = angular.module('app',[]);

app.controller("ElderberryController", ['$scope','$http', '$window', '$timeout', '$location', function($scope, $http, $window, $timeout, $location){    
    //alert('q');
    $scope.data = {};
    $scope.data_filter = "";
    $scope.train_all = true;
    $scope.lasso = true
    $scope.classes = ["sad","happy"];
    $scope.rainbow = ["#ffcc66", "#ccff66", "#66ccff", "#ff6fcf", "#ff6666"];

    
    $scope.set_selection = function(data){
	//console.log("DATA",data);
	$scope.data = data;
	$scope.$apply();
    }
    $scope.toggle_train_all = function(){
	$scope.train_all = !$scope.train_all;
    }
    $scope.toggle_lasso = function(){
	$scope.lasso = !$scope.lasso;
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




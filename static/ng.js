var app = angular.module('app',[]);

app.controller("ElderberryController", ['$scope','$http', '$window', '$timeout', '$location', function($scope, $http, $window, $timeout, $location){    
    //alert('q');
    $scope.data = {};
    $scope.data_filter = "";
    $scope.algorithms = ["regression","lasso"]
    $scope.lasso_param = 0.01;
    $scope.selected_alg = $scope.algorithms[0];
    $scope.classes = ["unknown","Zika-Virus","Brexit", "Ohio-massacre", "UFC-200"];    
    // $scope.classes = ["unknown","positive-intense","postive-mellow", "negative-intense", "negative-mellow"];
    $scope.training_methods = ["all","changed"];
    $scope.training_data = [];
    $scope.training_method = $scope.training_methods[0];
    $scope.rainbow = ["#ffcc66", "#ccff66", "#66ccff", "#ff6fcf", "#ff6666","#6c6cfc"];
    $scope.lasso_changed = [];
    $scope.lasso_view = [];

    // $scope.update_view = function(a){
    // 	update_view(a);
    // }
    $scope.run_regression = function(){
	update_view('regression');
	$scope.selected_alg = "regression";
	$scope.lasso_changed = [];
	$scope.lasso_view = [];
    }
    $scope.update_lasso = function(){
	if($scope.lasso_changed.length > 0){
	    update_view('lasso');
	}
    }
    $scope.start_lasso = function(){
	var a = [];
	$scope.lasso_view = [];
	$scope.lasso_changed = [];
	$scope.selected_alg = "lasso";
	var arr = canvas.getObjects();
	for(var i = 0; i < arr.length; i++){
	    if(arr[i].changed){
		$scope.lasso_changed.push(i);
		a.push(arr[i]);
		console.log(i);
	    }
	}
	$scope.lasso_view = get_normalised_coords(a);
	update_view('lasso');
    }
    $scope.training_update = function(ng){
	$scope.training_data = [];
	console.log("TUTUTU");
	var arr = canvas.getObjects();
	for(var i = 0; i < arr.length; i++){
	    if(arr[i].changed){
		$scope.training_data.push({'str':arr[i].stringValue,'idx':i});	
	    }
	}
	if(!ng) $scope.$apply();
    }
    $scope.do_not_train = function(idx){
	console.log("R",idx);
	canvas.getObjects()[idx].changed = false;
	$scope.training_update(true);
    }
    $scope.get_params = function(){
	if($scope.selected_alg == "regression")
	    return 0;
	if($scope.selected_alg == "lasso")
	    return parseFloat($scope.lasso_param);
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




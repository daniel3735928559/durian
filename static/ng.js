var app = angular.module('app',[]);

app.controller("ElderberryController", ['$scope','$http', '$window', '$timeout', '$location', function($scope, $http, $window, $timeout, $location){    
    //alert('q');
    $scope.data = {};
    $scope.data_filter = "";
    $scope.lasso_param = 0.01;
    $scope.selected_alg = "regression";
    $scope.classes = ["unknown"];    
    $scope.training_methods = ["all","changed"];
    $scope.training_data = [];
    $scope.training_method = $scope.training_methods[0];
    
    $scope.rainbow = ["#ffcc66", "#ccff66", "#66ccff", "#ff6fcf", "#ff6666","#6c6cfc"];
    $scope.get_rainbow = function(class_name){
	console.log("iweud",class_name);
	var letters = '468ACE'.split('');
	var color = '#';
	for (var i = 0; i < 3; i++ ) {
	    color += letters[class_name.charCodeAt((5*i)%(class_name.length))%(letters.length)];
	}
	return color;
    }
    $scope.lasso_changed = [];
    $scope.lasso_view = [];

    $scope.run_alg = function(){
	$scope.algorithms[$scope.selected_alg]();
	console.log("AA",$scope.selected_alg);
    }
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

    // adding a new class label stuff
    $scope.foo = null;
    $scope.add_label = function(){	
	$scope.classes.push($scope.foo)
	$scope.$apply();
    }

    $scope.remove_class = function(index){

	$scope.classes.splice(index,1)

    }
    $scope.select_point = function(idx){
	var arr = canvas.getObjects();
	canvas.deactivateAll();
	canvas.setActiveObject(arr[idx]);
    }
    $scope.class_change = function(table_index, class_index, data_index){
	var arr = canvas.getObjects();
	arr[data_index].label = class_index;
	arr[data_index]._objects[0].fill = $scope.get_rainbow($scope.classes[class_index]);
	$scope.data[table_index][0] = class_index;
	
	canvas.renderAll();
	socket.emit('label_change', {'index':data_index,'label':class_index});
    }
    $scope.algorithms = {"regression":$scope.run_regression,"lasso":$scope.start_lasso}
}]);

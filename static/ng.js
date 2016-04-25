var app = angular.module('app',[]);

app.controller("ElderberryController", ['$scope','$http', '$window', '$timeout', '$location', function($scope, $http, $window, $timeout, $location){    
    //alert('q');
    $scope.data = {};
    $scope.data_filter = "";
    $scope.train_all = true;
    $scope.classes = ["sad","hally"];
    $scope.rainbow = ["#ffcc66", "#ccff66", "#66ccff", "#ff6fcf", "#ff6666"];
    //$scope.helloz = 'qweqweqweq';
    // $scope.$on('canvas:created', function(){
    // 	console.log('qweqqw');
    // });
    $scope.set_selection = function(data){
	console.log("DATA",data);
	$scope.data = data;
	$scope.$apply();
    }
    $scope.toggle_train_all = function(){
	$scope.train_all = !$scope.train_all;
    }
    $scope.class_change = function(table_index, class_index, data_index){
	var arr = canvas.getObjects();
	arr[data_index].label = class_index;
	arr[data_index].fill = $scope.rainbow[class_index];
	$scope.data[table_index][0] = class_index;
	canvas.renderAll();
	socket.emit('label_change', {'index':data_index,'label':class_index});
    }
}]);




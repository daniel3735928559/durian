var app = angular.module('app',[]);

app.controller("ElderberryController", ['$scope','$http', '$window', '$timeout', '$location', function($scope, $http, $window, $timeout, $location){    
    alert('q');
    $scope.data = {};
    $scope.helloz = 'qweqweqweq';
    $scope.$on('canvas:created', function(){
	console.log('qweqqw');
    });
    $scope.set_selection = function(data){
	console.log("DATA",data);
	$scope.data = data;
	$scope.$apply();
    }
}]);




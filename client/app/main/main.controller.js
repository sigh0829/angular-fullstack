'use strict';

angular.module('flawwengApp')
.controller('MainCtrl', function ($rootScope,$scope, $http, socketService,notification) {
	/*console.log('Initialisation du controller');
	socketService.emit('connection',{
		name:'flawweng'
	});
	socketService.on('message', function(msg){
		console.log(msg);
	}); */

//Notification.warning('Warning notification');
/*
    notification({
            message: "Ah mon vier!!",
            classes: $scope.classes,
            position: 'right',
            duration: $scope.duration
        });
*/
socketService.connect({
	name:'Shakira'
});

$rootScope.$broadcast('event:sidebarleft-update', []);
$scope.awesomeThings = [];

$http.get('/api/things').success(function(awesomeThings) {
	$scope.awesomeThings = awesomeThings;
});

});

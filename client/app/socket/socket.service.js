var socket = angular.module('socket', []);


socket.service('socketService', function($rootScope){
	var socket;
	this.connect = function(user){
		if(!socket){
			socket = io.connect();
			this.emit('login',user);
			socket.on('getContactsConnected', function(contacts){
				$rootScope.$broadcast('event:connected-contacts', contacts);
			});
			setInterval(function(){
				socket.emit('getContactsConnected');
			},3000); 
		}
	}
	this.on = function(eventName, callback){
		socket.on(eventName, function () {  
			callback.apply(null, arguments);
		});
	},
	this.emit = function(eventName,data,callback){
		socket.emit(eventName, data, function () {
			if (callback) {
				callback.apply(null, arguments);
			}
		});
	}
	

	
});
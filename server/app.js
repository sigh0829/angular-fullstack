/**
 * Main application file
 */

 'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
var _ = require('lodash');
// Setup server
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
	console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

var contacts =[];

io.on('connection', function(socket) {
	socket.on('login', function(user){
		if(_.findWhere(contacts,user)==undefined){
			contacts.push(user);			
		}
		console.log(contacts);
		socket.emit('message', 'Vous êtes connecté' + user.name);
	});
	socket.on('message', function(data) {
		io.in(room).emit('message created',data);
	});
	socket.on('getContactsConnected', function(){
		socket.emit('getContactsConnected', contacts);
	})
});



// Expose app
exports = module.exports = app;

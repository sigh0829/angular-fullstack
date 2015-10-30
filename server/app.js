/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');


// Setup server
var app = express();

var server = require('http').createServer(app);
require('./config/express')(app);

require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
/*
var fs = require("fs");
var content = JSON.parse(fs.readFileSync('./server/data/data.json'));
content.lol='Yooo';
console.log(content)

fs.writeFile('./server/data/data.json', JSON.stringify(content), function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});
*/


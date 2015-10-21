'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

var todos = [
{
	id : 0,
	label : "Apprendre JavaScript"
}, {
	id : 1,
	label : "Apprendre Python"
}, {
	id : 2,
	label : "Apprendre C"
},  {
	id : 3,
	label : "Apprendre C++"
}
];

var expectedFirstResult = JSON.stringify({id : 0, label : "Apprendre JavaScript"});

describe('GET method test', function(){

describe('GET /api/todos', function() {

	it('should respond with JSON array', function(done) {
		request(app)
		.get('/api/todos')
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.be.instanceof(Array);
			done();
		});
	});

	it('should respond with 4 expected elements', function(done) {
		request(app)
		.get('/api/todos')
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			if (err) return done(err);
			var result = res.body;
			result.should.not.eql({});
			result.should.not.eql(null);
			result.length.should.be.equal(4);
			result.should.be.eql(todos);
			done();
		});
	});

});

describe('GET /api/todos/:id', function() {

	it('should respond the expecting JSON object with the id', function(done) {
		request(app)
		.get('/api/todos/0')
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.be.instanceof(Object);
			done();
		});
	});

	it('should respond a JSON object (id=0) equal to ' + JSON.stringify(todos[0]), function(done) {
		request(app)
		.get('/api/todos/0')
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			if (err) return done(err);
			var result = res.body;
			result.should.not.eql({});
			result.should.not.eql(null);
			result.should.be.eql(todos[0]);
			done();
		});
	});

	it('should respond empty {} with unknow id', function(done) {
		request(app)
		.get('/api/todos/99')
		.expect(404)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			if (err) return done(err);
			var result = res.body;
			result.should.eql({});
			done();
		});
	});

	it('should have a 400 response and error message with NAN id', function(done) {
		request(app)
		.get('/api/todos/ABC')
		.expect(400)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.eql({ error: 'Invalid id : ABC'});
			done();
		});
	});

});
});

describe('POST /api/todos/', function() {
	it('should have a 400 response when no data is posted, missing or empty label property', function(done) {
		getRequest('POST','/api/todos',400,/json/)
		.send()
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.eql({ error: 'No Todo data in request'});
		});
		getRequest('POST','/api/todos',400,/json/)
		.send({id : 0})
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.eql({ error: 'No Todo data in request'});
		});
		getRequest('POST','/api/todos',400,/json/)
		.send({label : ""})
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.eql({ error: 'No Todo data in request'});
			done();
		});

	});
	it('should have a 400 response when trying to create an existing todo (same label)', function(done) {
		getRequest('POST','/api/todos',400,/json/)
		.send({label:"Apprendre Python"}).end(function(err, res) {
			if (err) return done(err);
			res.body.should.eql({ error: 'Todo already exist'});
			done();
		});
	});
	it('should create and return a new todo if not exist', function(done) {
		getRequest('POST','/api/todos',201,/json/)
		.send({label:"Apprendre Perl"}).end(function(err, res) {
			if (err) return done(err);
			res.body.should.eql({id:4, label:"Apprendre Perl"});
			//res.body.label.should.eql({ error: 'Apprendre Perl'});
			res.body.id.should.eql(4);
			done();
		});
	});


});


/**
* Get a request HTTP respecting following conditions:
* type : (GET, POST, PUT, DELETE)
* uri : (endpoint)
* status : code return expected
* contentType : content type expected.
*/ 
var getRequest = function(type, uri , status, contentType){
	var req = request(app); 
	switch(type){
		case 'GET':
			req = req.get(uri);
			break;
		case 'POST':
			req = req.post(uri);
			break;
		default:
		console.error("Type " + type +' is not reconized.');
		break;
	} 

	return 	req.expect(status)
	.expect('Content-Type', contentType);
}
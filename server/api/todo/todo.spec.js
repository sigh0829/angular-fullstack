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

	it('should have the 4 expected elements', function(done) {
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

	it('should respond JSON object (id=0)', function(done) {
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

	it('should respond JSON object (id=0) equal to ' + JSON.stringify(todos[0]), function(done) {
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

	it('should have a empty {} response with unknow id', function(done) {
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

	it('should have a 400 response (NAN id)', function(done) {
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

describe('POST /api/todos/', function() {
	it('should have a 400 response when no data is posted, missing label property and empty label property', function(done) {
		request(app)
		.post('/api/todos')
		.send()
		.expect(400)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.eql({ error: 'No Todo data in request'});
		});
		request(app)
		.post('/api/todos')
		.send({id : 0})
		.expect(400)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.eql({ error: 'No Todo data in request'});
		});
		request(app)
		.post('/api/todos')
		.send({label : ""})
		.expect(400)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.eql({ error: 'No Todo data in request'});
			done();
		});

	});
	it('should have a 400 response when trying to create an existing todo (same label)', function(done) {
	getRequest('/api/todos',400,/json/)
		.send({label:"Apprendre Python"}).end(function(err, res) {
			if (err) return done(err);
			res.body.should.eql({ error: 'Todo already exist'});
			done();
		});


	});

});


var getRequest = function(uri , expectedStatus, expectedContentStatus){
	return 	request(app)
	.post(uri)
	.expect(expectedStatus)
	.expect('Content-Type', expectedContentStatus);
	
	
	
}
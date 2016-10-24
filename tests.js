/*jshint esversion: 6*/

// Globals / requires
var request = require('supertest');
var should = require('should');
var api = 'http://localhost:3000';
var server;

// test server
describe('api reads file and returns JSON', () => {
	beforeEach(function () {
		server = require('./server.js');
	});
	afterEach(function () {
	    server.close();
	});

	it('hits the end point and gets a 200', (done) => {
		request(server)
			.get('/api/getheatmapdata/false')
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);
				done();
			});
	});

	it('hits the end point, gets back the JSON object, and return has correct value', (done) => {
		request(server)
			.get('/api/getheatmapdata/false')
			.expect(200)
			.expect((res) => {
				res.body.data.result.length.should.be.above(1);
			})
			.end((err, res) => {
				if (err) return done(err);
				done();
			});
	});
});
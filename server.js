'use strict()';
/*jshint esversion: 6*/

var express = require('express');
var app = express();
var fs = require('fs');

app.all('*', function(req, res, next) {
  	res.header('Access-Control-Allow-Origin', '*');
  	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  	res.header('Access-Control-Allow-Headers', 'Content-type,Accept');
  	next();
});

app.get('/api/getheatmapdata', (req, res) => {
	fs.readFile('HeatMapData-1.json', 'utf-8', function (err, data) {
		var returnData = {},
			status;
		// if (err.code !== 'ENOENT') throw err;
		if (!err) {
			returnData = {error: false, data: JSON.parse(data)};
			status = 200;
		} else {
			returnData = {error: true, data: err};
			status = 500;
		}
		res.status(status).send(returnData);
	});
});

// serve the view (could be done with apache but this is a clean way to wire it in here)
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server listening at port %s', port);
});

module.exports = server;
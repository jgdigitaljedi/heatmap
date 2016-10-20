'use strict()';
/*jshint esversion: 6*/

var express = require('express');
var app = express();
var fs = require('fs');

app.get('/api/getHeatmapData', () => {
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

app.listen(3000);
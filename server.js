'use strict';

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var methodOverride = require('method-override');
//var tfacSchemas = require('./server/sqldb/tfac-schemas');
//var tfacRoutes = require('./server/api/tfac-routes')(app);

mongoose.connect('mongodb://tfac-dev:21.64SCMgoblue!@jello.modulusmongo.net:27017/gene9neB');

/* Using Mongoose schema definition to define db table
var streamEventSchema = new Schema({
  streamer:  String,
  date: Date,
  body:   String,
  active: Boolean,
  description: String,
  ruleIds: [String]
});

var streamEvents = mongoose.model('streamEvents', streamEventSchema);
*/

var streamEvents = mongoose.model('streamEvents', {
	STREAMER: String
});

app.set('port', (process.env.PORT || 8083));
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// api -------------------------------------------------------------------------------------------------
app.get('/api/events', function(req, res) {
	streamEvents.find(function(err, streamEvents) {
		if (err)
			res.send(err)
		res.json(streamEvents);
	});
});

app.post('/api/events', function(req, res) {
	streamEvents.create({
		STREAMER : req.body.STREAMER
	}, function(err, streamEvent) {
		if (err)
			res.send(err)
		streamEvents.find(function(err, streamEvents) {
			if (err)
				res.send(err)
			res.json(streamEvents);
		});
	});
});

// routes ==================================================================================================
app.get('*', function(req,res) {
    res.sendFile(__dirname + '/client/index.html');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
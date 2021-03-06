'use strict';
require('dotenv').config();
// general utilities
const _ = require('lodash');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const cron = require('node-cron')
const fs = require('fs');
const request = require('request');
const Promise = require('bluebird');
// db
const mongoose = require('mongoose');
const morgan = require('morgan');
// routing
const streamWatcherRoutes = require('./server/routes/stream-watcher-routes');
const userRoutes = require('./server/routes/user-routes');
const eventsRoutes = require('./server/routes/event-routes');
const impactRoutes = require('./server/routes/impact-routes');
const authRoutes = require('./server/routes/auth-routes');
// auth/session
const passport = require('passport');
const ppUtil = require('./server/util/passport-util');
const session = require('express-session');
const twitchtvStrategy = require('passport-twitchtv').Strategy;

// create express app
const express = require('express');
const app = express();

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

// passport initialization
passport.use(ppUtil());
passport.deserializeUser(function(obj, done) {
 	done(null, obj);
});
passport.serializeUser(function(user, done) {
 	done(null, user);
});

// DB connection
// mongoose.connect('mongodb://tfac-dev:21.64SCMgoblue!@jello.modulusmongo.net:27017/gene9neB');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// we're connected!
});

// Set port
app.set('port', (process.env.PORT || 8080));

// Middleware	
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(session({ 
	secret: 'UnevenSpanishGhostshrimp',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// api routes
app.use('/api/streamWatcher', streamWatcherRoutes);
app.use('/api/user', userRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/impact', impactRoutes);
app.use('/auth', authRoutes);

//view routes
// app.get('/nav', function(req,res){
// 	res.sendFile(__dirname + '/client/app/views/nav.html');
// });

// app.get('/events', function(req,res){
// 	res.sendFile(__dirname + '/client/app/views/events.html');
// });

app.get('/api/twitch/channel/watch', function (req, res) {
	channelApi.watchChannelStats('scomar1221');
	res.status(200).send();
});

app.get('/parse/npo', function(req, res) {
	let npoFile = [];
	let finalData = [];
	fs.readFile('./data-download-pub78.txt', (err, data) => {
		if(err) throw err;
		npoFile = data.toString().split('\n');
		let x;
		for(x = 0; x < 10; ++x) {
			let npoData = npoFile[x].split('|');
			let obj = {
				ein: npoData[0],
				name: npoData[1],
				city: npoData[2],
				state: npoData[3],
				country: npoData[4],
				deducStatus: npoData[5].slice(npoData[5].length - 1, 1)
			};
			finalData.push(obj);
		}
		// npoFile.forEach((line) => {
		// 	let npoData = line.split('|');
		// 	let obj = {
		// 		ein: npoData[0],
		// 		name: npoData[1],
		// 		city: npoData[2],
		// 		state: npoData[3],
		// 		country: npoData[4],
		// 		deducStatus: npoData[5]
		// 	};
		// 	finalData.push(obj);
		// });
		fs.writeFile('npo.json', JSON.stringify(finalData), (err, data) => {
			if (err) throw err;
  			console.log('It\'s saved!');
		});
	});
});

// default redirect
app.get('*', function(req, res) {
	ensureAuthenticated(req, res);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function ensureAuthenticated(req, res) {
  if (req.isAuthenticated()) {
  	res.sendFile(__dirname + '/client/index.html'); 
  } else {
  	res.redirect('/auth/twitchtv');
  }
}

module.exports = app;

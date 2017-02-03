'use strict';

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var methodOverride = require('method-override');
var tfacSchemas = require('./server/sqldb/tfac-schemas');
var twitchRoutes = require('./server/routes/twitch-api-routes');
var userRoutes = require('./server/routes/user-routes');
var eventsRoutes = require('./server/routes/event-routes');
var impactRoutes = require('./server/routes/impact-routes');
var passport = require('passport');
var session = require('express-session');
var twitchtvStrategy = require('passport-twitchtv').Strategy;
const TWITCHTV_CLIENT_ID = 'kn61a7wj2x173shcjb2gimofz6wkki';
const TWITCHTV_CLIENT_SECRET = 'wnfhy2d7amrebow35ab2sfjixb8p96';

//Passport sessions
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new twitchtvStrategy({
    clientID: TWITCHTV_CLIENT_ID,
    clientSecret: TWITCHTV_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:9000/auth/twitchtv/callback",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {

    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Twitch.tv profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Twitch.tv account with a user record in your database,
      // and return that user instead.
      /*
      tfacSchemas.tfacUser.find({twitchUsername: profile.username}, function(err, tfacProfile) {
      	//do something
      });
      */
      console.log(profile);
      return done(null, profile);
    });
  }
));

//DB connection
mongoose.connect('mongodb://tfac-dev:21.64SCMgoblue!@jello.modulusmongo.net:27017/gene9neB');

(function configure(){
	//Set port
	app.set('port', (process.env.PORT || 9000));
	//Middleware
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
	app.use(session({ 
		secret: 'UnevenSpanishGhostshrimp',
		resave: false,
		saveUninitialized: false
	 }));
	app.use(passport.initialize());
		app.use(passport.session());

	// api routes -------------------------------------------------------------------------------------------------
	app.use('/api/twitch', twitchRoutes);
	app.use('/api/user', userRoutes);
	app.use('/api/events', eventsRoutes);
	app.use('/api/impact', impactRoutes);
})();

// auth routes =================================================================================================
app.get('/auth', 
  passport.authenticate('twitchtv', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

// view routes =================================================================================================
app.get('/nav', function(req,res){
	res.sendFile(__dirname + '/client/app/views/nav.html');
});
app.get('/events', function(req,res){
	res.sendFile(__dirname + '/client/app/views/events.html');
});
app.get('/login', function (req, res) {
	res.sendFile(__dirname + 'client/login.html');
});

//twitch auth
app.get('/auth/twitchtv',
	passport.authenticate('twitchtv', { scope: [ 'user_read' ] }), function(req, res){
    // The request will be redirected to Twitch.tv for authentication, so this
    // function will not be called.
});

app.get('/auth/twitchtv/callback', 
	passport.authenticate('twitchtv', { failureRedirect: '/login' }), function(req, res) {
    	res.redirect('/');
});

//default redirect
app.get('*', function(req,res) {
    res.sendFile(__dirname + '/client/index.html');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

module.exports = app;
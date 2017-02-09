'use strict';

var passport = require('passport');
var session = require('express-session');
var twitchtvStrategy = require('passport-twitchtv').Strategy;
var express = require('express');
var router = express.Router();

//twitch auth
router.get('/twitchtv',
	passport.authenticate('twitchtv', { scope: [ 'user_read' ] }), function(req, res){
    // The request will be redirected to Twitch.tv for authentication, so this
    // function will not be called.
});

router.get('/twitchtv/callback', 
	passport.authenticate('twitchtv', { failureRedirect: '/login' }), function(req, res) {
    	res.redirect('/');
});


// Updating Rules for event
//router.post('/update/rules', event.updateEventRules);

//export this router
module.exports = router;
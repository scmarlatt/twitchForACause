const tfacSchema = require('../sqldb/tfac-schemas');
const User = require('../models/user-model');
const passport = require('passport');
const session = require('express-session');
const twitchtvStrategy = require('passport-twitchtv').Strategy;

function getStrategy() {
	return new twitchtvStrategy({
	    clientID: process.env.TWITCHTV_CLIENT_ID,
	    clientSecret: process.env.TWITCHTV_CLIENT_SECRET,
	    callbackURL: 'http://localhost:8080/auth/twitchtv/callback',
	    scopes: ['user_read', 'channel_subscriptions']
  	},
	function (accessToken, refreshToken, profile, done) {

	    // asynchronous verification, for effect...
	    process.nextTick(function () {
	      
	      	// To keep the example simple, the user's Twitch.tv profile is returned to
	      	// represent the logged-in user.  In a typical application, you would want
	      	// to associate the Twitch.tv account with a user record in your database,
	      	// and return that user instead.
	      	// console.log("PROFILE");
	      	// console.log(profile);
	      	let profileMatch;
	      	User.findOne({twitchUsername: profile.username}, function (err, tfacProfile) {
	      		if (err) {
	      			console.log(err);
	      		}
	      		if (tfacProfile === undefined || tfacProfile.length === 0) {
	      			console.log('profileMatch is undefined');
	      			let newUser = new User({
	      				twitchUsername: profile.username,
		      			twitchId: profile._id,
		      			twitchAccessToken: accessToken,
		      			email: profile.email,
		      			accessLevel: "general"
		      		});
		      		newUser.save(function (err, user) {
		      			if (err) {
		      				console.log("Error getting profile");
		      			}
		      		});
	      		} else {
	      			tfacProfile.twitchAccessToken = accessToken;
	      			User.findByIdAndUpdate(tfacProfile._id, tfacProfile, {new: true}, function (err, newProfile) {
	      				if (err) {
		      				console.log("Error getting profile");
		      			}
	      			});
	      		}
	    	}); 
	    	return done(null, profile);
	    });
	}
	);
}

module.exports = getStrategy;
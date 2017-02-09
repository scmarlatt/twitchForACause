const tfacSchemas = require('./sqldb/tfac-schemas');
const passport = require('passport');
const session = require('express-session');
const twitchtvStrategy = require('passport-twitchtv').Strategy;
const TWITCHTV_CLIENT_ID = 'kn61a7wj2x173shcjb2gimofz6wkki';
const TWITCHTV_CLIENT_SECRET = 'wnfhy2d7amrebow35ab2sfjixb8p96';

function getStrategy() {
	return new twitchtvStrategy({
	    clientID: TWITCHTV_CLIENT_ID,
	    clientSecret: TWITCHTV_CLIENT_SECRET,
	    callbackURL: "http://localhost:8080/auth/twitchtv/callback",
	    scope: "user_read"
  	},
	function (accessToken, refreshToken, profile, done) {

	    // asynchronous verification, for effect...
	    process.nextTick(function () {
	      
	      	// To keep the example simple, the user's Twitch.tv profile is returned to
	      	// represent the logged-in user.  In a typical application, you would want
	      	// to associate the Twitch.tv account with a user record in your database,
	      	// and return that user instead.
	      	console.log("PROFILE");
	      	console.log(profile);
	      	console.log(accessToken);
	      	let profileMatch;
	      	tfacSchemas.tfacUser.find({twitchUsername: profile.username}, function (err, tfacProfile) {
	      		console.log(tfacProfile);
	      		if (err) {
	      			console.log(err);
	      		}
	      		if (tfacProfile === undefined || tfacProfile.length === 0) {
	      			console.log('profileMatch is undefined');
	      			let newTfacUser = new tfacSchemas.tfacUser({
	      				twitchUsername: profile.username,
		      			twitchId: profile._id,
		      			twitchAccessToken: accessToken,
		      			email: profile.email,
		      			accessLevel: "general"
		      		});
		      		newTfacUser.save(function (err, user) {
		      			if (err) {
		      				res.status(500).send(err).redirect('/auth/twitchtv');
		      			}
		      			res.json(user);
		      		});
	      		}
	    	}); 
	    	return done(null, profile);
	    });
	}
	);
}

module.exports = {
	getStrategy: getStrategy
}
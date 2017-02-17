'use strict';
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	twitchUsername: String,
	twitchId: String,
	twitchAccessToken: String,
	email: String,
	accessLevel: String //admin, general
	//payment info?
});

const User = mongoose.model('User', userSchema);

module.exports = User;
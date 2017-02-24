'use strict';
const mongoose = require('mongoose');

const npoSchema = mongoose.Schema({
	ein: Number,
	name: String,
	address: String,
	city: String,
	state: String,
	country: String,
	deductibleStatus: String
});

const NPO = mongoose.model('NPO', npoSchema);

module.exports = NPO;
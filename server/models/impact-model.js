'use strict';
const mongoose = require('mongoose');

const impactSchema = mongoose.Schema({
	allTimeRaised: Number,
	raisedThisMonth: Number,
	raisedThisWeek: Number,
	raisedToday: Number,
	pledgedToday: Number,
	pledgedThisWeek: Number
});

const Impact = mongoose.model('Impact', impactSchema);

module.exports = Impact;
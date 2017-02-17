'use strict';
const mongoose = require('mongoose');

//need viewers?
const streamStatsSchema = mongoose.Schema({
	twitchId: String,
	newSubs: Number,
	reSubs: Number,
	deltaSubs: Number,
	newFollowers: Number,
	currentViewers: Number,
	peakViewers: Number,
	megaDays: Number,
	uptime: Number
});

const StreamStats = mongoose.model('StreamStats', streamStatsSchema);

module.exports = StreamStats;
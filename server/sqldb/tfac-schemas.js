//Schema definitions
'use strict';
var mongoose = require('mongoose');

var impactSchema = mongoose.Schema({
	allTimeRaised: Number,
	raisedThisMonth: Number,
	raisedThisWeek: Number,
	raisedToday: Number,
	pledgedToday: Number,
	pledgedThisWeek: Number
});

//need viewers?
var streamEventSchema = mongoose.Schema({
	userID:  String,
	startDate: Date,
	status: String,
	description: String,
	organization: String,
	rules: [{ruleType: String, _id: String}]
});

//need viewers?
var streamStatsSchema = mongoose.Schema({
	eventID: String,
	amountRaised: Number,
	newSubs: Number,
	reSubs: Number,
	deltaSubs: Number,
	newFollowers: Number,
	currentViewers: Number,
	peakViewers: Number,
	megaDays: Number,
	uptime: Number
}); 

//Rules need event ID?
var subRuleSchema = mongoose.Schema({
	pledgePerSub: Number,
	pledgePerReSub: Number,
	pledgePerNewSub: Number
});

var followerRuleSchema = mongoose.Schema({
	pledgePerNewFollower: Number
});

var peakViewerRuleSchema = mongoose.Schema({
	peakViewerGoal: Number,
	pledgeForPeakViewerGoal: Number
});

var xViewerRuleSchema = mongoose.Schema({
	pledgePerXViewersVal: Number,
	pledgePerXViewersAmount: Number
});

var megaDaysRuleSchema = mongoose.Schema({
	pledgePerPersonMegaDaysVal: Number,
	pledgePerPersonMegaDaysAmount: Number
});

var uptimeRuleSchema = mongoose.Schema({
	pledgePerHourUptime: Number
});

var tfacUserSchema = mongoose.Schema({
	tfacUsername: String,
	twitchUsername: String,
	email: String,
	age: Number
	//payment info?
});

//Create models for each schema
var impact = mongoose.model('impact', impactSchema);
var streamEvent = mongoose.model('streamEvent', streamEventSchema);
var streamStats = mongoose.model('streamStats', streamStatsSchema);
var subRule = mongoose.model('subRule', subRuleSchema);
var followerRule = mongoose.model('followerRule', followerRuleSchema);
var peakViewerRule = mongoose.model('peakViewerRule', peakViewerRuleSchema);
var xViewerRule = mongoose.model('xViewerRule', xViewerRuleSchema);
var megaDaysRule = mongoose.model('megaDaysRule', megaDaysRuleSchema);
var uptimeRule = mongoose.model('uptimeRule', uptimeRuleSchema);
var tfacUser = mongoose.model('tfacUser', tfacUserSchema);

//Export all models
module.exports = {
	// Using Mongoose schema definition to define db table
	impact: impact,
	streamEvent: streamEvent,
	streamStats: streamStats,
	subRule: subRule,
	followerRule: followerRule,
	peakViewerRule: peakViewerRule,
	xViewerRule: xViewerRule,
	megaDaysRule: megaDaysRule,
	uptimeRule: uptimeRule,
	tfacUser: tfacUser
};
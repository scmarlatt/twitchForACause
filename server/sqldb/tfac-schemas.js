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
	twitchId:  String,
	startDate: Date,
	status: String, //Upcoming, Active, Completed
	description: String,
	organization: String,
	totalAmountRaised: Number,
	//goal: Number,
	rules: [{ruleType: String, _id: String, amountRaised: Number}]
});

//need viewers?
var streamStatsSchema = mongoose.Schema({
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

//Rules need event ID?
var subRuleSchema = mongoose.Schema({
	//backers: [{twitchId: String}],
	subType: String,
	pledgePerSub: Number,
	limit: Number
});

var followerRuleSchema = mongoose.Schema({
	//backers: [{twitchId: String}],
	pledgePerNewFollower: Number,
	limit: Number
});

var peakViewerRuleSchema = mongoose.Schema({
	//backers: [{twitchId: String}],
	peakViewerGoal: Number,
	pledgeForPeakViewerGoal: Number
});

var xViewerRuleSchema = mongoose.Schema({
	//backers: [{twitchId: String}],
	pledgePerXViewersUnit: Number,
	pledgePerXViewersVal: Number,
	limit: Number
});

var megaDaysRuleSchema = mongoose.Schema({
	//backers: [{twitchId: String}],
	pledgePerPersonMegaDaysUnit: Number,
	pledgePerPersonMegaDaysVal: Number,
	limit: Number
});

var uptimeRuleSchema = mongoose.Schema({
	//backers: [{twitchId: String}],
	pledgePerHourUptime: Number,
	limit: Number
});

var tfacUserSchema = mongoose.Schema({
	twitchUsername: String,
	twitchId: String,
	twitchAccessToken: String,
	email: String,
	accessLevel: String //admin, general
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
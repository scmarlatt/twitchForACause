'use strict';
const mongoose = require('mongoose');

const subRuleSchema = mongoose.Schema({
	// backers: [{twitchId: String}],
	ruleType: {
		type: String,
		enum: ['SubRule']
	},
	subType: String,
	pledgePerSub: Number,
	limit: Number
});

const followerRuleSchema = mongoose.Schema({
	// backers: [{twitchId: String}],
	ruleType: {
		type: String,
		enum: ['FollowerRule']
	},
	pledgePerNewFollower: Number,
	limit: Number
});

const peakViewerRuleSchema = mongoose.Schema({
	// backers: [{twitchId: String}],
	ruleType: {
		type: String,
		enum: ['PeakViewerRule']
	},
	peakViewerGoal: Number,
	pledgeForPeakViewerGoal: Number
});

const xViewerRuleSchema = mongoose.Schema({
	// backers: [{twitchId: String}],
	ruleType: {
		type: String,
		enum: ['XViewerRule']
	},
	pledgePerXViewersUnit: Number,
	pledgePerXViewersVal: Number,
	limit: Number
});

const megaDaysRuleSchema = mongoose.Schema({
	// backers: [{twitchId: String}],
	ruleType: {
		type: String,
		enum: ['MegaDaysRule']
	},
	pledgePerPersonMegaDaysUnit: Number,
	pledgePerPersonMegaDaysVal: Number,
	limit: Number
});

const uptimeRuleSchema = mongoose.Schema({
	// backers: [{twitchId: String}],
	ruleType: {
		type: String,
		enum: ['UptimeRule']
	},
	pledgePerHourUptime: Number,
	limit: Number
});

const SubRule = mongoose.model('SubRule', subRuleSchema);
const FollowerRule = mongoose.model('FollowerRule', followerRuleSchema);
const PeakViewerRule = mongoose.model('PeakViewerRule', peakViewerRuleSchema);
const XViewerRule = mongoose.model('XViewerRule', xViewerRuleSchema);
const MegaDaysRule = mongoose.model('MegaDaysRule', megaDaysRuleSchema);
const UptimeRule = mongoose.model('UptimeRule', uptimeRuleSchema);

module.exports = {
	SubRule: SubRule,
	FollowerRule: FollowerRule,
	PeakViewerRule: PeakViewerRule,
	XViewerRule: XViewerRule,
	MegaDaysRule: MegaDaysRule,
	UptimeRule: UptimeRule
}
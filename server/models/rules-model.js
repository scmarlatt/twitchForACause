'use strict';
const mongoose = require('mongoose');

const subRuleSchema = mongoose.Schema({
	// backers: [{twitchId: String}],
	subType: String,
	pledgePerSub: Number,
	limit: Number
});

const followerRuleSchema = mongoose.Schema({
	// backers: [{twitchId: String}],
	pledgePerNewFollower: Number,
	limit: Number
});

const peakViewerRuleSchema = mongoose.Schema({
	// backers: [{twitchId: String}],
	peakViewerGoal: Number,
	pledgeForPeakViewerGoal: Number
});

const xViewerRuleSchema = mongoose.Schema({
	// backers: [{twitchId: String}],
	pledgePerXViewersUnit: Number,
	pledgePerXViewersVal: Number,
	limit: Number
});

const megaDaysRuleSchema = mongoose.Schema({
	// backers: [{twitchId: String}],
	pledgePerPersonMegaDaysUnit: Number,
	pledgePerPersonMegaDaysVal: Number,
	limit: Number
});

const uptimeRuleSchema = mongoose.Schema({
	// backers: [{twitchId: String}],
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
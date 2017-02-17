'use strict';
const mongoose = require('mongoose');

//need viewers?
const streamEventSchema = mongoose.Schema({
	twitchId:  String,
	startDate: Date,
	status: {
	    type: String,
	    enum: ['Active', 'Upcoming', 'Completed']
    },
	description: String,
	organization: String,
	totalAmountRaised: Number,
	//goal: Number,
	rules: [{
		ruleType: {
			    type: String,
			    enum: ['SubRule', 'FollowerRule', 'PeakViewerRule', 'XViewerRule', 'MegaDaysRule']
		    },
		_id: String, 
		amountRaised: Number
	}]
});

const StreamEvent = mongoose.model('StreamEvent', streamEventSchema);

module.exports = StreamEvent;

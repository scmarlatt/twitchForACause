// NEEDS:
// If user's stream crashes, have cron task spin for X minutes.
// If no stream after this period, automatically end the event and cron task
// Check that a stream is live before starting cron task


'use strict';
const StreamStats = require('../models/stream-stats-model');
const StreamEvent = require('../models/stream-event-model');
const RulesModel = require('../models/rules-model');
const TwitchApi = require('twitch-api');
const cron = require('node-cron');
const mongoose = require('mongoose');
const calculate = require('../util/calculations-util');
const Promise = require('bluebird');
mongoose.Promise = Promise;

function StreamWatcher() {
	this.twitchId = 'test';

	this.streamStats = {};

	this.twitch = new TwitchApi({
		clientId: process.env.TWITCHTV_CLIENT_ID,
		clientSecret: process.env.TWITCHTV_CLIENT_SECRET,
		redirectUri: 'http://localhost:9000/auth/twitchtv/callback',
		scopes: ['user_read']
	});

	this.watchChannelStatsTask = cron.schedule('*/5 * * * * *', () => {
		// still need to track subs rule
		Promise.promisify(this.twitch.getChannelStream(this.twitchId))
			.then((body) => {
				console.log('STREAM BODY\n\n');
				console.log(body);

				// update viewers and peak viewers
				this.streamStats.currentViewers = body.stream.viewers;
				if (body.stream.viewers > this.streamStats.peakViewers) {
					this.streamStats.peakViewers = body.stream.viewers;
				}

				// update mega days
				this.streamStats.megaDays += ((5 * body.stream.viewers) / (60 * 60 * 24 * 1000000)); // take time lapse from this job, add (time * users) / (60*60*24*1000000)

				// update uptime
				let startTime = new Date(body.stream.created_at);
				let now = new Date();
				this.streamStats.uptime = (now - startTime) / (1000 * 60); // converting to mins

				// write back
				return StreamStats.findOneAndUpdate({twitchId: this.twitchId}, this.streamStats, {new: true});
			}).catch((err) => {
				console.log(err);
			});
	}, false);

	this.startEvent = (req, res) => {
		// if (body.stream === null) { 
		// 	console.log("Please go live");
		// 	return "Please go live!";
		// }
		this.twitchId = req.query.twitchId;

		// find the stream event for this user, mark it as active
		let streamEventToInit;
		return StreamEvent.find({twitchId: this.twitchId})
			.then((streamEvent) => {
				streamEventToInit = streamEvent;
				streamEventToInit.status = 'Active';
				return StreamEvent.findByIdAndUpdate(streamEventToInit._id, streamEventToInit, {new: true});
			}).then((streamEvent) => {
				// create streamStats document to be updated throughout stream
				this.streamStats = new StreamStats({
					twitchId: this.twitchId,
					amountRaised: 0,
					newSubs: 0,
					reSubs: 0,
					deltaSubs: 0,
					newFollowers: 0,
					currentViewers: 0,
					peakViewers: 0,
					megaDays: 0,
					uptime: 0
				});
				// start watching channel
				this.watchChannelStatsTask.start();
				return res.status(200).send();
			}).catch((err) => {
				console.log('Stream event not found:\n');
				console.log(err);
				return res.status(500).send(err);
			});
	};

	this.endEvent = (req, res) => {
		this.twitchId = req.query.twitchId;
		console.log(this.streamStats);
		console.log('Event ended!');

		// find event
		let eventId = req.query._id;
		let x;
		let ruleTotal = 0;
		let eventToUpdate = new StreamEvent({
			twitchId: '',
			startDate: null,
			status: '', // Upcoming, Active, Completed
			description: '',
			organization: '',
			totalAmountRaised: 0,
			// goal: Number,
			rules: []
		});
		StreamEvent.findById(eventId, function(err, eventMatch) {
			eventToUpdate = eventMatch;
		});

		console.log(this.streamStats);
		// iterate over rules array
		for(x = 0; x < eventToUpdate.rules.length; ++x) {
			// update amount raised for each rule based on streamStats object
			// update total
			let ruleType = eventToUpdate.rules[x].ruleType;
			RulesModel[ruleType].findById(eventToUpdate.rules[x]._id, (err, eventRule) => {
				switch(ruleType) {
					case 'SubRule':
						ruleTotal = calculate.subTotalToGive({newSubs: this.streamStats.newSubs, reSubs: this.streamStats.reSubs, deltaSubs: this.streamStats.deltaSubs}, eventRule);
						eventToUpdate.rules[x].amountRaised = ruleTotal;
						eventToUpdate.totalAmountRaised += ruleTotal;
						break;
					case 'FollowerRule':
						ruleTotal = calculate.followerTotalToGive(this.streamStats.newFollowers, eventRule);
						eventToUpdate.rules[x].amountRaised = ruleTotal;
						eventToUpdate.totalAmountRaised += ruleTotal;
						break;
					case 'PeakViewerRule':
						ruleTotal = calculate.peakViewerTotalToGive(this.streamStats.peakViewers, eventRule);
						eventToUpdate.rules[x].amountRaised = ruleTotal;
						eventToUpdate.totalAmountRaised += ruleTotal;
						break;
					case 'XViewerRule':
						ruleTotal = calculate.xViewerTotalToGive(this.streamStats.peakViewers, eventRule);
						eventToUpdate.rules[x].amountRaised = ruleTotal;
						eventToUpdate.totalAmountRaised += ruleTotal;
						break;
					case 'MegaDaysRule':
						ruleTotal = calculate.megaDaysTotalToGive(this.streamStats.megaDays, eventRule);
						eventToUpdate.rules[x].amountRaised = ruleTotal;
						eventToUpdate.totalAmountRaised += ruleTotal;
						break;
					default:
						console.log('Error: invalid rule found');
						res.status(500).send({err: 'Error: invalid rule found'});
						break;
				}
			});
		}
		// mark event as completed
		// save eventToUpdate
		eventToUpdate.status = 'Completed';
		StreamEvent.findByIdAndUpdate(eventToUpdate._id, eventToUpdate, {'new': true}, (err, updatedEvent) => {
			if (err) {
				res.status(500).send({err: 'Error updating event'});
			} else {
				// send out charges
				this.watchChannelStatsTask.stop();
			}
		});
	};
}

// export this router
module.exports = {
	StreamWatcher: StreamWatcher
};

// NEEDS:
// FOR ALL POSTS, MAKE SURE YOU DO INPUT VALIDATIONS
'use strict';
const mongoose = require('mongoose');
const StreamEvent = require('../models/stream-event-model');
const RulesModel = require('../models/rules-model');
const Promise = require('bluebird');
const validator = require('../util/validate-fields-util');
const hasOwn = {}.hasOwnProperty;
mongoose.Promise = Promise;

function getEvents(req, res) {
	StreamEvent.find({}).then((eventList) => {
        res.status(200).send(eventList);
    }).catch((err) => {
		return res.status(500).send(err);
    });
}

function getEventsByStatus(req, res) {
	StreamEvent.find({status: req.params.status}).then((eventList) => {
		res.status(200).send(eventList);
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

// Combine with get rules from event?
function getEventById(req, res) {
	StreamEvent.findById(req.params.id).then((eventMatch) => {
        res.status(200).send(eventMatch);
	}).catch((err) => {
		res.status(500).send(err);
	});
}

function getRulesFromEventById(req, res) {
	let rulesList = [];
	let rulesResponse = [];

	StreamEvent.findById(req.params.id).then((eventMatch) => {
        rulesList = eventMatch.rules;

        let ruleListPromises = rulesList.map((rule) => {
			return RulesModel[rule.ruleType].findById(rule._id);
		});

		return Promise.all(ruleListPromises);
	}).then((rules) => {
		rules.forEach((item) => {
			rulesResponse.push(item);
		});

		return res.status(200).send(rulesResponse);
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

// NEED SOME WAY TO CHECK FOR DUPES???
function createEvent(req, res) {
	// input validation
	let fields = ['twitchId', 'startDate', 'description', 'organization', 'rules'];
	if(!validator.validateFields(req.body, fields) || req.body.rules.length === 0) {
		return res.status(500).send({err: 'Invalid input object'});
	}
	// create event to save
	let newEvent = new StreamEvent({
		twitchId: req.body.twitchId,
		startDate: req.body.startDate, // must be date format
		status: 'Upcoming',
		description: req.body.description,
		organization: req.body.organization,
		totalAmountRaised: 0,
		rules: []
	});
	// create promise.all
	// for each rule, add reference of it to newEvent.rules array, save rule
	// save new event
	let rulePromises = req.body.rules.map((rule) => {
		let newRule;
		if(!hasOwn.call(rule, 'ruleType')) {
			return res.status(500).send({err: 'Invalid rule object'});
		} else {
			if(!validator.validateFieldsByRule(rule)) {
				return res.status(500).send({err: 'Invalid rule object'});
			}
			switch(rule.ruleType) {
				case 'SubRule':
					newRule = new RulesModel.SubRule({
						ruleType: 'SubRule',
						subType: rule.subType,
						pledgePerSub: rule.pledgePerSub,
						limit: rule.limit
					});
					break;
				case 'FollowerRule':
					newRule = new RulesModel.FollowerRule({
						ruleType: 'FollowerRule',
						pledgePerNewFollower: rule.pledgePerNewFollower,
						limit: rule.limit
					});
					break;
				case 'PeakViewerRule':
					newRule = new RulesModel.PeakViewerRule({
						ruleType: 'PeakViewerRule',
						peakViewerGoal: rule.peakViewerGoal,
						pledgeForPeakViewerGoal: rule.pledgeForPeakViewerGoal
					});
					break;
				case 'XViewerRule':
					newRule = new RulesModel.XViewerRule({
						ruleType: 'XViewerRule',
						pledgePerXViewersUnit: rule.pledgePerXViewersUnit,
						pledgePerXViewersVal: rule.pledgePerXViewersVal,
						limit: rule.limit
					});
					break;
				case 'MegaDaysRule':
					newRule = new RulesModel.MegaDaysRule({
						ruleType: 'MegaDaysRule',
						pledgePerPersonMegaDaysUnit: rule.pledgePerPersonMegaDaysUnit,
						pledgePerPersonMegaDaysVal: rule.pledgePerPersonMegaDaysVal,
						limit: rule.limit
					});
					break;
				case 'UptimeRule':
					newRule = new RulesModel.UptimeRule({
						ruleType: 'UptimeRule',
						pledgePerHourUptime: rule.pledgePerHourUptime,
						limit: rule.limit
					});
					break;
				default:
					return res.status(500).send({err: 'Unrecognized rule type'});
			}
		}
		return newRule.save();
	});

	let promiseResults = Promise.all(rulePromises);
	promiseResults.then((savedRules) => {
		savedRules.forEach((rule) => {
			newEvent.rules.push({ruleType: rule.ruleType, _id: rule._id, amountRaised: 0});
		});
		return newEvent.save();
	}).then((savedEvent) => {
		return res.status(200).send(savedEvent);
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

// NEED TO ACCOUNT FOR RULES AS WELL
function updateEventById(req, res) {
	let fields = ['twitchId', 'startDate', 'description', 'organization', 'rules'];
	if(!validator.validateFields(req.body, fields)) {
		return res.status(500).send({err: 'Invalid input object'});
	}

	StreamEvent.findByIdAndUpdate(req.params.id, req.body, {'new': true}).then((updatedEvent) => {
        res.json(updatedEvent);
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

function createRule(req, res) {
	let ruleType = req.body.ruleType;
	if(!validator.validateFieldsByRule(req.body)) {
		return res.status(500).send({err: 'Invalid input object'});
	}

	let newRule = new RulesModel[ruleType](req.body.rule); // this should fail on save and go to catch if invalid object
	newRule.save().then((newRule) => {
        return StreamEvent.findById(req.params.id);
	}).then((foundEvent) => {
		foundEvent.rules.push({ruleType: newRule.ruleType, _id: newRule._id, amountRaised: 0});
		return StreamEvent.findByIdAndUpdate(foundEvent._id, foundEvent, {'new': true});
	}).then((updatedEvent) => {
		let responseBody = {                        
			newRule: newRule,
			updatedEvent: updatedEvent
		};
		return res.status(200).send(responseBody);
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

function updateRule(req, res) {
	let ruleName = req.body.ruleType;
	if(!validator.validateFieldsByRule(req.body)) {
		return res.status(500).send({err: 'Invalid input object'});
	}

	RulesModel[ruleName].findByIdAndUpdate(req.body._id, req.body, {'new': true}).then((updatedEvent) => {
        return res.status(200).send(updatedEvent);
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

function deleteRule(req, res) {
	let ruleName = req.body.ruleType;
	if(!validator.validateFieldsByRule(req.body)) {
		return res.status(500).send({err: 'Invalid input object'});
	}

	RulesModel[ruleName].remove({_id: req.body._id}).then(() => {
		return StreamEvent.findById(req.params.id);
	}).then((foundEvent) => {
		let x = 0;
		for(x; x < foundEvent.rules.length; ++x) {
			if(req.body._id === foundEvent.rules[x]._id) {
				foundEvent.rules.splice(x, 1);
				break;
			}
		}
		return StreamEvent.findByIdAndUpdate(foundEvent._id, foundEvent, {'new': true});
	}).then((updatedEvent) => {
		return res.status(200).send(updatedEvent);
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

function deleteEventById(req, res) {
	let rulesList = req.body.rules;
	let fields = ['_id'];
	if(!validator.validateFields(req.body, fields)) {
		return res.status(500).send({err: 'Invalid input object'});
	}
	let deletePromises = rulesList.map((rule) => {
		return RulesModel[rule.ruleType].remove({_id: rule._id});
	});
	let promiseResults = Promise.all(deletePromises);
	promiseResults.then((empty) => {
		return StreamEvent.remove({_id: req.params.id});
	}).then(() => {
		return res.status(200).send();
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

// export this router
module.exports = { 
	getEvents: getEvents,
	getEventsByStatus: getEventsByStatus, 
	getEventById: getEventById, 
	getRulesFromEventById: getRulesFromEventById, 
	createEvent: createEvent,
	updateEventById: updateEventById, 
	createRule: createRule,
	updateRule: updateRule,
	deleteRule: deleteRule,
	deleteEventById: deleteEventById, 
};

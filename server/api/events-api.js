// NEEDS:
'use strict';
const mongoose = require('mongoose');
const StreamEvent = require('../models/stream-event-model');
const RulesModel = require('../models/rules-model');
const Promise = require('bluebird');
mongoose.Promise = Promise;

function getEvents(req, res) {
	StreamEvent.find({}).then((eventList) => {
        res.json(eventList);
    }).catch((err) => {
		return res.status(500).send(err);
    });
}

function getEventsByStatus(req, res) {
	StreamEvent.find({status: req.params.status}).then((eventList) => {
		res.json(eventList);
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

// Combine with get rules from event?
function getEventById(req, res) {
	StreamEvent.findById(req.params.id).then((eventMatch) => {
        res.json(eventMatch);
	}).catch((err) => {
		res.status(500).send(err);
	});
}

function getRulesFromEventById(req, res) {
	let rulesList = [];
	let x = 0;
	let rulesResponse = [];
	let errorEncountered = false;
	StreamEvent.findById(req.params.id).then((eventMatch) => {
        console.log("EVENT MATCH");
        console.log(eventMatch);
        rulesList = eventMatch.rules;
	}).catch((err) => {
		return res.status(500).send(err);
	});

	rulesList.forEach((item) => {
		console.log("ITEM :::");
		console.log(item);
		switch(item.ruleType){
			case 'SubRule':
				console.log("SUB RULE FOUND");
				RulesModel.SubRule.findById(item._id, function (err, rule) {
					// handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        rulesResponse.push(rule);
				});
				break;
			case 'FollowerRule':
				RulesModel.FollowerRule.findById(item._id, function (err, rule) {
					// handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        rulesResponse.push(rule);
				});
				break;
			case 'PeakViewerRule':
				RulesModel.PeakViewerRule.findById(item._id, function (err, rule) {
					// handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        rulesResponse.push(rule);
				});
				break;
			case 'XViewerRule':
				RulesModel.XViewerRule.findById(item._id, function (err, rule) {
					// handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        rulesResponse.push(rule);
				});
				break;
			case 'MegaDaysRule':
				RulesModel.MegaDaysRule.findById(item._id, function (err, rule) {
					// handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        rulesResponse.push(rule);
				});
				break;
			case 'UptimeRule':
				RulesModel.UptimeRule.findById(item._id, function (err, rule) {
					// handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        rulesResponse.push(rule);
				});
				break;
			default:
				res.status(500).send({err: 'Unrecognized rule type'});
				errorEncountered = true;
				break;
		}
	});

	if(!errorEncountered){
		//res.json(rulesResponse);
		res.status(200).send(rulesResponse);
	}
}

// NEED SOME WAY TO CHECK FOR DUPES???
function createEvent (req, res) {
	// create event to save
	let newEvent = new StreamEvent({
		userID:  req.body.userID,
		startDate: req.body.startDate, // must be date format
		status: 'Upcoming',
		description: req.body.description,
		organization: req.body.organization,
		totalAmountRaised: 0,
		rules: []
	});
	// iterate over rules and add documents to correct models
	let x;
	let errorEncountered = false;
	for(x = 0; x < req.body.rules.length; ++x){
		switch(req.body.rules[x].ruleType){
			case 'SubRule':
				let newSubRule = new RulesModel.SubRule({
					subType: req.body.rules[x].subType,
					pledgePerSub: req.body.rules[x].pledgePerSub,
					limit: req.body.rules[x].limit
				});
				newSubRule.save(function (err, newRule) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
					newEvent.rules.push({ruleType: 'SubRule', _id: newRule._id});
				});
				break;
			case 'FollowerRule':
				let newFollowerRule = new RulesModel.FollowerRule({
					pledgePerNewFollower: req.body.rules[x].pledgePerNewFollower,
					limit: req.body.rules[x].limit
				});
				newFollowerRule.save(function (err, newRule) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
					newEvent.rules.push({ruleType: 'FollowerRule', _id: newRule._id});
				});
				break;
			case 'PeakViewerRule':
				let newPeakViewerRule = new RulesModel.PeakViewerRule({
					peakViewerGoal: req.body.rules[x].peakViewerGoal,
					pledgeForPeakViewerGoal: req.body.rules[x].pledgeForPeakViewerGoal
				});
				newPeakViewerRule.save(function (err, newRule) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
					newEvent.rules.push({ruleType: 'PeakViewerRule', _id: newRule._id});
				});
				break;
			case 'XViewerRule':
				let newXViewerRule = new RulesModel.XViewerRule({
					pledgePerXViewersVal: req.body.rules[x].pledgePerXViewersVal,
					pledgePerXViewersUnit: req.body.rules[x].pledgePerXViewersUnit,
					limit: req.body.rules[x].limit
				});
				newXViewerRule.save(function (err, newRule) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
					newEvent.rules.push({ruleType: 'XViewerRule', _id: newRule._id});
				});
				break;
			case 'MegaDaysRule':
				let newMegaDaysRule = new RulesModel.MegaDaysRule({
					pledgePerPersonMegaDaysVal: req.body.rules[x].pledgePerPersonMegaDaysVal,
					pledgePerPersonMegaDaysUnit: req.body.rules[x].pledgePerPersonMegaDaysUnit,
					limit: req.body.rules[x].limit
				});
				newMegaDaysRule.save(function (err, newRule) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
					newEvent.rules.push({ruleType: 'MegaDaysRule', _id: newRule._id});
				});
				break;
			case 'UptimeRule':
				let newUptimeRule = new RulesModel.UptimeRule({
					pledgePerHourUptime: req.body.rules[x].pledgePerHourUptime,
					limit: req.body.rules[x].limit
				});
				newUptimeRule.save(function (err, newRule) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
					newEvent.rules.push({ruleType: 'UptimeRule', _id: newRule._id});
				});
				break;
			default:
				res.status(500).send({err: 'Unrecognized rule type'});
				errorEncountered = true;
				break;
		}
	}

	if (!errorEncountered) {
		// save event if all rules added successfully
		newEvent.save(function (err, newEvent) {
		    if (err) {
		        res.status(500).send(err)
		    }
		    res.body.newEvent = newEvent;
		    res.status(200).send();
		});
	}
	// ADD ELSE CLAUSE?
}

// NEED TO ACCOUNT FOR RULES AS WELL
function updateEventById(req, res) {
	// update event
	StreamEvent.findByIdAndUpdate(req.params.id, req.body, {'new': true}).then((updatedEvent) => {
        res.json(updatedEvent);
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

function createRule(req, res) {
	let ruleName = req.body.ruleType;
	let newRule = new RulesModel[ruleName](req.body.rule);
	newRule.save().then((newRule) => {
        res.json(updatedEvent);
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

function updateRule(req, res) {
	let ruleName = req.body.ruleType;
	RulesModel[ruleName].findByIdAndUpdate(req.body._id, req.body, {'new': true}).then((updatedEvent) => {
        res.json(updatedEvent);
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

function deleteRule(req, res) {
	let ruleName = req.body.ruleType;
	RulesModel[ruleName].remove({id: req.body._id}).then(() => {
		res.status(200).send();
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

// NEED SOME WAY TO CHECK FOR DUPES???
function deleteEventById(req, res) {
	// iterate over rules and add documents to correct models
	let x;
	let errorEncountered = false;
	for(x = 0; x < req.body.rules.length; ++x){
		switch(req.body.rules[x].ruleType){
			case 'SubRule':
				RulesModel.SubRule.remove({id: req.body.rules[x]._id}, function(err) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
				});
				break;
			case 'FollowerRule':
				RulesModel.FollowerRule.remove({id: req.body.rules[x]._id}, function(err) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
				});
				break;
			case 'PeakViewerRule':
				RulesModel.PeakViewerRule.remove({id: req.body.rules[x]._id}, function(err) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
				});
				break;
			case 'XViewerRule':
				RulesModel.XViewerRule.remove({id: req.body.rules[x]._id}, function(err) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
				});
				break;
			case 'MegaDaysRule':
				RulesModel.MegaDaysRule.remove({id: req.body.rules[x]._id}, function(err) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
				});
				break;
			case 'UptimeRule':
				RulesModel.UptimeRule.remove({id: req.body.rules[x]._id}, function(err) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
				});
				break;
			default:
				res.status(500).send({err: 'Unrecognized rule type'});
				errorEncountered = true;
				break;
		}
	}

	// consider changing this to a promise with a .catch
	if (!errorEncountered) {
		StreamEvent.remove({id: req.params.id}, function(err) {
			if (err)
				res.status(500).send(err);
			res.status(200).send();
		});
	}
	// ADD ELSE CLAUSE?
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
// 	updateEventRules: updateEventRules, 
 };

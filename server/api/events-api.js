//NEEDS:

'use strict';

var mongoose = require('mongoose');
var tfacSchema = require('../sqldb/tfac-schemas');
var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
	console.log('Time: ', Date.now())
	next()
});

function getEvents (req, res) {
	tfacSchema.streamEvent.find({}, function (err, eventList) {
        //handle error
        if (err)
            res.status(500).send(err);
        res.json(eventList);
    });
}

function getEventsByStatus (req, res) {
	tfacSchema.streamEvent.find({status: req.params.status}, function (err, eventList) {
		if (err)
			res.status(500).send(err);
		res.json(eventList);
	});
}

//Combine with get rules from event?
function getEventById (req, res) {
	tfacSchema.streamEvent.findById(req.params.id, function (err, eventMatch) {
		//handle error
        if (err)
            res.status(500).send(err);
        res.json(eventMatch);
	});
}

function getRulesFromEventById (req, res) {
	let rulesList = [], x = 0, rulesResponse = {rules: []};
	tfacSchema.streamEvent.findById(req.params.id, function (err, eventMatch) {
		//handle error
        if (err)
            res.status(500).send(err);
        rulesList = eventMatch.rules;
	});
	for(x; x < rulesList.length; ++x){
		switch(rulesList[x].ruleType){
			case "subRule":
				tfacSchema.subRuleSchema.findById(rulesList[x]._id, function (err, rule) {
					//handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        rulesResponse.rules.push(rule);
				});
				break;
			case "followerRule":
				tfacSchema.followerRuleSchema.findById(rulesList[x]._id, function (err, rule) {
					//handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        rulesResponse.rules.push(rule);
				});
				break;
			case "peakViewerRule":
				tfacSchema.peakViewerRuleSchema.findById(rulesList[x]._id, function (err, rule) {
					//handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        rulesResponse.rules.push(rule);
				});
				break;
			case "xViewerRule":
				tfacSchema.xViewerRuleSchema.findById(rulesList[x]._id, function (err, rule) {
					//handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        rulesResponse.rules.push(rule);
				});
				break;
			case "megaDaysRule":
				tfacSchema.megaDaysRuleSchema.findById(rulesList[x]._id, function (err, rule) {
					//handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        rulesResponse.rules.push(rule);
				});
				break;
			case "uptimeRule":
				tfacSchema.uptimeRuleSchema.findById(rulesList[x]._id, function (err, rule) {
					//handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        rulesResponse.rules.push(rule);
				});
				break;
			default:
				res.status(500).send({err: "Unrecognized rule type"});
				errorEncountered = true;
				break;
		}
	}
	if(!errorEncountered){
		res.json(rulesResponse);
	}
}

//NEED SOME WAY TO CHECK FOR DUPES???
function createEvent (req, res) {
	//create event to save
	let newEvent = new tfacSchema.streamEvent({
		userID:  req.body.userID,
		startDate: req.body.startDate, //must be date format
		status: req.body.status,
		description: req.body.description,
		organization: req.body.organization,
		rules: []
	});
	//iterate over rules and add documents to correct models
	let x;
	let errorEncountered = false;
	for(x = 0; x < req.body.rules.length; ++x){
		switch(req.body.rules[x].ruleType){
			case "subRule":
				let newSubRule = new tfacSchema.subRuleSchema({
					pledgePerSub: req.body.rules[x].pledgePerSub,
					pledgePerReSub: req.body.rules[x].pledgePerReSub,
					pledgePerNewSub: req.body.rules[x].pledgePerNewSub
				});
				newSubRule.save(function (err, newRule) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
					newEvent.rules.push({ruleType: "subRule", _id: newRule._id});
				});
				break;
			case "followerRule":
				let newFollowerRule = new tfacSchema.followerRuleSchema({
					pledgePerNewFollower: req.body.rules[x].pledgePerNewFollower
				});
				newFollowerRule.save(function (err, newRule) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
					newEvent.rules.push({ruleType: "followerRule", _id: newRule._id});
				});
				break;
			case "peakViewerRule":
				let newPeakViewerRule = new tfacSchema.peakViewerRuleSchema({
					peakViewerGoal: req.body.rules[x].peakViewerGoal,
					pledgeForPeakViewerGoal: req.body.rules[x].pledgeForPeakViewerGoal
				});
				newPeakViewerRule.save(function (err, newRule) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
					newEvent.rules.push({ruleType: "peakViewerRule", _id: newRule._id});
				});
				break;
			case "xViewerRule":
				let newXViewerRule = new tfacSchema.xViewerRuleSchema({
					pledgePerXViewersVal: req.body.rules[x].pledgePerXViewersVal,
					pledgePerXViewersAmount: req.body.rules[x].pledgePerXViewersAmount
				});
				newXViewerRule.save(function (err, newRule) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
					newEvent.rules.push({ruleType: "xViewerRule", _id: newRule._id});
				});
				break;
			case "megaDaysRule":
				let newMegaDaysRule = new tfacSchema.megaDaysRuleSchema({
					pledgePerPersonMegaDaysVal: req.body.rules[x].pledgePerPersonMegaDaysVal,
					pledgePerPersonMegaDaysAmount: req.body.rules[x].pledgePerPersonMegaDaysAmount
				});
				newMegaDaysRule.save(function (err, newRule) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
					newEvent.rules.push({ruleType: "megaDaysRule", _id: newRule._id});
				});
				break;
			case "uptimeRule":
				let newUptimeRule = new tfacSchema.uptimeRuleSchema({
					pledgePerHourUptime: req.body.rules[x].pledgePerHourUptime
				});
				newUptimeRule.save(function (err, newRule) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
					newEvent.rules.push({ruleType: "uptimeRule", _id: newRule._id});
				});
				break;
			default:
				res.status(500).send({err: "Unrecognized rule type"});
				errorEncountered = true;
				break;
		}
	}

	if (!errorEncountered) {
		//save event if all rules added successfully
		newEvent.save(function (err, newEvent) {
		    if (err) {
		        res.status(500).send(err)
		    }
		    res.body.newEvent = newEvent;
		    res.status(200).send();
		});
	}
	//ADD ELSE CLAUSE?
}

// NEED TO ACCOUNT FOR RULES AS WELL
function updateEventById (req, res) {
	//update event
	tfacSchema.streamEvent.findByIdAndUpdate(req.params.id, req.body, {'new': true}, function (err, updatedEvent) {
		//handle error
        if (err) {
            res.status(500).send(err);
        }
        res.json(updatedEvent);
	});
}

function createRule (req, res) {
	let schemaName = req.body.ruleType + "Schema";
	let newRule = new tfacSchema[schemaName](req.body.rule);
	newRule.save(function (err, newRule) {
		if (err) {
            res.status(500).send(err);
        }
        res.json(updatedEvent);
	});
}

function updateRule (req, res) {
	let schemaName = req.body.ruleType + "Schema";
	tfacSchema[schemaName].findByIdAndUpdate(req.body._id, req.body, {'new': true}, function (err, updatedEvent) {
		//handle error
        if (err) {
            res.status(500).send(err);
        }
        res.json(updatedEvent);
	});
}

function deleteRule (req, res) {
	let schemaName = req.body.ruleType + "Schema";
	tfacSchema[schemaName].remove({id: req.body._id}, function(err) {
		if (err)
			res.status(500).send(err);
		res.status(200).send();
	});
}

/*
//update rules, on .success, update event
function updateEventRules (req, res) {
	let x, newRules = [];
	for(x = 0; x < req.body.rules.length; ++x){
		switch(req.body.rules[x].ruleType){
			case "subRule":
				tfacSchema.subRuleSchema.findByIdAndUpdate(req.body.rules[x]._id, req.body.rules[x], {'new': true}, function (err, rule) {
					//handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        newRules.push(rule);
				});
				break;
			case "followerRule":
				tfacSchema.followerRuleSchema.findByIdAndUpdate(req.body.rules[x]._id, req.body.rules[x], {'new': true}, function (err, rule) {
					//handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        newRules.push(rule);
				});
				break;
			case "peakViewerRule":
				tfacSchema.peakViewerRuleSchema.findByIdAndUpdate(req.body.rules[x]._id, req.body.rules[x], {'new': true}, function (err, rule) {
					//handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        newRules.push(rule);
				});
				break;
			case "xViewerRule":
				tfacSchema.xViewerRuleSchema.findByIdAndUpdate(req.body.rules[x]._id, req.body.rules[x], {'new': true}, function (err, rule) {
					//handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        newRules.push(rule);
				});
				break;
			case "megaDaysRule":
				tfacSchema.megaDaysRuleSchema.findByIdAndUpdate(req.body.rules[x]._id, req.body.rules[x], {'new': true}, function (err, rule) {
					//handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        newRules.push(rule);
				});
				break;
			case "uptimeRule":
				tfacSchema.uptimeRuleSchema.findByIdAndUpdate(req.body.rules[x]._id, req.body.rules[x], {'new': true}, function (err, rule) {
					//handle error
			        if (err) {
			        	errorEncountered = true;
			            res.status(500).send(err);
			        }
			        newRules.push(rule);
				});
				break;
			default:
				res.status(500).send({err: "Unrecognized rule type"});
				errorEncountered = true;
				break;
		}
	}
}
*/

//NEED SOME WAY TO CHECK FOR DUPES???
function deleteEventById (req, res) {
	//iterate over rules and add documents to correct models
	let x;
	let errorEncountered = false;
	for(x = 0; x < req.body.rules.length; ++x){
		switch(req.body.rules[x].ruleType){
			case "subRule":
				tfacSchema.subRuleSchema.remove({id: req.body.rules[x]._id}, function(err) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
				});
				break;
			case "followerRule":
				tfacSchema.followerRuleSchema.remove({id: req.body.rules[x]._id}, function(err) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
				});
				break;
			case "peakViewerRule":
				tfacSchema.peakViewerRuleSchema.remove({id: req.body.rules[x]._id}, function(err) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
				});
				break;
			case "xViewerRule":
				tfacSchema.xViewerRuleSchema.remove({id: req.body.rules[x]._id}, function(err) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
				});
				break;
			case "megaDaysRule":
				tfacSchema.megaDaysRuleSchema.remove({id: req.body.rules[x]._id}, function(err) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
				});
				break;
			case "uptimeRule":
				tfacSchema.uptimeRuleSchema.remove({id: req.body.rules[x]._id}, function(err) {
					if (err) {
						errorEncountered = true;
						res.status(500).send(err);
					}
				});
				break;
			default:
				res.status(500).send({err: "Unrecognized rule type"});
				errorEncountered = true;
				break;
		}
	}

	if (!errorEncountered) {
		tfacSchema.streamEvent.remove({id: req.params.id}, function(err) {
			if (err)
				res.status(500).send(err);
			res.status(200).send();
		});
	}
	//ADD ELSE CLAUSE?
}

//export this router
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
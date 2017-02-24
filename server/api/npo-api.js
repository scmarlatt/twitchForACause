// NEEDS:
// FOR ALL POSTS, MAKE SURE YOU DO INPUT VALIDATIONS
'use strict';
const mongoose = require('mongoose');
const NPO = require('../models/npo-model');
const Promise = require('bluebird');
const validateFields = require('../util/validate-fields-util');
mongoose.Promise = Promise;

function getNpos(req, res) {
	NPO.find({}).then((eventList) => {
        return res.status(200).send(eventList);
    }).catch((err) => {
		return res.status(500).send(err);
    });
}

function updateNpo(req, res) {
	let fields = ['ein', 'name', 'address', 'city', 'state', 'country', 'deductibleStatus'];
	if(!validateFields(req.body, fields)) {
		return res.status(500).send({err: 'Invalid input object'});
	}

	NPO.findByIdAndUpdate(req.body._id, req.body, {'new': true}).then((updatedEvent) => {
		return res.status(200).send(updatedEvent);
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

function createNpo(req, res) {
	let fields = ['ein', 'name', 'address', 'city', 'state', 'country', 'deductibleStatus'];
	if(!validateFields(req.body, fields)) {
		return res.status(500).send({err: 'Invalid input object'});
	}

	let newNpo = new NPO({
		ein: req.body.ein,
		name: req.body.name,
		address: req.body.address,
		city: req.body.city,
		state: req.body.state,
		country: req.body.country,
		deductibleStatus: req.body.deductibleStatus
	});
	newNpo.save().then((savedEvent) => {
		return res.status(200).send(savedEvent);	
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

function deleteNpo(req, res) {
	let fields = ['_id'];
	if(!validateFields(req.body, fields)) {
		return res.status(500).send({err: 'Invalid input object'});
	}

	NPO.remove({_id: req.body._id}).then((updatedEvent) => {
		return res.status(200).send(updatedEvent);
	}).catch((err) => {
		return res.status(500).send(err);
	});
}
module.exports = {
	getNpos: getNpos,
	updateNpo: updateNpo,
	createNpo: createNpo,
	deleteNpo: deleteNpo
};

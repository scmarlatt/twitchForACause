'use strict';

var mongoose = require('mongoose');
var Impact = require('../models/impact-model');
var express = require('express');
var router = express.Router();

/*
	impact::

	allTimeRaised: Number,
	raisedThisMonth: Number,
	raisedThisWeek: Number,
	raisedToday: Number,
	pledgedToday: Number,
	pledgedThisWeek: Number
*/

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next();
});

// Get impact statistics
router.get('/get', function (req, res) {
	tfacSchema.impact.find(function (err, statistics) {
		//handle error
		if (err)
			res.send(err);
		res.json(statistics);
	});
});

// Insert impact statistics
router.get('/insert', function (req, res) {
	Impact.insert(req.body);
});

// Update impact statistics
router.get('/update/id', function (req, res) {
	Impact.findById(req.id, function (err, impact) {
		if (err)
			res.send(err);
		impact = req.body;
		impact.save(function (err, updatedImpact) {
			if (err)
				res.send(err)
			res.json(updatedImpact);
		});
	});
});

//export this router
module.exports = router;
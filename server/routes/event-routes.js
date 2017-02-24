'use strict';

var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
let event = require('../api/events-api');

// middleware that is specific to this router
/*
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});
*/

// Get all events
router.get('/all', event.getEvents);

// Get all active events based on status
router.get('/all/:status', event.getEventsByStatus);

// Get event info based on event id
router.get('/get/:id', event.getEventById);

// Get rules corresponding to event
router.get('/get/rules/:id', event.getRulesFromEventById);

// Adding event
router.post('/create', event.createEvent);

// Updating event
router.post('/update/:id', event.updateEventById);

// Creating rule
router.post('/update/rules/create/:id', event.createRule);

// Updating rule
router.post('/update/rules/update', event.updateRule);

// Delete rule
router.post('/update/rules/delete/:id', event.deleteRule);

// Delete event by id
router.post('/delete/:id', event.deleteEventById);

// Updating Rules for event
//router.post('/update/rules', event.updateEventRules);

//export this router
module.exports = router;
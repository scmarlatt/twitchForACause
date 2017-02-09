'use strict';

var express = require('express');
var router = express.Router();

router.get('/nav', function(req,res){
	res.sendFile(__dirname + '../../client/app/views/nav.html');
});
router.get('/events', function(req,res){
	res.sendFile(__dirname + '../../client/app/views/events.html');
});


// Updating Rules for event
//router.post('/update/rules', event.updateEventRules);

//export this router
module.exports = router;
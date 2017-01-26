'use strict';
module.exports = function(app){

    // api -------------------------------------------------------------------------------------------------
	app.get('/api/events', function(req, res) {
		streamEvents.find(function(err, streamEvents) {
			if (err)
				res.send(err)
			res.json(streamEvents);
		});
	});

	app.post('/api/events', function(req, res) {
		streamEvents.create({
			STREAMER : req.body.STREAMER
		}, function(err, streamEvent) {
			if (err)
				res.send(err)
			streamEvents.find(function(err, streamEvents) {
				if (err)
					res.send(err)
				res.json(streamEvents);
			});
		});
	});

    //other routes..
}
var express = require('express');
var router = express.Router();
var streamApi = require('../api/stream-watcher-api');

//router.get('/channel/watch', channelApi.watchChannel);
var sw = new streamApi.StreamWatcher();

router.get('/event/start', sw.startEvent);

router.get('/event/end', sw.endEvent);


module.exports = router;
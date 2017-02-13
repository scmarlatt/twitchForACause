var express = require('express');
var router = express.Router();
var channelApi = require('../api/twitch/channel-info');

//router.get('/channel/watch', channelApi.watchChannel);
var cw = new channelApi.ChannelWatcher();

router.get('/event/start', cw.startEvent);

router.get('/event/end', cw.endEvent);


module.exports = router;
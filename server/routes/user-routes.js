'use strict';

var mongoose = require('mongoose');
var tfacSchema = require('../sqldb/tfac-schemas');
var express = require('express');
var router = express.Router();
let user = require('../api/user-api');

// middleware that is specific to this router
/*
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});
*/

// Get all users
router.get('/all', user.getUsers);

// Get user info based on user id
router.get('/:id', user.getUserById);

// Adding user
router.post('/newUser', user.addUser);

// Updating user
router.post('/:id', user.updateUser);

//export this router
module.exports = router;
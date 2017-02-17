'use strict';

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const userApi = require('../api/user-api');

// middleware that is specific to this router
/*
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});
*/

// Get all users
router.get('/all', userApi.getUsers);

// Get user info based on user id
router.get('/:id', userApi.getUserById);

// Adding user
router.post('/newUser', userApi.addUser);

// Updating user
router.post('/:id', userApi.updateUser);

//export this router
module.exports = router;
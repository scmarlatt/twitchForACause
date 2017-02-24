const mongoose = require('mongoose');
const Promise = require('bluebird');
const validator = require('../util/validate-fields-util');
mongoose.Promise = Promise;
const User = require('../models/user-model');

// Get user info based on user id
function getUsers(req, res) {
    User.find({}).then((users) => {
        res.json(users);
    }).catch((err) => {
        return res.status(500).send(err);
    });
}

// Get user info based on user id
function getUserById(req, res) {
    User.findById(req.params.id).then((user) => {
        res.json(user);
    }).catch((err) => {
        return res.status(500).send(err);
    });
}

// Adding user
function addUser(req, res) {
    let fields = ['twitchUsername', 'twitchId', 'twitchAccessToken', 'email', 'age'];
    if(!validator.validateFields(req.body, fields)) {
        return res.status(500).send({err: 'Invalid input object'});
    }

    let newUser = new User({
        twitchUsername: req.body.twitchUsername,
        twitchId: req.body.twitchId,
        twitchAccessToken: req.body.twitchAccessToken,
        email: req.body.email,
        age: req.body.age
    });

    User.findOne({'twitchUsername': req.body.twitchUsername}).then((userByEmail) => {
        if (userByEmail) {
            return res.status(500).send({'error': 'twitch user already exists'});
        } else {
            return User.findOne({'email': req.body.email});
        }
    }).then((userByEmail) => {
        if (userByEmail) {
            res.status(500).send({'error': 'email already in use'});
        } else {
            return newUser.save();
        }
    }).then((userSaved) => {
        res.json(userSaved);
    }).catch((err) => {
        res.status(500).send(err);
    });
}

// Updating user
function updateUser(req, res) {
    let fields = ['twitchUsername', 'twitchId', 'twitchAccessToken', 'email', 'age'];
    if(!validator.validateFields(req.body, fields)) {
        return res.status(500).send({err: 'Invalid input object'});
    }
    
    User.findByIdAndUpdate(req.params.id, req.body, {'new': true}).then((user) => {
        res.json(user);
    }).catch((err) => {
        res.status(500).send(err);
    });
}

// export all the functions
module.exports = {
    getUsers: getUsers,
    getUserById: getUserById,
    addUser: addUser,
    updateUser: updateUser
};

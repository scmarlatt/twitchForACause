let mongoose = require('mongoose');
let tfacSchema = require('../sqldb/tfac-schemas');

// Get user info based on user id
function getUsers (req, res) {
    tfacSchema.tfacUser.find({}, function (err, users) {
        //handle error
        if (err)
            res.status(500).send(err);
        res.json(users);
    });
}

// Get user info based on user id
function getUserById (req, res) {
    tfacSchema.tfacUser.findById(req.params.id, function (err, user) {
        //handle error
        if (err)
            res.status(500).send(err);
        res.json(user);
    });
}

// Adding user
function addUser (req, res) {
    var newUser = new tfacSchema.tfacUser({
        twitchUsername: req.body.twitchUsername,
        twitchId: req.body.twitchId,
        twitchAccessToken: req.body.twitchAccessToken,
        email: req.body.email,
        age: req.body.age
    });

    tfacSchema.tfacUser.findOne({'twitchUsername': req.body.twitchUsername}, function (err, user) {
        if (err)
            res.status(500).send(err);
        if (user) {
            res.status(500).send({ "error": "twitch user already exists" });
        } else {
            tfacSchema.tfacUser.findOne({'email': req.body.email}, function (err, user) {
                if (err)
                    res.status(500).send(err);
                if (user) {
                    res.status(500).send({ "error": "email already in use" });
                } else {
                    newUser.save(function (err, user) {
                        if (err) 
                            res.status(500).send(err);
                        res.json(user);
                    });
                }
            });
        }
    });
}

// Updating user
function updateUser (req, res) {
    tfacSchema.tfacUser.findByIdAndUpdate(req.params.id, req.body, {'new': true}, function (err, user) {
        //handle error
        if (err) {
            res.status(500).send(err);
        }
        res.json(user);
    });
}

//export all the functions
module.exports = { getUsers: getUsers, getUserById: getUserById, addUser: addUser, updateUser: updateUser };
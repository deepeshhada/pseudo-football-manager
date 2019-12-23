const User = require('../models/user');
const Player = require('../models/player');
const Manager = require('../models/manager');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post('/register', (req, res) => {
        if (!req.body.username) {
            res.json({ success: false, message: 'You must enter a username' });
        } else if (!req.body.password) {
            res.json({ success: false, message: 'You must enter a password' });
        } else if (!req.body.fullname) {
            res.json({ success: false, message: 'You must enter your name' });
        } else if (!req.body.club) {
            res.json({ success: false, message: "You must enter your club's name" });
        } else if (!req.body.nationality) {
            res.json({ success: false, message: 'You must enter your nationality' });
        } else {
            let user = new User({
                username: req.body.username.toLowerCase(),
                password: req.body.password,
                fullname: req.body.fullname,
                club: req.body.club,
                designation: 'player'
            });
            let player = new Player({
                username: req.body.username.toLowerCase(),
                password: req.body.password,
                fullname: req.body.fullname,
                club: req.body.club,
                nationality: req.body.nationality
            });
            user.save((err) => {
                if (err) {
                    if (err.code === 11000) {
                        res.json({ success: false, message: 'Username already exists. ' });
                    } else if (err.errors) {
                        if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message });
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                        }
                    }
                    res.json({ success: false, message: 'Could not save user. Error: ', err });
                } else {
                    player.save((err) => {
                        if (err) {
                            res.json({ success: false, message: 'Could not save player. Error: ', err });
                        } else {
                            res.json({ success: true, message: 'Player registered successfully!' });
                        }
                    });
                }
            });
        }
    });

    router.post('/login', (req, res) => {
        if (!req.body.username) {
            res.json({ success: false, message: 'No username was provided' });
        } else if (!req.body.password) {
            res.json({ success: false, message: 'No password was provided' });
        } else {
            User.findOne({ username: req.body.username }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else if (!user) {
                    res.json({ success: false, message: 'Username not found' });
                } else {
                    if (req.body.password !== user.password) {
                        res.json({ success: false, message: 'Invalid password' });
                    } else {
                        const token = jwt.sign({ username: user.username, designation: user.designation, club: user.club }, config.secret, { expiresIn: '24h' });
                        res.json({ success: true, message: 'Success', token: token, user: { username: user.username } });
                    }
                }
            });
        }
    });

    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            res.json({ success: false, message: 'No token provided' });
        } else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.json({ success: false, message: 'Token invalid: ' + err });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    });

    router.get('/profile', (req, res) => {
        if (req.decoded.designation === 'player') {
            Player.findOne({ username: req.decoded.username }).select('username fullname club nationality').exec((err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'User not found' });
                    } else {
                        res.json({ success: true, user: user });
                    }
                }
            });
        } else if (req.decoded.designation === 'manager') {
            Manager.findOne({ username: req.decoded.username }).select('username fullname club nationality').exec((err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'User not found'} );
                    } else {
                        res.json({ success: true, user: user });
                    }
                }
            });
        }

    })

    router.get('/dashboard', (req, res) => {
        if (req.decoded.designation === 'player') {
            Player.findOne({ username: req.decoded.username }).select('bids').exec((err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'User not found' });
                    } else {
                        res.json({ success: true, user: user });
                    }
                }
            });
        } else if (req.decoded.designation === 'manager') {
            Player.find({ club: { $ne: req.decoded.club } }).select('username fullname club nationality').exec((err, user)=> {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'User not found' });
                    } else {
                        res.json({ success: true, user: user });
                    }
                }
            });
        }
    })

    return router;
};
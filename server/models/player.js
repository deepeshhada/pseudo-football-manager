const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const playerSchema = new Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    fullname: String,
    club: String,
    nationality: String,
    bids: [ { biddingClub: { type: String, unique: true }, amount: Number } ]
});

playerSchema.pre('save', function(next) {
    if (!this.isModified('password'))
        return next();
    
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

module.exports = mongoose.model('Player', playerSchema);
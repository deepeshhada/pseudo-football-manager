const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

var emailLengthChecker = (email) => {
    if (!email) {
        return false;
    } else if (email.length < 5 || email.length > 35) {
        return false;
    } else {
        return true;
    }
};

var validEmailChecker = (email) => {
    if (!email) {
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
};

const emailValidators = [
    {
        validator: emailLengthChecker,
        message: 'Email must be at least 5 characters and at most 35 characters'
    },
    {
        validator: validEmailChecker,
        message: 'Invalid Email entered'
    }
];

var passwordLengthChecker = (password) => {
    if (!password) {
        return false;
    } else if (password.length < 8 || password.length > 20) {
        return false;
    } else {
        return true;
    }
};

var validPasswordChecker = (password) => {
    if (!password) {
        return false;
    } else {
        const regExp = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/);
        return regExp.test(password);
    }
};

const passwordValidators = [
    {
        validator: passwordLengthChecker,
        message: 'Password length must be at least 8 characters and at most 20 characters'
    },
    {
        validator: validPasswordChecker,
        message: 'Password must have at least one uppercase, lowercase, special character, and number'
    }
];

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    password: { type: String, required: true, validate: passwordValidators },
    fullname: String,
    club: String,
    designation: String
});

module.exports = mongoose.model('User', userSchema);
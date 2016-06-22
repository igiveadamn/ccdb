var mongoose = require('mongoose');
var schema = require('./schema');
var tokens = require('../utils/tokens');
var _ = require('lodash');

var postmark = require('postmark')(process.env.POSTMARK_API_TOKEN);

var User = mongoose.model('User', schema.userSchema);

var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

module.exports = {
    list: function (request, response) {
        User.find(function (err, result) {
            if (err) {
                console.log(err);
                response.json(err);
                return;
            }
            response.json(result);
        });
    },

    single: function (request, response) {
        User.findById(request.query.userId, function (err, result) {
            if (err) {
                console.log(err);
                response.json(err);
                return;
            }
            response.json(result);
        });
    },

    save: function (request, response) {
        var user = request.body.user;
        var id = user._id || new mongoose.Types.ObjectId();

        // for new records, set a password change token and send email.
        if (!user._id) {
            user.passwordChange = tokens.generateToken(user).token;
        }

        delete user._id;
        delete user.__v;
        delete user.password;

        User.findByIdAndUpdate(id, user, {upsert: true}, function (err, user) {
            if (err) {
                console.log(err);
                response.json(err);
                return;
            }
            if (user.passwordChange) {
                //send email.
                postmark.send({
                    From: 'andy@igiveada.mn',
                    To: user.username,
                    Subject: 'Please reset your CCDB password',
                    HtmlBody: 'Please click on the link to reset your CCDB password: <a href="' + process.env.CCDB_SERVER + '#/password/'+ user.passwordChange +'">Reset password</a>',
                    Tag: 'reset password'
                }, function (error, success) {
                    if (error) {
                        console.error('Unable to send via postmark: ' + error.message);
                        response.json(error);
                        return;
                    }
                    console.info('Sent to postmark for delivery');

                    delete user.passwordChange;
                    response.json(user);
                });
            } else {
                response.json(user);
            }
        });
    },

    login: function (username, password, callBack) {
        User.findOne({username: username}, function (err, user) {
            if (err) {
                console.log(err);
                callBack();
            }
            if(user) {
                bcrypt.compare(password, user.password, function (err, isMatch) {
                    if (err) {
                        console.log('Attempt failed to login with ' + user.username);
                        console.log(err);
                        callBack();
                    }
                    callBack(isMatch ? user : undefined);
                });
            } else {
                console.log('Incorrect Username or Password');
                return callBack(undefined);
            }
        });
    },

    lookup: function (username, callBack) {
        User.findOne({username: username}, function (err, user) {
            if (err) {
                console.log(err);
                callBack();
            }
            callBack({
                username: user.username,
                name: user.name,
                hospital: user.hospital,
                role: user.role
            });
        });
    },

    reset: function (username, callBack) {
        User.findOne({username: username}, function (err, user) {
            if (err) {
                console.log(err);
                callBack();
            } else if (!user) {
                console.log('reset: no user found for ' + username);
                callBack();
            } else {
                user.passwordChange = tokens.generateToken(user).token;
                user.save();

                //send email.
                postmark.send({
                    From: 'andy@igiveada.mn',
                    To: user.username,
                    Subject: 'Please reset your CCDB password',
                    HtmlBody: 'Please click on the link to reset your CCDB password: <a href="' + process.env.CCDB_SERVER + '#/password/'+ user.passwordChange +'">Reset password</a>',
                    Tag: 'reset password'
                }, function (error, success) {
                    if (error) {
                        console.error('Unable to send via postmark: ' + error.message);
                        callBack();
                    }
                    console.info('Sent to postmark for delivery');
                    callBack({
                        username: user.username,
                        name: user.name,
                        hospital: user.hospital,
                        role: user.role
                    });
                });
            }
        });
    },

    changePassword: function (token, password, callBack) {
        User.findOne({passwordChange: token}, function (err, user) {
            if (err) {
                console.log(err);
                callBack();
            }
            bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                if (err) {
                    console.log(err);
                    callBack();
                }

                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                        console.log(err);
                        callBack();
                    }
                    user.password = hash;
                    user.passwordChange = undefined;
                    user.save();
                    callBack(user);
                });
            });
       });
    }
};

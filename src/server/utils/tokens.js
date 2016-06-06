var jwt = require('jwt-simple');
var secret = require('../config/secret');

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = {
    generateToken: function (user) {
        var expires = expiresIn(7); // 7 days
        var token = jwt.encode(
            {
                exp: expires
            },
            secret.secretToken);

        return {
            token: token,
            expires: expires,
            user: user
        };
    }
};

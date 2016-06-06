var jwt = require('jwt-simple');
var secret = require('../config/secret.js');

module.exports = function(request, response, next) {
    var token = (request.body && request.body.access_token) || (request.query && request.query.access_token) || request.headers['x-access-token'];
    if (token) {
        try {
            var decoded = jwt.decode(token, secret.secretToken);
            if (decoded.exp <= Date.now()) {
                response.status(400);
                response.json({
                    'status': 400,
                    'message': 'Token Expired'
                });
                return;
            }
            next();
        } catch (err) {
            response.status(500);
            response.json({
                'status': 500,
                'message': 'Oops something went wrong',
                'error': err
            });
        }
    } else {
        response.status(401);
        response.json({
            'status': 401,
            'message': 'Invalid Token or Key'
        });
        return;
    }
};

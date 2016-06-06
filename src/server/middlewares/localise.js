var user = require('../models/user.js');

module.exports = function(request, response, next) {
    var key = (request.body && request.body.x_key) || (request.query && request.query.x_key) || request.headers['x-key'];
    if (key) {
        try {
            user.lookup(key, function (lookedUpUser) {
                if (lookedUpUser && lookedUpUser.hospital) {
                    request.hospital = lookedUpUser.hospital;
                    next();
                } else {
                    response.status(401);
                    response.json({
                        'status': 401,
                        'message': 'Hospital not specified for user'
                    });
                    return;
                }
            });
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

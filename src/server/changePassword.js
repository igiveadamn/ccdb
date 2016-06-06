var user = require('./models/user.js');
var tokens = require('./utils/tokens.js');

module.exports = {
    changePassword: function (request, response) {
        var token = request.body.token|| '';
        var password = request.body.password || '';

        if (token === '' || password === '') {
            response.status(401);
            response.json({
                'status': 401,
                'message': 'Invalid credentials'
            });
            return;
        }

        user.changePassword(token, password, function(user) {
            if (!user) { // If authentication fails, we send a 401 back
                response.status(401);
                response.json({
                    'status': 401,
                    'message': 'Invalid credentials'
                });
                return;
            }

            if (user) {
                response.json(tokens.generateToken(user));
            }
        });
    }
};

var user = require('./models/user.js');
var tokens = require('./utils/tokens.js');

module.exports = {
    login: function (request, response) {
        var username = request.body.username || '';
        var password = request.body.password || '';

        if (username === '' || password === '') {
            response.status(401);
            response.json({
                'status': 401,
                'message': 'Invalid credentials'
            });
            return;
        }

        user.login(username, password, function(loggedInUser) {
            if (!loggedInUser) { // If authentication fails, we send a 401 back
                response.status(401);
                response.json({
                    'status': 401,
                    'message': 'Invalid credentials'
                });
                return;
            }

            if (loggedInUser) {
                response.json(tokens.generateToken(loggedInUser));
            }
        });
    }
};

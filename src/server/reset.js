var user = require('./models/user.js');

module.exports = {
    reset: function (request, response) {
        var username = request.body.username || '';

        if (username === '') {
            response.status(401);
            response.json({
                'status': 401,
                'message': 'Invalid username'
            });
            return;
        }

        user.reset(username, function(user) {
            if (!user) {
                response.status(401);
                response.json({
                    'status': 401,
                    'message': 'Invalid credentials'
                });
                return;
            }

            if (user) {
                response.json(user);
            }
        });
    }
};

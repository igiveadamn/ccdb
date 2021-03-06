var user = require('../models/user.js');

module.exports = function(minLevel) {
  if (!minLevel) {
    minLevel = 'admin';
  }
  return function(request, response, next) {
    var key = (request.body && request.body.x_key) || (request.query && request.query.x_key) || request.headers['x-key'];
    if (key) {
      try {
        user.lookup(key, function (lookedUpUser) {
          if (lookedUpUser) {
            if (lookedUpUser.role == 'admin') {
              request.role = 'admin';
              next();
            } else if (lookedUpUser.role == 'hospital-administrator') {
              if (minLevel === 'admin') {
                response.status(403);
                response.json({
                  'status': 403,
                  'message': 'Not Authorized'
                });
                return;
              }
              request.role = 'hospital-administrator';
              next();
            } else {
              response.status(403);
              response.json({
                'status': 403,
                'message': 'Not Authorized'
              });
              return;
            }
          } else {
            response.status(401);
            response.json({
              'status': 401,
              'message': 'Invalid User'
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
};

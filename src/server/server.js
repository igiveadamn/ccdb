var http = require('http');
var express = require('express');
var cache = require('express-cache-headers');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var reset = require('./reset.js');
var login = require('./login.js');
var changePassword = require('./changePassword.js');

var patient = require('./models/patient');
var user = require('./models/user.js');

var connect = function () {
    mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/ccdb');
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

var app = express();

app.set('port', process.env.PORT || 8080);

app.use(logger('dev'));
app.use(bodyParser.json());

// set up standard headers for all responses
app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// set up available endpoints
// routes that can be accessed by any one
app.post('/api/login', login.login);
app.post('/api/password', changePassword.changePassword);
app.post('/api/reset', reset.reset);

//routes that can be accessed only by authenticated users
app.all('/api/patient/*', [require('./middlewares/authenticate'), require('./middlewares/localise')]);
app.get('/api/patient/suggestions', patient.suggestions);
app.get('/api/patient/patients', patient.list);
app.get('/api/patient/search', patient.search);
app.get('/api/patient/patient', patient.single);
app.post('/api/patient/patient', patient.save);

//routes that can be accessed only by authenticated & authorised users
app.all('/api/user/*', [require('./middlewares/authenticate'), require('./middlewares/authorise')]);
app.get('/api/user/users', user.list);
app.get('/api/user/user', user.single);
app.post('/api/user/user', user.save);

// Download - admin only (authenticated & authorised users)
// TODO: fix authentication for non JS => API calls
app.all('/downloads/*', [require('./middlewares/authenticate'), require('./middlewares/authorise')]);
app.get('/downloads/csv', require('./csv-export/req-handler')(mongoose.connection));

// static content (angular stuff)
app.use(cache(3 * 3600));
app.use(express.static(path.join(__dirname, '../client')));

// catch all others
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

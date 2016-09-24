var express = require('express');
var session = require('express-session');
var routes = require('./app/routes/index.js');
require('dotenv').load();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
require('./app/config/passport')(passport);
//YELP API code from Arian Faurtosh
var oauthSignature = require('oauth-signature');  
var n = require('nonce');  
var request = require('request');  
var qs = require('querystring');  
var _ = require('lodash');

mongoose.connect(process.env.MONGO_URI);

var app = express();

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
	secret: 'whereugo',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
'use strict';

var path = process.cwd();

var searchMngr = require(path+'/app/controllers/apisearch.server.js');
var countMngr = require(path+'/app/controllers/counter.server.js');


module.exports = function (app,passport) {
	
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	app.route('/')
	.get(function (req, res) {
		res.sendFile(path + '/public/index.html');
	});

	app.route('/search')
	.get(searchMngr);

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/userdata')
		.get(function (req, res) {
			console.log(req.user);
			res.json(req.user);
		});

	app.route('/add')
		.get(isLoggedIn, countMngr);

	app.route('/auth/facebook')
		.get(passport.authenticate('facebook'));

	app.route('/auth/facebook/callback')
		.get(passport.authenticate('facebook', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

};
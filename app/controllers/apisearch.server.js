'use strict';
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();
var request = require('request');  
var qs = require('querystring');  
var _ = require('lodash');
var User = require('../models/users.js');
var Places = require('../models/places.js');

function searchMngr (req, res) {

	/* Function for yelp call
	 * ------------------------
	/* based on Arian Faurtosh code 

	/* The type of request */
	var httpMethod = 'GET';

	/* The url we are using for the request */
	var url = 'http://api.yelp.com/v2/search';

	/* We can setup default parameters here */
	var default_parameters = {
		sort: '2'
	};

	//collect the data from the reserch URL
	var input = {};
	input.term = req.query.input;
	input.location = req.query.location;


	/* We set the require parameters here */
	var required_parameters = {
		oauth_consumer_key : process.env.oauth_consumer_key,
		oauth_token : process.env.oauth_token,
		oauth_nonce : n(),
		oauth_timestamp : n().toString().substr(0,10),
		oauth_signature_method : 'HMAC-SHA1',
		oauth_version : '1.0'
	};

	/* We combine all the parameters in order of importance */ 
	var parameters = _.assign(default_parameters, input, required_parameters);

	console.log(parameters);

	/* We set our secrets here */
	var consumerSecret = process.env.consumerSecret;
	var tokenSecret = process.env.tokenSecret;

	/* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
	/* Note: This signature is only good for 300 seconds after the oauth_timestamp */
	var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

	/* We add the signature to the list of paramters */
	parameters.oauth_signature = signature;

	/* Then we turn the paramters object, to a query string */
	var paramURL = qs.stringify(parameters);

	/* Add the query string to the url */
	var apiURL = url+'?'+paramURL;

	if(req.user){
		User
			.findOneAndUpdate({ 'user.id': req.user.user.id }, { $set: { 'lastSearch': input } }, {new: true})
			.exec(function (err, result) {
				if (err) { throw err}
					console.log('working');
					console.log(result);
				})
	};

	/* Then we use request to send make the API Request */
	request(apiURL, function(error, response, body){
			res.send(body);
	});

};

module.exports = searchMngr;
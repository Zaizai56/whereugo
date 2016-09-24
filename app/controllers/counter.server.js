'use strict';
var User = require('../models/users.js');
var Places = require('../models/places.js');
var mongoose = require('mongoose');


//function to count the people that will join an event
function countMngr (req, res) {
//pl will hold the content of the data for the place
	var pl = [];
	Places
		.findOneAndUpdate({ 'placeID': req.query.displayName }, pl, {upsert: true, new:true})
		.exec(function(err, place){
//checking that the user have not yet signed up for this place
			var check = true;
				for (var i=0;i<place.going.length;i++){
					if (place.going[i] == req.user.user.displayName){
						check = false;
						place.going.splice(i, 1);
					};
				};
//if confirmed, add the user to the MongoDB record
			if (check){
				place.going.push(req.user.user.displayName);
			};
			place.save();
//send back the list of user who sign for the place
			var answer = { 'going': place.going };
			res.json(answer);
		})
};

module.exports = countMngr;
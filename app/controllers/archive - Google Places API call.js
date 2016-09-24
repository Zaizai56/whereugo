	var API_KEY = process.env.API_KEY;
	var searchURL = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=bar+in+thonglor&types=food|bar&location=13.7244425,100.3529159&key=' + API_KEY
	var answer = {};

	var req = https.get(searchURL, function(json) {
		json.on('data', (chunk) => {
	    	answer += chunk;
		});
		json.on('end', () => {
			res.json(answer);
			console.log(answer);
		});
	}).on('error', function(e){
		console.log("Got an error: ", e);
	});
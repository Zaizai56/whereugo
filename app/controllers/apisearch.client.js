'use strict';

(function () {
	var search = document.querySelector('#search');
	var location = document.querySelector('#location');
	var addButton = {};
	var resultList = [];
	var isLogged = false;

	console.log('send user request');
	ajaxFunctions.ajaxRequest('GET', '/userdata', function (user) {
		user = JSON.parse(user);
		if (user) isLogged = true;
		console.log(user);
		if (user.lastSearch) {
			search.value = user.lastSearch.term;
			location.value = user.lastSearch.location;
			yelpCall ();
		};
	});

	function yelpCall (){
//clean the previous results, if any
	var clearDiv = document.getElementById("searchResults");
	while (clearDiv.firstChild) {
		clearDiv.removeChild(clearDiv.firstChild);
	};
	var master = document.getElementById('searchResults');
	var loading = document.createElement('img');
	loading.src = '/public/img/loading.gif';
	master.appendChild(loading);
	var loadUrl= '/search?input=' + search.value +'&location=' + location.value;
	ajaxFunctions.ajaxRequest('GET', loadUrl, function (poll) {
		resultList = [];
		poll = JSON.parse(poll);
		console.log(poll);
		console.log(poll.businesses.length);
		loading.parentNode.removeChild(loading);
		var i = 0;
		for (i=0;i<poll.businesses.length;i++){
			resultList.push(poll.businesses[i].id)
			var div1 = document.createElement('div');
			var div2 = document.createElement('div');
			var label = document.createElement('label');
			var a = document.createElement('a');
			var img = document.createElement('img');
			var imgRating = document.createElement('img');
			img.setAttribute('class','imgResults');
			var btnIGo = document.createElement('button');
			var snippet = document.createTextNode(poll.businesses[i].snippet_text)
			btnIGo.appendChild(document.createTextNode("I'm going !"));
			div1.setAttribute('class', 'YelpResults');
			div2.setAttribute('class', 'contentResults')
			btnIGo.id= i;
			btnIGo.setAttribute('class', 'btnIGo');
			label.appendChild(document.createTextNode(poll.businesses[i].name));
			a.href = poll.businesses[i].url;
			img.src = poll.businesses[i].image_url;
			imgRating.src = poll.businesses[i].rating_img_url_small;
			div1.appendChild(img);
			a.appendChild(label);
			div2.appendChild(a);
			div2.appendChild(document.createTextNode('  '));
			div2.appendChild(imgRating);
			div2.appendChild(document.createElement('br'));
			div2.appendChild(snippet);
			div1.appendChild(div2);
			div1.appendChild(btnIGo);
			master.appendChild(div1);
		}
	});


	};

	document.getElementById("location").addEventListener("keyup", function(event) {
		    if (event.keyCode == 13) {
		        document.getElementById("sendSearch").click();
		    }
	});

	document.getElementById('sendSearch').addEventListener('click', function () {
		if (search.value && location.value){
			yelpCall ();
		} else {
			 alert('Where you go ?\ntell us what and where you are going...');
		}
	} , false);

	document.getElementById('searchResults').addEventListener('click', function (event) {
//check if the user is logged in. If not, redirect to the login page
		if(isLogged){
			if (event.target.className == 'btnIGo') {
				var placeID = resultList[event.target.id];
				var addUrl= '/add?id=' + placeID;
				ajaxFunctions.ajaxRequest('GET', addUrl, function (count) {
//update the button innner html with the number of people going to the place
					count = JSON.parse(count);
					event.target.innerHTML = count.going.length + ' going';
				})
			};
			
		} else {
			window.location = '/login'
		};
	}, false);

})();




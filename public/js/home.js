window.fbAsyncInit = function() {
	// init the FB JS SDK
	FB.init({
	appId      : '576850129012966',                        // App ID from the app dashboard
	channelUrl : 'http://localhost:3000/channel.html', // Channel file for x-domain comms
	status     : true,                                 // Check Facebook Login status
	xfbml      : true                                  // Look for social plugins on the page
	});

FB.Event.subscribe('auth.authResponseChange', function(response) {
	// Here we specify what we do with the response anytime this event occurs. 
	if (response.status === 'connected') {
		console.log(window.location);
		if (window.location.pathname != "/home"){
			window.location = "/home";
			return;
		}

		info(response.authResponse.accessToken);
	} else if (response.status === 'not_authorized') {
		FB.login();
	} else {
		FB.login();
	}
});
};

// Load the SDK asynchronously
(function(d){
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));

function info(accessToken){
console.log('Creating/Finding user');
	FB.api('/me', function(response) {
		console.log(response);
		$.ajax({
			url: "/user",
			type: "POST",
			data: { 
				fb_fname: response.first_name, 
				fb_lname:response.last_name, 
				fb_id: response.id, 
				fb_token:	accessToken
					},
			dataType: "json",
			success: function (result) {
				console.log(result);
				switch (result) {
					case true:
						console.log(result);
						if (result == "Data found"){
							populateFeed(fbid);
						} else {
							scrapeFeed(response.id);
						}
						
						break;
					default:
						console.log("Went to default");
						//resultDiv.html(result);
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr.status);
				console.log(thrownError);
			}
		});
	});
}

var $el = $('#mainFeed');
var listView = new infinity.ListView($el); 

function newsFeedItemHTML(post_by, post_title, post_date, post_tags, post_link, post_type){
	var HTML = "";

	HTML += '<div style="background-color:rgb(252,252,252);" class="list-group-item row">';
	HTML +=	'	<div class="row">';
	HTML += '		<div class="navbar navbar-inverse">';
	HTML += '			<div class="navbar-brand">'+JSON.parse(post_by).name+'</div>'
	HTML += '   			<span class="badge badge-important navbar-text navbar-right">'+post_type+'</span>';
	HTML += '		</div>';
	HTML += '		<div class="col-md-8">';
	HTML += '			<h5>'+post_title+'</h5>';
	HTML += '			<iframe class="img-responsive flex-video", width="560", src="'+post_link+'", frameborder="0", allowfullscreen/>';
	HTML += '		</div>';
	HTML += '		<div class="col-md-4">';
	HTML += '			<h5 class="text-right">'+fuzzyFacebookTime(post_date.replace(/-/g,'/'))+'</h5>';
	HTML += '			<div class="well">';
	HTML += '				<h6>Tagged</h6>';
	HTML += '				<ul>';
	for (var i=0; i< post_tags.length; i++){
		HTML += '<li>'+JSON.parse(post_tags[i]).name+'</li>';
	}
	HTML += '				</ul>';
	HTML += '			</div>';
	HTML += '		</div>';
	HTML += '	</div>';
	HTML += '	<br/>';
	HTML += '	<div class="row">';
	HTML += '		<div class="btn-group btn-group-justified">';
	HTML += '			<a class="btn btn-primary"> <span class="glyphicon glyphicon-chevron-up"></span>  Upvote</a>';
	HTML += '			<a class="btn btn-info"> <span class="glyphicon glyphicon-chevron-down"></span>  Downvote</a>';
	HTML += '			<a class="btn btn-success"> <span class="glyphicon glyphicon-share"></span>  Share</a>';
	HTML += '		</div>';
	HTML += '	</div>';
	HTML += '</div>';
	HTML += '<hr/>';

	return HTML;
}

var fuzzyFacebookTime = (function(){
	fuzzyTime.defaultOptions={
		// time display options
		relativeTime : 48,
		// language options
		monthNames : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		amPm : ['AM', 'PM'],
		ordinalSuffix : function(n) {return ['th','st','nd','rd'][n<4 || (n>20 && n % 10<4) ? n % 10 : 0]}
	}

	function fuzzyTime (timeValue, options) {

		var options=options||fuzzyTime.defaultOptions, 
			date=parseDate(timeValue),
			delta=parseInt(((new Date()).getTime()-date.getTime())/1000),
			relative=options.relativeTime,
			cutoff=+relative===relative ? relative*60*60 : Infinity;

		if (relative===false || delta>cutoff)
		return formatTime(date, options)+' '+formatDate(date, options);

		if (delta<60) return 'less than a minute ago';
		var minutes=parseInt(delta/60 +0.5);
		if (minutes <= 1) return 'about a minute ago';
		var hours=parseInt(minutes/60 +0.5);
		if (hours<1) return minutes+' minutes ago';
		if (hours==1) return 'about an hour ago';
		var days=parseInt(hours/24 +0.5);
		if (days<1) return hours+' hours ago';
		if (days==1) return formatTime(date, options)+' yesterday';
		var weeks=parseInt(days/7 +0.5);
		if (weeks<2) return formatTime(date, options)+' '+days+' days ago';
		var months=parseInt(weeks/4.34812141 +0.5);
		if (months<2) return weeks+' weeks ago';
		var years=parseInt(months/12 +0.5);
		if (years<2) return months+' months ago';
		return years+' years ago';
	}

	function parseDate (str) {
		var v=str.replace(/[T\+]/g,' ').split(' ');
		return new Date(Date.parse(v[0] + " " + v[1] + " UTC"));
	}

	function formatTime (date, options) {
		var h=date.getHours(), m=''+date.getMinutes(), am=options.amPm;
		return (h>12 ? h-12 : h)+':'+(m.length==1 ? '0' : '' )+m+' '+(h<12 ? am[0] : am[1]);
	}

	function formatDate (date, options) {
		var mon=options.monthNames[date.getMonth()],
			day=date.getDate(),
			year=date.getFullYear(),
			thisyear=(new Date()).getFullYear(),
			suf=options.ordinalSuffix(day);

		return mon+' '+day+suf+(thisyear!=year ? ', '+year : '');
	}

	return fuzzyTime;
	
}());

function scrapeFeed(fbid){
	$.ajax({
		url: "/poster/"+fbid,
		type: "GET",
		success: function (result) {
			//- console.log("Result:" + result);

			populateFeed(fbid);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		}
	});
}

function populateFeed(fbid){
	$.ajax({
		url: "/user/"+fbid+"/posts",
		type: "GET",
		success: function (result) {
			console.log("Feed length:" + result.length);
			addToFeed(result);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		}
	});
}

function addToFeed(items){
	for (var i=0; i<items.length; i++){
		addItemToFeed(items[i].post_by, items[i].post_title, items[i].created_time, items[i].post_tags, items[i].post_link, items[i].post_type);
	}
}

function addItemToFeed(post_by, post_title, post_date, post_tags, post_link, post_type){
	var newContent = newsFeedItemHTML(post_by, post_title, post_date, post_tags, post_link, post_type);
	$('#mainFeed').append(newContent);
	console.log("Appending to listview");
}

function login() {
	// @TODO: Comment this line out and uncomment the rest!
	//window.location = "/login";

	FB.login(function(response) {	
		if (response.authResponse) {
			// connected
			testAPI();
	
		} else {
			// cancelled
		}
	}, {scope: 'email,read_stream'});

	info();
}
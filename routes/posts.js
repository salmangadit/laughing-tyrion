var db = require('../model/db');
var posts = require('../model/posts');
var users = require('../model/users');
var request = require('request');

exports.createPosts = function(req, res){
	posts.createPost(req.body, function(err, result){
 		res.send(result);
 	});
}

exports.findByUser = function(req, res){
  posts.postlistByUser(req.params.fbid, function(err, result){
  	if(err) return console.log(err);
  	res.send(result);
  })
}

exports.findByPostId = function(req, res){
  posts.postlist(req.params.id, function(err, result){
  	if(err) return console.log(err);
  	res.send(result);
  })
}

exports.scrapeFeed = function(req, res){
	var fbid = req.params.fbid;
	checkPreviousScrapeData(fbid, req, res);
}

function getFBfeed(user, res){
	var itemCount = 0;
	var pagination = "";
	var postArray = [];
	console.log("FB feed scraping");
	
	console.log(user);
	var call = 'https://graph.facebook.com/'+user.fb_id+"/feed?access_token="+user.fb_token+"&fields=type,source,from,to,full_picture&limit=100";
	console.log(call);
	request(call, function (error, response, body) {
		console.log(response.statusCode);
		console.log(body);
		if (!error && response.statusCode == 200) {
			var videoArray = [];
			var videoData = JSON.parse(body);
			
			pagination = videoData.paging;
		 	for (var i=0; i<videoData.data.length; i++){
		 		if (videoData.data[i].type == "video" || 
		 			(typeof videoData.data[i].source != "undefined" ? 
		 				(videoData.data[i].source.indexOf("youtube.com") != -1 ) : false) )
				{
					// console.log(videoData.data[i].source);
		 			if (videoData.data[i].source.indexOf("youtube.com") != -1){
		 				itemCount++;
		 				//console.log(itemCount);
		 				var videoId = videoData.data[i].source.substring(25,36);
		 				(function(index){
		 					request("https://www.googleapis.com/youtube/v3/videos?id="+videoId+"&key=AIzaSyAZLyBapbZnXBef4-gqQiKrYEXtOfRDyh0&part=snippet&fields=items(snippet(categoryId, title))", function (error, response, body) {
								//console.log("i is " + index );
								itemCount--;
								var fbBody = videoData.data[index];
								if (!error && response.statusCode == 200) {
									var bodyData = JSON.parse(body);
									console.log(JSON.stringify(bodyData));
									if (typeof bodyData.items[0] != 'undefined'){
										if (typeof bodyData.items[0].snippet != 'undefined'){
											if (typeof bodyData.items[0].snippet.categoryId != 'undefined'){
												if (bodyData.items[0].snippet.categoryId == 10){
													//Save as music post
													var postObject = new Object();
													postObject.fb_id = user.fb_id;
													postObject.post_id = fbBody.id;
													postObject.post_type = 'music';
													if (fbBody.source.indexOf("?") != -1){
														fbBody.source = fbBody.source.substring(0, 36);
													} else {
														fbBody.source = fbBody.source
													}
													
													postObject.post_link = fbBody.source;
													postObject.post_title = bodyData.items[0].snippet.title;
													postObject.post_image = fbBody.full_picture
													postObject.post_by = JSON.stringify(fbBody.from);
													postObject.post_tags = [];
													if (typeof fbBody.to != 'undefined'){
														for (var i=0; i<fbBody.to.data.length; i++){
															postObject.post_tags.push(JSON.stringify(fbBody.to.data[i]));
														}
													}
													
													postObject.created_time = fbBody.created_time;

													postArray.push(postObject);
												} else {
													//Save as video post
													var postObject = new Object();
													postObject.fb_id = user.fb_id;
													postObject.post_id = fbBody.id;
													postObject.post_type = 'video';
													if (fbBody.source.indexOf("?") != -1){
														fbBody.source = fbBody.source.substring(0, 36);
													} else {
														fbBody.source = fbBody.source
													}
													postObject.post_link = fbBody.source;
													postObject.post_title = bodyData.items[0].snippet.title;
													postObject.post_image = fbBody.full_picture
													postObject.post_by = JSON.stringify(fbBody.from);
													postObject.post_tags = [];		
													if (typeof fbBody.to != 'undefined'){
														for (var i=0; i<fbBody.to.data.length; i++){
															postObject.post_tags.push(JSON.stringify(fbBody.to.data[i]));
														}
													}
												
													postObject.created_time = fbBody.created_time;

													postArray.push(postObject);
												}
												//console.log(videoId+" : " + youTubePostType[JSON.parse(body).items[0].snippet.categoryId]);	
											} //end if (typeof bodyData.items[0].snippet.categoryId != 'undefined')
										} //end if (typeof bodyData.items[0].snippet != 'undefined')
									} //end if (typeof bodyData.items[0] != 'undefined')
								} //end if (!error && response.statusCode == 200)
								//console.log(itemCount);
								if (itemCount == 0){
									renderCompleted(user.fb_id, pagination, postArray, res);
								} //end render
							}); //end youtube request
						})(i); //end closure
		 			}//end if (videoData.data[i].source.indexOf("youtube.com") != -1)
		 		}//end if (videoData.data[i].type == "video")
		 	}//end for
		} //end if (!error && response.statusCode == 200)
	}); //end fb request
}

function checkPreviousScrapeData(fbid, req, res){
	posts.checkPagination(req.params.fbid, function(err, result){
		if (result.length > 0){
			console.log("data found for id: " + req.params.fbid);
			res.end("Data found");
		} else {
			console.log("Nothing found, fresh scrape for id: " + req.params.fbid);
			users.getOne(req.params.fbid, function(err, result){
			if (err) return console.log(err);
				//Use this user info to get fb stuff
				console.log("users.geOne: " + result);
				getFBfeed(result, res);
			});	
		}
	});
}

function renderCompleted(fbid, pagination, postArray, res){
		//res.send(JSON.stringify(postArray));

	//update pagination
	var paginationParams = new Object();
	paginationParams.fb_id = fbid;
	paginationParams.next = pagination.next;
	paginationParams.previous = pagination.previous;
	posts.postNewPaginationParams(paginationParams, function(err, result){
		if (err)
			return res.send(err);
		// res.send(result);
		posts.createPost(postArray, function(err, result){
			if (err)
				return res.send(err);

			res.send(result);
		});
	});
}

var youTubePostType = {
	1: "Film & Animation",
	2: "Autos & Vehicle",
	10: "Music",
	15: "Pets & Animals",
	17: "Sports",
	18: "Short Movies",
	19: "Travel & Events",
	20: "Gaming",
	21: "Videoblogging",
	22: "People & Blogs",
	23: "Comedy",
	24: "Entertainment",
	25: "News & Politics",
	26: "Howto & Style",
	27: "Education",
	28: "Science & Technology",
	29: "Non-profits & Activism",
	30: "Movies",
	31: "Anime/Animation",
	32: "Action/Adventure",
	33: "Classics",
	34: "Comedy",
	35: "Documentary",
	36: "Drama",
	37: "Family",
	38: "Foreign",
	39: "Horror",
	40: "Sci-Fi/Fantasy",
	41: "Thriller",
	42: "Shorts",
	43: "Shows",
	44: "Trailers"
}
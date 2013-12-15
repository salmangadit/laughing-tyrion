var mongoose = require('mongoose');
var url = require('url');


exports.createPost = function(post,callback){
	var Posts = mongoose.model( 'Posts' );
	var postCount = 0;
	// console.log(post);
	//var toPost = JSON.parse(post);
	postCount = post.length;
	// console.log("Post:" + postCount);
	post.forEach(function(post){
		Posts.find({fb_id:post.fb_id, post_id:post.post_id}, function(err, res){
	        if (err) {
	        	console.log(err);
	      	}

		    //console.log(res.length);
		    if (res.length == 0){
		    	//Nothing found
		    	// console.log("Nothing found");
		    	Posts.create(post, function(err, result){
		    		postCount--;
		    		// console.log("Post:" + postCount);
		    		if (err){
		    			console.log(err)
		    		}

		    		if (postCount == 0){
		    			callback(err, "Done all posts creation");
		    		}
		    	});
		    } else {
		    	// console.log("Exists");
		    	postCount--;
		    	// console.log("Post:" + postCount);
		    	if (postCount == 0){
		    		callback(err, "Done all posts creation");
		    	}
		    }
		    // return callback(null,res);
    	});
	});  
};

exports.postlistByUser = function postlistByUser(id, callback){
	var Posts = mongoose.model( 'Posts' );
	Posts.find({fb_id:id})
		.sort({'created_time' :"desc"})
		.exec(function (err, users) {
			if(err){
				console.log(err);
			}else{
				console.log(users);
				callback("",users);
			}
	});
};

exports.postlist = function postlist(id, callback){
	var Posts = mongoose.model( 'Posts' );
	Posts.find({_id:id}, function (err, users) {
		if(err){
			console.log(err);
		}else{
			console.log(users);
			callback("",users);
		}
	});
};

//scrapePagination

exports.postNewPaginationParams = function postNewPaginationParams(params, callback){
	var Pagination = mongoose.model('ScrapeData');

	var next_timestamp = url.parse(params.next, 'until').query.until;
	var prev_timestamp = url.parse(params.previous, 'since').query.since;

	console.log(JSON.stringify(next_timestamp));

	Pagination.find({fb_id:params.fb_id}, function(err, result){
		if (err){
			console.log(err);
			callback(err, result);
			return;
		}

		if (result.length>0){
			console.log("Found old pagination data");
			if (parseInt(result[0].next_timestamp) > parseInt(next_timestamp) ){
				console.log("Updated next_timestamp");
				params.next_timestamp = next_timestamp;
				params.next = result[0].next;
			} 

			if (parseInt(result[0].previous_timestamp) < parseInt(prev_timestamp) ){
				console.log("Updated prev_timestamp");
				params.previous_timestamp = prev_timestamp;
				params.previous = result[0].previous;
			} 

			Pagination.update({fb_id:params.fb_id}, params, function(err, result){
				callback(err,result);
			});

		} else {
			console.log("No previous pagination data, creating new");
			params.next_timestamp = next_timestamp;
			params.previous_timestamp = prev_timestamp;
			Pagination.create(params, function(err, result){
				callback(err,result);
			});
		}
	});
}
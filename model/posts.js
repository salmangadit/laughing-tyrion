var mongoose = require('mongoose');
var url = require('url');

var postCount = 0;
exports.createPost = function(post,callback){
	var Posts = mongoose.model( 'Posts' );
	console.log(post);
	//var toPost = JSON.parse(post);
	postCount = post.length;
	console.log("Post:" + postCount);
	post.forEach(function(post){
		Posts.find({fb_id:post.fb_id, post_id:post.post_id}, function(err, res){
	        if (err) {
	        	console.log(err);
	      	}

		    //console.log(res.length);
		    if (res.length == 0){
		    	//Nothing found
		    	Posts.create(post, function(err, result){
		    		postCount--;
		    		console.log("Post:" + postCount);
		    		if (err){
		    			console.log(err)
		    		}

		    		if (postCount == 0){
		    			callback(err, "Done all posts creation");
		    		}
		    	});
		    } else {
		    	postCount--;
		    	console.log("Post:" + postCount);
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
	Posts.find({fb_id:id}, function (err, users) {
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
	var Pagination = mongoose.model('ScrapeData', scrapeDataSchema );

	var next_timestamp = url.parse(params.next, 'until');
	var prev_timestamp = url.parse(params.previous, 'since');

	Pagination.findOne({fb_id:params.fb_id}, function(err, result){
		if (err){
			console.log(err);
			callback(err, result);
			return;
		}

		if (result){
			if (parseInt(result.next_timestamp) > parseInt(next_timestamp) ){
				params.next_timestamp = next_timestamp;
			}

			if (parseInt(result.previous_timestamp) < parseInt(previous_timestamp) ){
				params.previous_timestamp = previous_timestamp;
			} 

			Pagination.update({fb_id:params.fb_id}, params, function(err, result){
				callback(err,result);
			});

		} else {
			params.next_timestamp = next_timestamp;
			params.previous_timestamp = previous_timestamp;
			Pagination.create(params, function(err, result){
				callback(err,result);
			});
		}
	});
}
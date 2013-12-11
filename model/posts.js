var mongoose = require('mongoose');

exports.createPost = function(post,callback){
	var Posts = mongoose.model( 'Posts' );
    Posts.create(post, function(err, res){
      if (err) {
        console.log(err);
        return callback(err, {});
      }
      console.log(res);
      return callback(null,res);
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
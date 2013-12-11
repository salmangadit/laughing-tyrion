var mongoose = require('mongoose');

exports.userlist = function userlist(callback){
	var Users = mongoose.model( 'Users' );
	Users.find(function (err, users) {
		if(err){
			console.log(err);
		}else{
			console.log(users);
			callback("",users);
		}
	});
}

exports.getOne = function getOne(id, callback){
	var Users = mongoose.model( 'Users' );
	Users.findOne({fb_id:id}, function (err, users) {
		if(err){
			console.log(err);
		}else{
			console.log(users);
			callback("",users);
		}
	});
}
var mongoose = require('mongoose');

var createUser = function(user,callback){
	var User = mongoose.model( 'Users' );
    User.create(user, function(err, res){
      if (err) {
        console.log(err);
        return callback(err, {});
      }
      console.log(res);
      return callback(null,res);
    });  
};

exports.findOrCreateUser = function(user, callback){

	var User = mongoose.model( 'Users' );
    User.findOne({fb_id: user.fb_id}, null, function(err, result){
    	console.log('findOne result: ' + result);
      if (err) {
        console.log(err);
        return callback(err, {});
      } else if (!result) {
        // If user does not exist, createuser.
        return createUser(user, callback);
      } else {
        // If user exists, return user object.
        return User.update({id: user.id}, user, function(err, result){
          if (err) {
            console.log(err);
            return callback(err, {});
          }
          console.log(result);
          return callback(null, result);
        });
      }
  });
};

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
};

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
};
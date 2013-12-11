
/*
 * GET users listing.
 */
var db = require('../model/db')
var users = require('../model/users')

var createUser = function(user,callback){
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
	console.log(user);
	console.log(callback);
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

exports.list = function(req, res){
  users.userlist(function(err, result){
  	if(err) return console.log(err);
  	res.send(result);
  })
};

exports.store = function(req, res){
 	console.log("User: "+req.body);

 	users.findOrCreateUser(req.body, function(){
 		res.end("true");
 	});
};

exports.getOne = function(req, res){
	users.getOne(req.params.fbid, function(err, result){
		if (err) return console.log(err);
		res.send(result);
	});
}
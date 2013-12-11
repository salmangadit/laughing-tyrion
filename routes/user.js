
/*
 * GET users listing.
 */
var db = require('../model/db')
var users = require('../model/users')

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
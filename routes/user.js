
/*
 * GET users listing.
 */
var db = require('../model/db')

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.store = function(req, res){
 	console.log("User: "+req.body);

 	db.findOrCreateUser(req.body, function(){
 		res.end("true");
 	});
 	
};
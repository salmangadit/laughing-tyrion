
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.store = function(req, res){
	console.log("Arrived");
 	console.log("User "+req.body.name + ", " + req.body.id);

 	res.end("true");
};
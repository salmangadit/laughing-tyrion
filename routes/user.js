
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.store = function(req, res){
  console.log("User "+req.body.data.firstname + " " + req.body.data.lastname);
};
var http = require ('http');  
var mongoose = require( 'mongoose' );

var uristring = 
process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URL || 
'mongodb://localhost/laughingtyrion';

var theport = process.env.PORT || 5000;

var userSchema = new mongoose.Schema({
 name: String,
 id: String
});
var User = mongoose.model( 'Users', userSchema );

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) { 
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

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
    User.findOne({id: user.id}, null, function(err, result){
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


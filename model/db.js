var http = require ('http');  
var mongoose = require( 'mongoose' );

var uristring = 
process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URL || 
'mongodb://localhost/laughing-tyrion';

var theport = process.env.PORT || 5000;

var userSchema = new mongoose.Schema({
 first_name: String,
 last_name: String
});
mongoose.model( 'Users', userSchema );

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) { 
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

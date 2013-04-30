var mongoose = require( 'mongoose' );

var userSchema = new mongoose.Schema({
 first_name: String,
 last_name: String
});
mongoose.model( 'Users', userSchema );

mongoose.connect( 'mongodb://localhost/laughing-tyrion' );

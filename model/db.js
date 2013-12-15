var http = require ('http');  
var mongoose = require( 'mongoose' );

var uristring = 
process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URL || 
'mongodb://localhost/laughingtyrion';

var theport = process.env.PORT || 5000;

var userSchema = new mongoose.Schema({
	name: String,
	fb_id: String,
	fb_fname: String,
	fb_lname: String,
	fb_token: String
});
var User = mongoose.model( 'Users', userSchema );

var postSchema = new mongoose.Schema({
	fb_id: String,
	post_id: String,
	post_type: {type:String, enum:['music', 'video']},
	post_link: String,
	post_title: String,
	post_image: String,
	post_tags: [String],
	post_by: String,
	created_time: String
});

var Post = mongoose.model('Posts', postSchema );

var scrapeDataSchema = new mongoose.Schema({
	fb_id: String,
	previous_timestamp: String,
	previous: String,
	next: String,
	next_timestamp: String,
	end_scrape_complete: Boolean
});

var ScrapeData = mongoose.model('ScrapeData', scrapeDataSchema );

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) { 
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});


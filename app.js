
/**
 * Module dependencies.
 */

var express = require('express')
  , db = require('./model/db')
  , routes = require('./routes')
  , user = require('./routes/user')
  , posts = require('./routes/posts')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret:'laughing-tyrion'}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/user', user.list);
app.get('/user/:fbid', user.getOne);
app.post('/user', user.store);

//posts
app.get('/user/:fbid/posts', posts.findByUser);
app.get('/posts/:id', posts.findByPostId);
app.post('/posts', posts.createPosts);

//scrapers
app.get('/poster/:fbid', posts.scrapeFeed);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

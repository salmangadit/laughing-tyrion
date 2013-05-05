
/*
 * GET home page.
 */

exports.index = function(req, res){
	var loggedIn = false;
	loggedIn = req.session.loggedIn ? req.session.loggedIn : false;
	console.log('isLoggedIn server side: ' + loggedIn);
  res.render('index', { title: 'In-Tune', isLoggedIn: loggedIn });
};

exports.login = function(req, res){
	req.session.loggedIn = true;
	res.render('index', { title: 'In-Tune', isLoggedIn: loggedIn });
}


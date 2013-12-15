
/*
 * GET home page.
 */

exports.index = function(req, res){
	var loggedIn = false;
	loggedIn = req.session.loggedIn ? req.session.loggedIn : false;
	console.log('isLoggedIn server side: ' + loggedIn);
	if (loggedIn){
		res.redirect('/home');
	} else {
		res.render('index', { title: 'Shelf', isLoggedIn: loggedIn });
	}
};

exports.home = function(req, res){
	var loggedIn = false;
	loggedIn = req.session.loggedIn ? req.session.loggedIn : false;
	console.log('isLoggedIn server side: ' + loggedIn);
	if (loggedIn){
		res.render('home', { title: 'Shelf - Home', isLoggedIn: loggedIn });
	} else {
		res.render('index', { title: 'Shelf', isLoggedIn: loggedIn });
	}
}

exports.login = function(req, res){
	req.session.loggedIn = true;
	var loggedIn = req.session.loggedIn ? req.session.loggedIn : false;
	console.log('isLoggedIn server side: ' + loggedIn);
	if (loggedIn){
		res.redirect('/home');
	} else {
		res.render('index', { title: 'Shelf', isLoggedIn: loggedIn });
	}
}


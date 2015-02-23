// expose the routes to our app with module.exports
module.exports = function (app) {

	// Application ==================================================

	app.get('*', function (req, res) {
		res.sendfile('./public/index.html');
	});

	// log request
	app.use(function (req, res, next) {
		console.log(req.mothod, req.url);
		next();
	});

	// catch 404 and forward to error handler
	app.use(function (req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// development error handler will print stacktrace
	if (app.get('env') === 'development') {
		app.use(function (err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message : err.message,
				error   : err
			});
		});
	}

	// production error handler no stacktraces leaked to user
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error   : {}
		});
	});
};
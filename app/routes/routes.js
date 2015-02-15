var Todo = require('../models/todo');

// expose the routes to our app with module.exports
module.exports = function(app) {
	
	// Application ==================================================
	
	app.get('*', function(req, res) {
	    res.sendfile('./public/index.html');
	});
	
	// log request
	app.use(function(req, res, next) {
		console.log(req.mothod, req.url);
		next();
	});
	
	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	    var err = new Error('Not Found');
	    err.status = 404;
	    next(err);
	});

	// development error handler will print stacktrace
	if (app.get('env') === 'development') {
	    app.use(function(err, req, res, next) {
	        res.status(err.status || 500);
	        res.render('error', {
	            message: err.message,
	            error: err
	        });
	    });
	}

	// production error handler no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    res.render('error', {
	        message: err.message,
	        error: {}
	    });
	});

	// API ==========================================================
	
	app.get('/api/todos', function(req, res) {

	    // use mongoose to get all todos in the database
	    Todo.find(function(err, todos) {

	        // if there is an error retrieving, send the error. nothing
	    	// after res.send(err) will execute
	    	if (err) {
	            res.send(err);
	    	}

	        res.json(todos); // return all todos in JSON format
	    });
	});

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

	    // create a todo, information comes from AJAX request from Angular
	    Todo.create({
	        text : req.body.text,
	        done : false
	    }, function(err, todo) {
	        if (err) {
	            res.send(err);
            }

	        // get and return all the todos after you create another
	        Todo.find(function(err, todos) {
	            if (err) {
	                res.send(err);
	            }
	            res.json(todos);
	        });
	    });

	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
	    
		Todo.remove({
	        _id : req.params.todo_id
	    }, function(err, todo) {
	        if (err) {
	            res.send(err);
            }

	        // get and return all the todos after you create another
	        Todo.find(function(err, todos) {
	            if (err) {
	                res.send(err);
	            }
	            res.json(todos);
	        });
	    });
	});
	
};
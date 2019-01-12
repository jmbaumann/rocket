var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/login_tut');
mongoose.connect('mongodb://jeremy:r0cket@ds263138.mlab.com:63138/rogue', { useNewUrlParser: true });
var db = mongoose.connection;﻿

var routes = require('./routes/index');
var admin = require('./routes/admin');	//set routes below
var users = require('./routes/users');
var shows = require('./routes/shows');


// Init App
var app = express();

// Security
app.disable('x-powered-by');

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
	defaultLayout: 'layout',
	helpers: require('./public/js/helpers.js').helpers
}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// Give routes access to db
app.use(function(req,res,next){
    req.db = db;
    next();
});

// Set routes
app.use('/', routes);
app.use('/admin', admin);
app.use('/users', users);
app.use('/shows', shows);


// 404 and 500 Pages
// app.use(function(req, res){
// 	res.type('text/html');
// 	res.status(404);
// 	res.render('404');
// });

// app.use(function(err, req, res, next){
// 	res.status(500);
// 	res.render('500');
// });

// Set Port
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'));
});


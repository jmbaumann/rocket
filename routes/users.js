var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('flash');

var User = require('../models/user');

// Signup
router.get('/signup', function(req, res){
	res.render('users/signup');
});

// Login
router.get('/login', function(req, res){
	var errors = 
	res.render('users/login');
});

// Login with error
router.get('/login/error', function(req, res){
	res.render('users/login', {errors: 'Invalid email or password'});
});

// Signup User
router.post('/signup', function(req, res){
	var firstname = req.body.firstname;				//name="" field in <input> inside of register <form>
	var lastname = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('firstname', 'First name is required').notEmpty();
	req.checkBody('lastname', 'Last name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	if(errors){
		res.render('users/signup', {errors: errors});
	}else{
		var newUser = new User({
			first_name: firstname,
			last_name: lastname,
			email: email,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are signed up!');

		res.redirect('/users/login');
		//res.redirect('/users/signup-questionaire');
	}
});

// router.post('/addPDS', function(req, res){
// 	var id = req.body.epID;
// 	var num = req.body.numStories;
// 	var url = req.body.epURL;
// 	var newPDS = new PDSEpisode({
// 		epID: id,
// 		numStories: num,
// 		epURL: url,
// 		thumbnail: null,
// 		posted: Date()
// 	});

// 	PDSEpisode.createPDSEpisode(newPDS, function(err, ep){
// 		if(err) throw err;
// 		console.log(ep);
// 	});

// 	res.redirect('/');
// });

// Optional Questions
router.post('/signup-questionaire', function(req, res){
	var birthdate = req.body.month + req.body.day + req.body.year;
	var gender = req.body.gender;
	var nationality = req.body.nation;
	var affiliation = req.body.party;

	var newUser = new User({
		first_name: firstname,
		last_name: lastname,
		email: email,
		password: password
	});

	User.createUser(newUser, function(err, user){
		if(err) throw err;
		console.log(user);
	});

	req.flash('success_msg', 'You are signed up!');

	res.redirect('/users/login');
	
});

// Passport for logging in/out
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
  	User.getUserByEmail(username, function (err, user) {	//username = email
		if (err) throw err;
		if (!user) {
			return done(null, false, { message: 'Unknown User' });
		}

		User.comparePassword(password, user.password, function (err, isMatch) {
			if (err) throw err;
			if (isMatch) {
				return done(null, user);
			} else {
				return done(null, false, { message: 'Invalid password' });
			}
		});
  });
}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

// Log In
router.post('/login',
	passport.authenticate('local', {successRediret:'/', failureRedirect:'/users/login', failureFlash:true}), function(req, res){
		res.redirect('/');
	});

// Logout
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'Logged out!');
	res.redirect('/');
});


// Edit Profile
router.get('/edit', function(req, res){
	res.redirect('/');
});

module.exports = router;
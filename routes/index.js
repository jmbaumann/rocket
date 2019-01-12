var express = require('express');
var router = express.Router();

var PDS = require('../models/pds.js');
var Video = require('../models/video.js');
var Series = require('../models/series.js');
var Product = require('../models/product.js');

// Get Homepage
router.get('/', async function(req, res, next){
	try{
		var recentPDS = await PDS.find().limit(15).sort({posted_on_full: -1});
		var recentOther = await Video.find({series: {$ne: "The Philip DeFranco Show"}}).limit(15).sort({posted_on_full: -1});
		var products = await Product.find().limit(15);
		res.render('index', {pds: recentPDS, other: recentOther, products: products});
	}catch(errors){
		next(errors);
	}
	
});


// Get Admin page (redirects to admin control center)
router.get('/admin', function(req, res){
	// res.redirect('/admin/cc');
	res.render('admin/control-center');
});

// Get Shows page (should display all shows / series)
router.get('/shows', async function(req, res, next){
	try{
		var series = await Series.find();
		res.render('shows/shows', {series: series});
	}catch(errors){
		next(errors);
	}
});

//Get Users page (should redirect to sign up page?)
router.get('/users', function(req, res){
	res.redirect('/users/signup');
});

// Get Search results page
router.get('/search', function(req, res){
	// res.redirect('/search');
});


module.exports = router;
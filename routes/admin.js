var express = require('express');
var router = express.Router();

var Video = require('../models/video.js');
var PDS = require('../models/pds.js');
var Series = require('../models/series.js');
var Poll = require('../models/poll.js');
var Product = require('../models/product.js');
// var Choice = require('../models/poll.js');

// Get Admin page
router.get('/cc', function(req, res){
	res.render('admin/control-center');
});

// Get Edit Video page by video id
router.get('/edit-video/:id', async function(req, res){
	var id = req.params.id;
	var video = await Video.findOne({_id: id});
	res.render('admin/edit-video', {video: video});
	// res.json(video);
});

// Get page to make a Poll
router.get('/view-poll/:id', async function(req, res, next){
	var id = req.params.id;
	var poll = await Poll.findOne({video_id: id});
	res.render('admin/view-poll', {poll: poll});
});

// Form for submitting new video
router.post('/cc/new-video', async function(req, res, next){
	try{
		var video = new Video(req.body);
		await video.save();
		res.render('shows/episode', {video: video, title: video.title});
	}catch(errors){
		next(errors);
	}
	
});

// Form for editing a video
router.post('/cc/edit-video/:id', async function(req, res, next){
	try{
		var id = req.params.id;
		var video = await Video.findByIdAndUpdate(id, req.body, {new:true});
		res.redirect('/admin/cc');
	}catch(error){
		next(error);
	}
});

// Form for getting video to edit or delete
router.post('/cc/edit', async function(req, res, next){
	try{
		var id = req.body.search_id || null;
		var title = req.body.search_title || null;
		var result = await Video.find({ $or: [{_id: id}, {title: title}]}).collation({locale: 'en', strength: 2}); 	//strength 2 = not case sensitive
		if(result.length > 0){
			// res.json(result);
			res.render('admin/edit-video', {result: result});
			return;
		}else{
			res.redirect('/admin/cc');
		}
	}catch(errors){
		next(errors);
	}
});

// Add a new PDS
router.post('/new-PDS', async function(req, res, next){
	try{
		var pds = new PDS(req.body);
		await pds.save();
		res.redirect('/admin/cc');
	}catch(errors){
		next(errors);
	}
});

// Add series to db
router.post('/new-series', async function(req, res, next){
	try{
		var series = new Series(req.body);
		await series.save();

		res.redirect('/admin');
	}catch(errors){
		next(errors);
	}
});

// Form for new Poll
router.post('/make-poll', async function(req, res, next){
	try{
		var id = req.body.id;
		var numChoices = req.body.num_choices;
		//make choices and save in array
		var choices = req.body.choices;
		var choicesArr = [];
		for(var i = 0; i < choices.length; i++){
			if(choices[i] != ''){
				var choice = new Poll.Choice({
					option: choices[i]
				});
				console.log(choice);
				await choice.save();
				choicesArr.push(choice);
			}
		}
		
		//make poll
		var poll = new Poll({
			video_id: req.body.id,
			story: req.body.story,
			question: req.body.question,
			num_choices: req.body.num_choices,
			choices: choicesArr
		});
		await poll.save();

		res.render('admin/view-poll', {id: id});
	}catch(errors){
		next(errors);
	}
});

// New Product
router.post('/new-product', async function(req, res, next){
	try{
		var product = new Product(req.body);
		await product.save();

		res.redirect('/admin');
	}catch(errors){
		next(errors);
	}
});

module.exports = router;

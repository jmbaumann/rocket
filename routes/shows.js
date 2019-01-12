var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

var Comment = require('../models/comment');
var User = require('../models/user');
var PDS = require('../models/pds.js');
var Video = require('../models/video.js')
var Poll = require('../models/poll.js');
var Series = require('../models/series.js');

var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

// Get News Shows page
router.get('/news', async function(req, res, next){
	try{
		var videos = await Video.find({type: "news"}).sort({posted_on_full: -1});
		var pds = await PDS.find().sort({posted_on_full: -1});
		res.render('shows/news', {videos: videos});
	}catch(error){
		next(error);
	}
});

// Get Podcast & More page
router.get('/other', async function(req, res, next){
	try{
		var videos = await Video.find({type: "other"}).sort({posted_on_full: -1});
		res.render('shows/other', {videos: videos});
	}catch(error){
		next(error);
	}
	
});

// Get PDS page
router.get('/PDS', async function(req, res, next){
	try{
		var videos = await PDS.find().sort({posted_on_full: -1});
		res.render('shows/PDS', {videos: videos});
	}catch(errors){
		console.log(errors);
		next(errors);
	}
});

// Get Morning Breakdown Page
router.get('/morning-breakdown', async function(req, res, next){
	try{
		var videos = await Video.find({series: 'Morning Breakdown'}).sort({posted_on_full: -1});
		res.render('shows/morning-breakdown', {videos: videos});
	}catch(errors){
		console.log(errors);
		next(errors);
	}
});

// Get Feel Good Friday page
router.get('/feel-good-friday', async function(req, res, next){
	try{
		var videos = await Video.find({series: 'Feel Good Friday'}).sort({posted_on_full: -1});
		res.render('shows/feel-good-friday', {videos: videos});
	}catch(errors){
		console.log(errors);
		next(errors);
	}
});

// Get Rogue Rocket Podcast Page
router.get('/rogue-rocket-podcast', async function(req, res, next){
	try{
		var videos = await Video.find({series: 'Rogue Rocket Podcast'}).sort({posted_on_full: -1});
		res.render('shows/rogue-rocket-podcast', {videos: videos});
	}catch(errors){
		console.log(errors);
		next(errors);
	}
});

// Get Behind the Scenes VLog Page
router.get('/behind-the-scenes', async function(req, res, next){
	try{
		var videos = await Video.find({series: 'Behind The Scenes'}).sort({posted_on_full: -1});
		res.render('shows/behind-the-scenes', {videos: videos});
	}catch(errors){
		console.log(errors);
		next(errors);
	}
});

// Get Podcast Clips Page
router.get('/podcast-clips', async function(req, res, next){
	try{
		var videos = await Video.find({series: 'RR Podcast Clips'}).sort({posted_on_full: -1});
		res.render('shows/podcast-clips', {videos: videos});
	}catch(errors){
		console.log(errors);
		next(errors);
	}
});


// Get Episode (watch non-PDS show)
router.get('/episode', function(req, res){
	res.redirect('/shows');
});


router.get('/episode/:id', async function(req, res, next){
	try{
		var id = req.params.id;
		var video = await Video.findOne({_id: id});
		var related = await Video.find({series: video.series, _id: {$ne: id}}).sort({_id:-1}).limit(10);
		var comments = await Comment.find({video_id: id}).sort({_id: -1});
		res.render('shows/episode', {video: video, episodes: related, comments: comments});
	}catch(error){
		next(error);
	}
});


// Leave Comment
router.post('/comment', async function(req, res){
	var vid_id;
	if(req.body.video_id != null){
		vid_id = mongoose.Types.ObjectId(req.body.video_id);
	}
	var user_id = mongoose.Types.ObjectId(req.body.user_id);
	// var now = new Date();
	// var hour = now.getHours();
	// var date;
	// if(hour > 12){
	// 	hours = 24 - hours;
	// 	date = months[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear() + " " +
	// 		   hours + ":" + now.getSeconds() + "pm";
	// }else{
	// 	date = months[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear() + " " +
	// 		   hours + ":" + now.getSeconds() + "am";
	// }
	// Validate
	// req.checkBody('comment', 'Cannot submit blank comment').notEmpty();

	// var errors = req.validationErrors();
	// if(!errors){
	try{
		var newComment = new Comment({
			user_id: user_id,
			user_name: req.body.user_name,
			content: req.body.content,
			video_id: vid_id,
			PDS_id: req.body.pds_id,
			PDS_story: req.body.story
		});

		console.log(newComment);

		await newComment.save()
		.then(data => {
			// var d = data.posted_on; 
			// var formatted = months[d.getMonth()] + " " + d.getDate() +", " + d.getFullYear() + " - " + d.getHours() + ":" + d.getMinutes();
			// data.posted_on_full = formatted;
	        res.send(data);
	    }).catch(err => {
	        res.status(500).send({
	            message: err.message
	        });
	    });
		
	}catch(errors){
		console.log("No bueno");
		// status 500
	}
});

// Get the comments in Top Voted order
router.post('/top-voted', async function(req, res, next){
	var vid_id = mongoose.Types.ObjectId(req.body.video_id);
	try{
		var comments = await Comment.find({video_id: vid_id}).sort({likes: -1});
		res.send({comments: comments});
	}catch(errors){
		console.log("uh-oh");
		next(errors);
	}
});

// Get the comments in Most Recent order
router.post('/most-recent', async function(req, res, next){
	var vid_id = mongoose.Types.ObjectId(req.body.video_id);
	try{
		var comments = await Comment.find({video_id: vid_id}).sort({_id: -1});
		res.send({comments: comments});
	}catch(errors){
		console.log("uh-oh");
		next(errors);
	}
});

// Get the PDS comments in Top Voted order
router.post('/top-voted-PDS', async function(req, res, next){
	var vid_id = req.body.video_id;
	var story = req.body.story;
	try{
		var comments = await Comment.find({PDS_id: vid_id, PDS_story: story}).sort({likes: -1});
		res.send({comments: comments});
	}catch(errors){
		console.log("uh-oh");
		next(errors);
	}
});

// Get the PDS comments in Most Recent order
router.post('/most-recent-PDS', async function(req, res, next){
	var vid_id = req.body.video_id;
	var story = req.body.story;
	try{
		var comments = await Comment.find({PDS_id: vid_id, PDS_story: story}).sort({_id: -1});
		res.send({comments: comments});
	}catch(errors){
		console.log("uh-oh");
		next(errors);
	}
});

// Like Comment
router.post('/like-comment', async function(req, res, next){
	var username = req.body.u;
	var date = req.body.date;
	var content = req.body.content;
	try{
		var update = await Comment.updateOne({username: username, content: content}, { $inc: {likes: 1}});
		var comment = await Comment.findOne({username: username, content: content});
		res.send({comment: comment});
	}catch(errors){
		next(errors);
	}
});


// Get PDS watch page
router.get('/PDS/:id', async function(req, res, next){
	var id = req.params.id;
	var path = 'shows/pds/' + id;

	try{
		var comments = await Comment.find({PDS_id: id, PDS_story: { $eq: 0 }}).sort({_id: -1});
		// res.render(path, {comments: comments});
		res.render(path);
	}catch(errors){
		next(errors);
	}
	
});

// Get PDS comments by story
router.post('/PDS/comments-by-story', async function(req, res, next){
	var vid_id = req.body.video_id;
	var story = req.body.story;
	try{
		var comments = await Comment.find({PDS_id: vid_id, PDS_story: { $eq: story }}).sort({_id: -1});
		res.send({comments: comments});
	}catch(errors){
		console.log("uh-oh");
		next(errors);
	}
});


// Get PDS Polls
router.post('/PDS/get-polls', async function(req, res, next){
	try{
		var vid_id = req.body.video_id;
		var polls = await Poll.find({video_id: vid_id}).sort({story: 1});
		res.send({polls: polls});
	}catch(errors){
		console.log("uh-oh");
		next(errors);
	}
});

// Add vote to PDS Poll
router.post('/PDS/vote-poll', async function(req, res, next){
	try{
		var vote = req.body.choice;
		var ques = req.body.question;
		var poll = await Poll.updateOne({question: ques, 'choices.choiceNum': { $eq: vote }}, { $inc: {'choices.$.votes' : 1}});
		res.send({poll: poll});
	}catch(errors){
		next(errors);
	}
});


// Get Series Links
router.post('/get-series', async function(req, res, next){
	try{
		var name = req.body.series;
		var series = await Series.findOne({name: name});
		res.send({page: series.link})
	}catch(errors){
		next(errors);
	}
});




module.exports = router;
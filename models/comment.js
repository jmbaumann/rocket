var mongoose = require('mongoose');
var db = mongoose.connection;

var CommentSchema = mongoose.Schema({
	user_name: {
		type: String
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId
	},
	posted_on: {
		type: Date,
		default: Date.now
	},
	posted_on_full: {
		type: String,
		default: ''
	},
	content: {
		type: String,
		required: true
	},
	likes: {
		type: Number,
		default: 0
	},
	dislikes: {
		type: Number,
		default: 0
	},
	voted_on_by: {
		type: [mongoose.Schema.Types.ObjectId]
	},
	video_id: {
		type: mongoose.Schema.Types.ObjectId
	},
	PDS_id: {
		type: String,
	},
	PDS_story: {
		type: String
	}

});

var Comment = module.exports = mongoose.model('Comment', CommentSchema);
var mongoose = require('mongoose');

var PDSSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	posted_on: {
        type: String,
        required: true	
    },
    posted_on_full: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
    	type: String
    },
    PDS_id: {
        type: Number,
        required: true
    },
    num_stories: {
        type: Number,
        required: true
    },
    view_count: {
    	type: Number,
    	default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    youtube_id: {
    	type: String,
    	default: ""
    },
    filepath: {
    	type: String,
    	default: ""
    },
    thumbnail: {
    	type: String,
    	default: ""
    }
});

var PDS = module.exports = mongoose.model('PDS', PDSSchema);
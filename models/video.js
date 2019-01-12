var mongoose = require('mongoose');

var VideoSchema = mongoose.Schema({
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
    type: {
        type: String,
        required: true
    },
    view_count: {
    	type: Number,
    	default: 0
    },
    series: {
    	type: String,
    	required: true,
    	default: "Miscelaneous"
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

var Video = module.exports = mongoose.model('Video', VideoSchema);

// module.exports.createVideo = function()
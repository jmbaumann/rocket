var mongoose = require('mongoose');

var SeriesSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	thumbnail: {
		type: String
	},
	link: {
		type: String
	}
});

var Series = module.exports = mongoose.model('Series', SeriesSchema);
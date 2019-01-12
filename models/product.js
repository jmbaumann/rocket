var mongoose = require('mongoose');

var ProductSchema = mongoose.Schema({
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

var Product = module.exports = mongoose.model('Product', ProductSchema);
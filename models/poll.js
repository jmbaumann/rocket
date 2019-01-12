var mongoose = require('mongoose');
var db = mongoose.connection;

var ChoiceSchema = mongoose.Schema({
	option: {
		type: String
	},
	votes: {
		type: Number,
		default: 0
	},
	choiceNum: {
		type: Number,
	}
});

var PollSchema = mongoose.Schema({
	video_id: {
		type: String
	},
	story: {
		type: String
	},
	question: {
		type: String
	},
	num_choices: {
		type: Number
	},
	choices: [ChoiceSchema]
});


var Poll = module.exports = mongoose.model('Poll', PollSchema);
Poll.Choice = mongoose.model('Choice', ChoiceSchema);
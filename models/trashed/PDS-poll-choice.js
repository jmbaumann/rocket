var mongoose = require('mongoose');

var ChoicesSchema = mongoose.Schema({
	option: String,
	vote: {
		type: Number,
		default: 0
	}
});

var Choice = module.exports = mongoose.model('PDS_poll_choice', ChoicesSchema);

module.exports.createChoice = function(newChoice, callback){
	return new Promise(function(resolve, reject){
		newChoice.save(callback);

        function resolve(result){
            console.log("promise result: " + result);
        }

        function reject(err){
            console.log(err);
        }
    });
}
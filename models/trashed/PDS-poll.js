var mongoose = require('mongoose');

// var ChoicesSchema = mongoose.Schema({
// 	option: String,
// 	vote: {
// 		type: Number,
// 		default: 0
// 	}
// });

// var Choice = module.exports = mongoose.model('PDS_poll_choice', ChoicesSchema);

var ChoicesModel = require('../models/PDS-poll-choice');

var PDSPollSchema = mongoose.Schema({
    pollId : Number,
    pds_ep: Number,
    pds_story: String,
    question: String,
    choices: [ChoicesModel.schema]
});

var PDSPoll = module.exports = mongoose.model('PDS_poll', PDSPollSchema);



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



module.exports.createPDSPoll = function(newPDSPoll, callback){
	return new Promise(function(resolve, reject){
		newPDSPoll.save(callback);

        function resolve(result){
            console.log("promise result: " + result);
        }

        function reject(err){
            console.log(err);
        }
    });
}

module.exports.getPDSPoll = function(id, story, callback){
    var query = {pds_ep: ep, pds_story: story};
    PDSEpisode.find(query, callback);
}

module.exports.addVote = function(id, choice, callback){
    var query = {pollId: id};
}





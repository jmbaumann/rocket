var mongoose = require('mongoose');

var PDSEpisodeSchema = mongoose.Schema({
    epID: Number,
    epURL: String,
    thumbnail: String,
    posted: {
    	type: Date,
    	default: Date.now
    },
    numStories: Number
});

var PDSEpisode = module.exports = mongoose.model('PDS_episode', PDSEpisodeSchema);

module.exports.createPDSEpisode = function(newPDSEpisode, callback){
	newPDSEpisode.save(callback);
}

module.exports.getPDSEpisodeByEpID = function(id, callback){
    var query = {epID: id};
    PDSEpisode.find(query, callback);
}

module.exports.getNumberOfStories = function(id, callback){
    PDSEpisode.find({epID: id}, {numStories: 1, _id: 0}, callback);
}
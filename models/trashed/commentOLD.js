var mongoose = require('mongoose');
var db = mongoose.connection;

var CommentSchema = mongoose.Schema({
    pds_ep: String,
    pds_story: String,
    parent: mongoose.Schema.Types.ObjectId,
    posted: {
    	type: Date,
    	default: Date.now
    },
    authorId: mongoose.Schema.Types.ObjectId,
    author: String,
    text: String
});

var Comment = module.exports = mongoose.model('Comment', CommentSchema);

module.exports.createComment = function(newComment, callback){
	newComment.save(callback);
}

module.exports.getCommentsByStory = function(story, callback){
    var query = {pds_story: story};
    Comment.find(query, callback);
}

module.exports.getCommentsByEpisode = function(stories, callback){
    // var query = {pds_ep: ep};
    var storiedComs = [];
    for(var i = 0; i < stories; i++){
        var fakei = i+1;
        var checkStory = "story" + fakei;
        // storiedComs[i] = Comment.find({pds_story : checkStory});
        // var q = Comment.find({pds_story : checkStory});
        console.log(checkStory);
        Comment.find({pds_story : checkStory}, function(err, items){
            console.log("items: " + items);
            storiedComs.push(items);
            callback(storiedComs);
        });
        // Comment.find({pds_story : checkStory}, callback);
        
    }
    // console.log("done: " + storiedComs.length);
    
    // callback(storiedComs);
}

module.exports.getPDSCommentsByStory = function(story, callback){
    return new Promise(function(resolve, reject){
        console.log(story);
        Comment.find({pds_story : story}, callback);

        function resolve(result){
            console.log("promise result: " + result);
        }

        function reject(err){
            console.log(err);
        }
    });
}
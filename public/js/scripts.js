// var hiddenStory;
var livePoll;

window.onload = function(){
	// Rename the conversation divs with proper story number
	var toRename = document.getElementsByClassName("convo");
	for(var i = 0; i < toRename.length; i++){
		// var name = "story" + i;
		var dumi = i+1;
		var name = "story" + dumi + "-conversation";
		toRename[i].setAttribute("id", name);
	}

	// hiddenStory = document.getElementById("hidden-story");

    $.createPolls();
    $.loadComments();
}




var currentTime;    //= player.getCurrentTime()
var currentStory = 0;   //based on current time
var prevStory;

var repeater;	//used in start()

//called at page's launch and recalled every quarter second
//keeps setting currentTime to the video's current timecode
//when the currentTime is no longer within the bounds of the current story's beginning and end
//the currentStory is changed and the Read More and Conversation windows are updated accordingly
function start() {
	repeater = setTimeout(start, 250);

  	currentTime = player.getCurrentTime();
  	
  	if(currentTime >= stories[currentStory].begin && currentTime < stories[currentStory].end){
		//currentStory is accurate - nothing to do
	}else{
        if(currentTime < stories[stories.length-1].end){
            findCurrentStory();
        }
	}

	progressBar();
  
}

//sets currentStory based on currentTime
//calls makeLive() to refresh Read More and Conversation areas with new curentStory
function findCurrentStory() {
	for (var i = 0; i <= stories.length - 1; i++) {
		if(currentTime >= stories[i].begin && currentTime < stories[i].end){
			currentStory = i;
			break;
		}
	}
	// console.log("current: " + currentStory);
	makeLive();
}

//replace the Read More and Conversation divs with current story's
//live Read More and Conversations
function makeLive() {
	var currentStoryReadMore = stories[currentStory].id + "-read-more";
	var currentStoryConvo = stories[currentStory].id + "-conversation";
	var setReadMoreTo = document.getElementById(currentStoryReadMore).innerHTML;
	// var setConversationTo = document.getElementById(currentStoryConvo).innerHTML;
	document.getElementById("live-read-more").innerHTML = setReadMoreTo;
	// document.getElementById("live-conversation").innerHTML = setConversationTo;



	setupPanels();
	$.loadComments();

    livePoll = $("#live-read-more #poll-form");
    if(livePoll != null){
        livePoll.submit(function(event){
            event.preventDefault();
            var voteFor = $('input[name=vote]:checked').val();
            // if(voteFor != null){
                var ques = $("#live-read-more .poll h3").first().html();
                $.castVote(voteFor, ques);
            // }
        });
    }

	// set story value for comment form
	// document.getElementById("hidden-episode-name").value = "poop";
	// hiddenStory.value = currentStory;
	// console.log(hiddenStory.value);
	// console.log(document.getElementById("hidden-episode-name").value);
}

//makes div visible inside live Read More and Conversation windows
function unhide() {
	document.getElementById("live-read-more").style.display = 'grid';
	document.getElementById("live-conversation").style.display = 'grid';
}

//called from the Show Navigation window - moves playhead to beginning of chosen story and
//updated when the start() function repeats and resets currentTime
function navTo(id) {
	player.pauseVideo();
	player.seekTo(stories[id].begin, true);
}

//determines progress of the current story and displays that via an <hr>
function progressBar(){
	var currentBegin = stories[currentStory].begin;
	var currentEnd = stories[currentStory].end;
	var totalTime = currentEnd - currentBegin;
	var progress = ((currentTime - currentBegin) / totalTime) * 100;

	var bar;
	if(isReadMoreShowing()){
		bar = document.getElementsByClassName("progress-bar")[0];
	}else{
		bar = document.getElementById("mini-bar");
	}
	
	bar.style.width = progress + "%";
}

function getCurrentStory() {
	return currentStory;
}

function submitComment() {
	document.comment_form.story.value = currentStory;
  	return true;
}


var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];



// AJAX STUFF
// Submitting a new comment
$(document).ready(function() {
    
    // SUBMITTING A NEW COMMENT
    // Comment added to db, then #new-comment is populated with submitted data

    // show poll results
    $("#comment-form").submit(function(event){
        event.preventDefault();
        ajaxPost();
    });

    function ajaxPost() {
        var formData = {
            user_id: $('#hidden-user-id').val(),
            user_name: $('#hidden-user-name').val(),
            content: $('#comment-content').val(),
            pds_id: $('#hidden-episode-name').val(),
            story: currentStory
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url : "/shows/comment",
            data : JSON.stringify(formData),
            dataType : 'json',
            success : function(comment) {
            	$.loadComments();

                var d = new Date(comment.posted_on);
                    var h = 0;
                    var time = "";
                    if(d.getHours() > 12){
                        h = d.getHours() - 12;
                        time = "pm";
                    }else{
                        h = d.getHours();
                        time = "am";
                    }
                    var formatted = months[d.getMonth()] + " " + d.getDate() +", " + d.getFullYear() + " - " + h + ":" + d.getMinutes() + " " + time;
            	
                // console.log("success in ajax");
                $("#new-comment").html(
                    "<img class=\"profile-pic\" src=\"/img/avatar.png\"></img>" +
                    "<p class=\"username\">" + comment.user_name + "</p>" +
                    "<p class=\"date\">" + formatted + "</p>" +
                    "<p class=\"content\">" + comment.content + "</p>" +
                    "<button class=\"comment-button\" id=\"reply\">Reply</button>" +
                    "<button class=\"comment-button vote\" id=\"disagree\">Disagree (" + comment.dislikes +")</button>" +
                    "<button class=\"comment-button vote\" id=\"agree\">Agree (" + comment.likes +")</button>"
                );
                $("#new-comment").addClass("comment");
            },
            error : function(e) {
                // alert("Error!")
                console.log("ERROR: ", e);
            }
        });

        resetData();
    }

    function resetData() {
        $('#comment-content').val('');
    }



    // LOADING COMMENTS PER STORY CHANGE
    // most recent by default
    $.loadComments = function() {
        console.log("called");
    	var video_id = window.location.pathname;
        video_id = video_id.substring(video_id.lastIndexOf('/') + 1);

        var data = {
            video_id: video_id,
            story: currentStory
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url : "/shows/PDS/comments-by-story",
            data: JSON.stringify(data),
            dataType: 'json',
            success : function(response) {
                var wrapper = $('#comments-wrapper');
                wrapper.html('');
                wrapper.append(
                	"<div id=\"new-comment\"></div>"
                );

                response.comments.forEach(function(comment){
                    var d = new Date(comment.posted_on);
                    var h = 0;
                    var time = "";
                    if(d.getHours() > 12){
                        h = d.getHours() - 12;
                        time = "pm";
                    }else{
                        h = d.getHours();
                        time = "am";
                    }
                    var formatted = months[d.getMonth()] + " " + d.getDate() +", " + d.getFullYear() + " - " + h + ":" + d.getMinutes() + " " + time;

                    wrapper.append(
                        "<div class=\"comment\">" +
                            "<img class=\"profile-pic\" src=\"/img/avatar.png\"></img>" +
		                    "<p class=\"username\">" + comment.user_name + "</p>" +
		                    "<p class=\"date\">" + formatted + "</p>" +
		                    "<p class=\"content\">" + comment.content + "</p>" +
		                    "<button class=\"comment-button\" id=\"reply\">Reply</button>" +
		                    "<button class=\"comment-button vote\" id=\"disagree\">Disagree (" + comment.dislikes +")</button>" +
		                    "<button class=\"comment-button vote\" id=\"agree\">Agree (" + comment.likes +")</button>" +
                        "</div"
                    );
                });
            }
        });
    }

        // Sorting comments by Top Voted
    // $("#top-voted").click(function() {
    //     var video_id = window.location.pathname;
    //     video_id = video_id.substring(video_id.lastIndexOf('/') + 1);

    //     var data = {
    //         video_id: video_id,
    //         story: currentStory
    //     }

    //     $.ajax({
    //         type: "POST",
    //         contentType: "application/json",
    //         url : "/shows/top-voted-PDS",
    //         data: JSON.stringify(data),
    //         dataType: 'json',
    //         success : function(response) {
    //             var displayComments = $('#comments-wrapper');
    //             displayComments.html('');

    //             response.comments.forEach(function(comment){
    //                 displayComments.append(
    //                     "<div class=\"comment\">" +
    //                         "<img class=\"profile-pic\" src=\"/img/avatar.png\"></img>" +
    //                         "<p class=\"username\">" + comment.user_name + "</p>" +
    //                         "<p class=\"date\">" + comment.posted_on + "</p>" +
    //                         "<p class=\"content\">" + comment.content + "</p>" +
    //                         "<button class=\"comment-button\" id=\"reply\">Reply</button>" +
    //                         "<button class=\"comment-button vote\" id=\"disagree\">Disagree (" + comment.dislikes +")</button>" +
    //                         "<button class=\"comment-button vote\" id=\"agree\">Agree (" + comment.likes +")</button>" +
    //                     "</div"
    //                 );
    //             });
    //         }
    //     });

    //     var buttons = document.getElementsByClassName('sort-by');
    //     for(var i = 0; i < buttons.length; i++){
    //         buttons[i].classList.remove('sorted');
    //     }
    //     document.getElementById('top-voted').classList.add('sorted');
    // });

    // Sorting comments by Most Recent(default)
    // $('#most-recent').click(function() {
    //     var video_id = window.location.pathname;
    //     video_id = video_id.substring(video_id.lastIndexOf('/') + 1);

    //     var data = {
    //         video_id: video_id,
    //         story: currentStory
    //     }

    //     $.ajax({
    //         type: "POST",
    //         contentType: "application/json",
    //         url : "/shows/most-recent-PDS",
    //         data: JSON.stringify(data),
    //         dataType: 'json',
    //         success : function(response) {
    //             var displayComments = $('#comments-wrapper');
    //             displayComments.html('');

    //             response.comments.forEach(function(comment){
    //                 displayComments.append(
    //                     "<div class=\"comment\">" +
    //                         "<img class=\"profile-pic\" src=\"/img/avatar.png\"></img>" +
    //                         "<p class=\"username\">" + comment.user_name + "</p>" +
    //                         "<p class=\"date\">" + comment.posted_on + "</p>" +
    //                         "<p class=\"content\">" + comment.content + "</p>" +
    //                         "<button class=\"comment-button\" id=\"reply\">Reply</button>" +
    //                         "<button class=\"comment-button vote\" id=\"disagree\">Disagree (" + comment.dislikes +")</button>" +
    //                         "<button class=\"comment-button vote\" id=\"agree\">Agree (" + comment.likes +")</button>" +
    //                     "</div"
    //                 );
    //             });
    //         }
    //     });

    //     var buttons = document.getElementsByClassName('sort-by');
    //     for(var i = 0; i < buttons.length; i++){
    //         buttons[i].classList.remove('sorted');
    //     }
    //     document.getElementById('most-recent').classList.add('sorted');
    // });



    //POLLS
    // create polls
    $.createPolls = function() {
        var video_id = window.location.pathname;
        video_id = video_id.substring(video_id.lastIndexOf('/') + 1);

        var data = {
            video_id: video_id
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url : "/shows/PDS/get-polls",
            data: JSON.stringify(data),
            dataType: 'json',
            success : function(response) {
                response.polls.forEach(function(poll){
                    var id = "#story" + poll.story + "-read-more";
                    var storyDiv = $(id);
                    
                    var choices = '';
                    for(var i = 0; i < poll.num_choices; i++){
                        choices += "<input type=\"radio\" name=\"vote\" value=" + i + ">" +
                        poll.choices[i].option +
                        "<br>";
                    }
                    storyDiv.append(
                        "<div class=\"panel poll\">" +
                            "<h1 class=\"panel-title\">Poll</h1>" +
                            "<h3>" + poll.question + "</h3>" +
                                "<form id=\"poll-form\">" +
                                    choices +
                                    "<button id=\"form-button\" type=\"submit\">Submit</button>" +
                                "</form>" +
                        "</div>"
                    );

                    var totalVotes = 1;
                    var mostVotes  = 0;
                    for(var i = 0; i < poll.num_choices; i++){
                        totalVotes += poll.choices[i].votes;
                        if(poll.choices[i].votes > mostVotes){
                            mostVotes = poll.choices[i].votes;
                        }
                    }

                    var results = '';
                    for(var i = 0; i < poll.num_choices; i++){
                        results += "<p class=\"poll-option\">" + poll.choices[i].option + "</p>" +
                                   "<span class=\"poll-bar\" id=\"choice-" + i + "\" "+
                                        "style=\"width:" + (poll.choices[i].votes / totalVotes) * 100 + "%\">" +
                                        // "<p class=\"poll-percentage\">" + Math.round((poll.choices[i].votes / totalVotes) * 100) + "%  (" + poll.choices[i].votes + " votes)</p></span>"
                                        "<p class=\"poll-percentage\">" + poll.choices[i].votes + " votes</p></span>"
                                        
                    }

                    storyDiv.append(
                        "<div class=\"poll results\">" +
                            "<h1 class=\"panel-title\">Poll Results</h1>" +
                            "<h3>" + poll.question + "</h3>" +
                            "<h4>Total votes: " + totalVotes + "</h4>" +
                            "<div id=\"results-box\">" +
                                results +
                            "</div>" +
                        "</div>" 
                    );
                });

            }
        }); 
    }

    $.castVote = async function(voteFor, ques) {
        // make vote
        var data = {
            choice: voteFor,
            question: ques
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url : "/shows/PDS/vote-poll",
            data: JSON.stringify(data),
            dataType: 'json',
            success : function(response) {
                // update live-read-more results panel
                var choiceID = "#live-read-more .results #choice-" + voteFor + " p";
                var result = $(choiceID);
                var voteTotal = parseInt(result.first().html().substr(0, result.first().html().indexOf(' ')));
                voteTotal++;
                voteTotal = String(voteTotal);
                result.html(voteTotal + " votes");
                result.css('font-weight', 'bold');


                // change number of votes to add new vote
                var resultsBox = $("#live-read-more .results").first();
                var bars = resultsBox.find($(".poll-percentage"));
                var widths = [];
                var total = 0;
                
                var max = 0;
                bars.each(function(index){
                    var w = $(this).html().substr(0, $(this).html().indexOf(' '));
                    widths.push(parseInt(w));
                    total += parseInt(w);
                    if(parseInt(w) > max){
                        max = parseInt(w);
                    }
                });

                // change widths or bars to display number of votes
                var widthPer = [];
                for(var i = 0; i < widths.length; i ++){
                    widthPer.push(widths[i] / total * 100);
                }

                barSpans = resultsBox.find($("span"));
                barSpans.each(function(index){
                    var style = widthPer[index] + "%";
                    $(this).css("width", style);
                });

                
                //hide live poll and show results
                var polls = $("#live-read-more .poll");
                polls.each(function(index) {
                    if($(this).hasClass("panel")){
                        $(this).removeClass("panel");
                        $(this).removeClass("showing");
                        $(this).css("display", "none");
                    }else{
                        $(this).addClass("panel");
                        $(this).addClass("showing");
                    }
                });

                // update story-read-more results panel
                var choiceID = "#story" + currentStory + "-read-more .results #choice-" + voteFor + " p";
                var result = $(choiceID);
                var voteTotal = parseInt(result.first().html().substr(0, result.first().html().indexOf(' ')));
                voteTotal++;
                voteTotal = String(voteTotal);
                result.html(voteTotal + " votes");
                result.css('font-weight', 'bold');


                // change number of votes to add new vote
                var resultsBox = $("#story" + currentStory + "-read-more .results").first();
                var bars = resultsBox.find($(".poll-percentage"));
                var widths = [];
                var total = 0;
                
                var max = 0;
                bars.each(function(index){
                    var w = $(this).html().substr(0, $(this).html().indexOf(' '));
                    widths.push(parseInt(w));
                    total += parseInt(w);
                    if(parseInt(w) > max){
                        max = parseInt(w);
                    }
                });

                // change widths or bars to display number of votes
                var widthPer = [];
                for(var i = 0; i < widths.length; i ++){
                    widthPer.push(widths[i] / total * 100);
                }

                barSpans = resultsBox.find($("span"));
                barSpans.each(function(index){
                    var style = widthPer[index] + "%";
                    $(this).css("width", style);
                });

                // hide from story-read-more
                var curID = "#story" + currentStory + "-read-more .poll";
                curStoryPolls = $(curID);
                curStoryPolls.each(function(index) {
                    if($(this).hasClass("panel")){
                        $(this).removeClass("panel");
                        $(this).removeClass("showing");
                        $(this).css("display", "none");
                    }else{
                        $(this).addClass("panel");
                    }
                });
            }
        })

        

    }
})
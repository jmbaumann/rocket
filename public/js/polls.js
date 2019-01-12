$(document).ready(function() {
	console.log("fucking christ");
	var sub = $('#show-results');
	console.log(sub);
    $('#show-results').click(function(event){
    event.preventDefault();
    console.log("show results");
    });

    $("#poll-form").submit(function(event){
        event.preventDefault();
        var storyID = $(this).parent().attr('id');
        console.log(storyID);
        castVote();
        console.log("here");
    });
    

    function castVote() {
        //hide poll and show results
        

        console.log(req.body.vote);

    }
})
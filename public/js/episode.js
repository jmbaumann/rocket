window.onload = function() {
    var desc = document.getElementById("about");
    desc.innerHTML = nl2br(desc.innerHTML, false);
    console.log(desc);

    $.setCarControlHeight();
}



var dbID;

function setDBID(id) {
    dbID = id;
    document.getElementById("hidden-id").value = id;
    console.log(id);
}

var ytID;

function setYTID(id) {
    ytID = id;
}

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: ytID,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    player.playVideo();
}

function onPlayerStateChange(event) {
    //TO DO
}



function submitComment(fullname) {
    var newComment = document.createElement('div');
    newComment.classList.add('comment');

    var img = document.createElement('img');
    img.classList.add('profile-pic');
    img.src = '/img/avatar.png';            //TO DO - will update to proper filepath

    var name = document.createElement('p');
    name.classList.add('username');
    name.innerHTML = fullname;

    var date = document.createElement('p');
    date.classList.add('date');
    date.innerHTML = new Date();

    var content = document.createElement('p');
    content.classList.add('content');
    content.innerHTML = document.getElementById('comment-content').value; 

    var reply = document.createElement('button');
    reply.classList.add('comment-button');
    reply.id = 'reply';
    reply.innerHTML = 'Reply';
    //TO DO - button functionality

    var like = document.createElement('button');
    like.classList.add('comment-button');
    like.classList.add('vote');
    like.id = 'agree';
    like.innerHTML = 'Like (0)';

    newComment.appendChild(img);
    newComment.appendChild(name);
    newComment.appendChild(date);
    newComment.appendChild(content);
    newComment.appendChild(reply);
    newComment.appendChild(like);
    //TO DO - button functionality

    var displayComments = document.getElementById('display-comments');
    displayComments.insertBefore(newComment, displayComments.firstChild);
    // document.getElementById('comment-content').value = ''; 
}

function nl2br (str, is_xhtml) {   
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

$(document).ready(function() {
    // MORE EPISODES CAROUSEL
    var cc = $('.car-control');
    var marg = $('#up-next');
    var episode = $('.episode');
    var numEps = episode.length;
    var dist = parseFloat(episode.width()) + parseFloat(episode.css('margin-right')) + 4;
    var maxRight = 50 - (dist * (numEps - 1));
    var shiftDistL = "+=" + dist + "px";
    var shiftDistR = "+=-" + dist + "px";

    var visible = $('.episode-carousel').first().width() - cc.first().width();
    var epsWidth = numEps * dist;
    var minLeft = visible - epsWidth;

    $('#shiftL').click(function(event) {
        event.preventDefault();
        if(parseInt(marg.css('margin-left')) < 35){
            if(parseInt(marg.css('margin-left')) + dist > 50){
                $('#up-next').animate({
                    marginLeft: "50px"
                }, "fast");
            }else{
                $('#up-next').animate({
                    marginLeft: shiftDistL
                }, "fast");
            }
            
        }
    });

    $('#shiftR').click(function(event) {
        event.preventDefault();
        if(parseInt(marg.css('margin-left')) > minLeft){
            if(parseInt(marg.css('margin-left')) - dist < minLeft){
                var ml = minLeft + "px";
                $('#up-next').animate({
                    marginLeft: ml
                }, "fast");
            }else{
                $('#up-next').animate({
                    marginLeft: shiftDistR
                }, "fast");
            }
            
        }
    });


    $.setCarControlHeight = function() {
        // set carousel control buttons' heights
        cc.each(function(index){
            console.log($(this).parent().outerHeight(true));
            var h = $(this).parent().outerHeight(true);
            $(this).height(h);
            console.log("here");
        });
    }



    // SUBMITTING A NEW COMMENT
    // Comment added to db, then #new-comment is populated with submitted data
    $("#comment-form").submit(function(event){
        event.preventDefault();
        ajaxPost();
    });

    function ajaxPost() {
        var formData = {
            user_id: $('#hidden-user-id').val(),
            user_name: $('#hidden-user-name').val(),
            content: $('#comment-content').val(),
            video_id: $('#hidden-id').val()
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url : "/shows/comment",
            data : JSON.stringify(formData),
            dataType : 'json',
            success : function(comment) {
                console.log("success in ajax");
                $("#new-comment").html(
                    "<img class=\"profile-pic\" src=\"/img/avatar.png\"></img>" +
                    "<p class=\"username\">" + comment.user_name + "</p>" +
                    "<p class=\"date\">" + comment.posted_on + "</p>" +
                    "<p class=\"content\">" + comment.content + "</p>" +
                    "<button class=\"comment-button\" id=\"reply\">Reply</button>" +
                    "<button class=\"comment-button vote\" class=\"like\">Like (" + comment.likes +")</button>"
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



    // Sorting comments by Top Voted
    $("#top-voted").click(function() {
        var video_id = window.location.pathname;
        video_id = video_id.substring(video_id.lastIndexOf('/') + 1);

        var data = {
            video_id: video_id
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url : "/shows/top-voted",
            data: JSON.stringify(data),
            dataType: 'json',
            success : function(response) {
                var displayComments = $('#display-comments');
                displayComments.html('');

                response.comments.forEach(function(comment){
                    displayComments.append(
                        "<div class=\"comment\">" +
                            "<img class=\"profile-pic\" src=\"/img/avatar.png\"></img>" +
                            "<p class=\"username\">" + comment.user_name + "</p>" +
                            "<p class=\"date\">" + comment.posted_on + "</p>" +
                            "<p class=\"content\">" + comment.content + "</p>" +
                            "<button class=\"comment-button\" id=\"reply\">Reply</button>" +
                            "<div class=\"comment-button vote\">" +
                                "<button class=\"like\"><i class=\"far fa-thumbs-up\"></i></button><label class=\"num-likes\">" + comment.likes + "</label>" +
                            "</div>" +
                        "</div"
                    );
                });
            }
        });

        var buttons = document.getElementsByClassName('sort-by');
        for(var i = 0; i < buttons.length; i++){
            buttons[i].classList.remove('sorted');
        }
        document.getElementById('top-voted').classList.add('sorted');
    });

    // Sorting comments by Most Recent(default)
    $('#most-recent').click(function() {
        var video_id = window.location.pathname;
        video_id = video_id.substring(video_id.lastIndexOf('/') + 1);

        var data = {
            video_id: video_id
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url : "/shows/most-recent",
            data: JSON.stringify(data),
            dataType: 'json',
            success : function(response) {
                var displayComments = $('#display-comments');
                displayComments.html('');

                response.comments.forEach(function(comment){
                    displayComments.append(
                        "<div class=\"comment\">" +
                            "<img class=\"profile-pic\" src=\"/img/avatar.png\"></img>" +
                            "<p class=\"username\">" + comment.user_name + "</p>" +
                            "<p class=\"date\">" + comment.posted_on + "</p>" +
                            "<p class=\"content\">" + comment.content + "</p>" +
                            "<button class=\"comment-button\" id=\"reply\">Reply</button>" +
                            "<div class=\"comment-button vote\">" +
                                "<button class=\"like\"><i class=\"far fa-thumbs-up\"></i></button><label class=\"num-likes\">" + comment.likes + "</label>" +
                            "</div>" +
                        "</div"
                    );
                });
            }
        });

        var buttons = document.getElementsByClassName('sort-by');
        for(var i = 0; i < buttons.length; i++){
            buttons[i].classList.remove('sorted');
        }
        document.getElementById('most-recent').classList.add('sorted');
    });


    // COMMENT LIKE 
    $('.like').click(function() {
        var comment = $(this).parent().parent();
        var thumb = comment.find($(".fa-thumbs-up"));
        if(thumb.hasClass("far")){
            var username = comment.find($(".username"));
            var date = comment.find($(".date"));
            var content = comment.find($(".content"));
            var u = username.html();
            var d = date.html();
            var c = content.html();
            data = {
                username: u,
                date: d,
                content: c
            }

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url : "/shows/like-comment",
                data: JSON.stringify(data),
                dataType: 'json',
                success : function(response) {
                    var label = comment.find($(".num-likes"));
                    label.html(response.comment.likes);
                    thumb.removeClass("far");
                    thumb.addClass("fas");
                }
            });
        }
    });

})
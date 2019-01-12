var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        // height: '720',
        // width: '1080',
        // height: '540',
        // width: '810',
        videoId: '3WCWs_a2IcQ',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    player.playVideo();
    setupPanels();
    start();
}

function onPlayerStateChange(event) {
    //TO DO
}

var story0 = {order: 1, begin: 0, end: 6, id: "story0"};
var story1 = {order: 2, begin: 6, end: 266, id: "story1"};
var story2 = {order: 3, begin: 266, end: 399, id: "story2"};
var story3 = {order: 4, begin: 399, end: 473, id: "story3"};
var story4 = {order: 5, begin: 473, end: 584, id: "story4"};
var story5 = {order: 6, begin: 584, end: 941, id: "story5"};

var stories = [story0, story1, story2, story3, story4, story5];

//set episode value for comments
function setFormID(){
    document.getElementById("hidden-episode-name").value = "12122018";
}

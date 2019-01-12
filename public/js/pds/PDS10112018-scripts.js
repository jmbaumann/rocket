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
        videoId: 'F-A1w_5N8cA',
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
var story1 = {order: 2, begin: 6, end: 173, id: "story1"};
var story2 = {order: 3, begin: 173, end: 261, id: "story2"};
var story3 = {order: 4, begin: 261, end: 340, id: "story3"};
var story4 = {order: 5, begin: 340, end: 406, id: "story4"};
var story5 = {order: 6, begin: 406, end: 736, id: "story5"};

var stories = [story0, story1, story2, story3, story4, story5];

//set episode value for comments
function setFormID(){
    document.getElementById("hidden-episode-name").value = "10112018";
}

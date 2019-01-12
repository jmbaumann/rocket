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
        videoId: 'C5K8pM9WP9E',
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

var story0 = {order: 1, begin: 0, end: 84, id: "story0"};
var story1 = {order: 2, begin: 84, end: 481, id: "story1"};
var story2 = {order: 3, begin: 481, end: 565, id: "story2"};
var story3 = {order: 4, begin: 565, end: 910, id: "story3"};

var stories = [story0, story1, story2, story3];

//set episode value for comments
function setFormID(){
    document.getElementById("hidden-episode-name").value = "12112018";
}

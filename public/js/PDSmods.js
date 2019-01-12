exports.getCurrentStory = function() {
	return currentStory;
}

//
//	PDS10112018-SCRIPTS.JS
//


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

var story1 = {order: 1, begin: 0, end: 6, id: "story1"};
var story2 = {order: 2, begin: 6, end: 173, id: "story2"};
var story3 = {order: 3, begin: 173, end: 261, id: "story3"};
var story4 = {order: 4, begin: 261, end: 340, id: "story4"};
var story5 = {order: 5, begin: 340, end: 406, id: "story5"};
var story6 = {order: 6, begin: 406, end: 736, id: "story6"};

var stories = [story1, story2, story3, story4, story5, story6];


//
//	SCRIPTS.JS
//


var currentTime;    //= player.getCurrentTime()
var currentStory = 0;   //based on current time
var prevStory;

var repeater;	//used in start()

//called at page's launch and recalled every half second
//keeps setting currentTime to the video's current timecode
//when the currentTime is no longer within the bounds of the current story's beginning and end
//the currentStory is changed and the Read More and Conversation windows are updated accordingly
function start() {
	repeater = setTimeout(start, 250);

  	currentTime = player.getCurrentTime();
  	
  	if(currentTime >= stories[currentStory].begin && currentTime < stories[currentStory].end){
		//currentStory is accurate - nothing to do
	}else{
		findCurrentStory();
	}

	progressBar();
  
}

//sets currentStory based on currentTime
//calls makeLie() to refresh Read More and Conversation areas with new curentStory
function findCurrentStory() {
	for (var i = 0; i <= stories.length - 1; i++) {
		if(currentTime >= stories[i].begin && currentTime < stories[i].end){
			currentStory = i;
			break;
		}
	}
	makeLive();
}

//replace the Read More and Conversation divs with current story's
//live Read More and Conversations
function makeLive() {
	var currentStoryReadMore = stories[currentStory].id + "-read-more";
	// var currentStoryConvo = stories[currentStory].id + "-conversation";
	var setReadMoreTo = document.getElementById(currentStoryReadMore).innerHTML;
	// var setConversationTo = document.getElementById(currentStoryConvo).innerHTML;
	document.getElementById("live-read-more").innerHTML = setReadMoreTo;
	// document.getElementById("live-conversation").innerHTML = setConversationTo;

	setupPanels();
	unhide();
}

//makes div visible inside live Read More and Conversation windows
function unhide() {
	document.getElementById("live-read-more").style.display = 'grid';
	// document.getElementById("live-conversation").style.display = 'block';
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



//	 
//	CAROUSEL.JS
//

var livePanel = 0;
var panels;
var dots;
var totalPanels;

function setupPanels() {
	var storyPanelId = stories[currentStory].id + "-read-more";
	panels = document.getElementById(storyPanelId).getElementsByClassName("panel");
	try{
		dots = document.getElementById(storyPanelId + "-dots").getElementsByClassName("dot");
	}catch(err){
		//all good
	}

	totalPanels = panels.length;
	livePanel = 0;
}

function currentPanel(makeLive) {
	livePanel = makeLive;
	showPanel();
}


function plusPanel(change) {
	console.log(livePanel);
	livePanel += change;
	if(livePanel >= totalPanels){
		livePanel = 0;
	} 
	if(livePanel < 0){
		livePanel = totalPanels - 1;
	} 
	showPanel();
}

function showPanel() {
	console.log(livePanel);
	panels = document.getElementById("live-read-more").getElementsByClassName("panel");
	for(var i = 0; i < totalPanels; i++){
		// panels[i].style.display = "none";
		panels[i].className = panels[i].className.replace(" showing", "");
	}
	for(var i = 0; i < dots.length; i++){
		dots[i].className = dots[i].className.replace(" active", "");
	}
	// panels[livePanel].style.display = "block";
	panels[livePanel].className += " showing";
	dots[livePanel].className += " active";


}



//
//	INFO.JS
//

var liveTab = 0;
var tabs = document.getElementsByClassName("tab");
var infoWindows = document.getElementsByClassName("info-window");



function infoTab(tab) {
	liveTab = tab;
	showTab();
}

function showTab() {
	for(var i = 0; i < tabs.length; i++){
		tabs[i].className = tabs[i].className.replace(" open", "");
	}

	for(var i = 0; i < infoWindows.length; i ++){
		infoWindows[i].style.display = "none";
	}

	tabs[liveTab].className += " open";
	infoWindows[liveTab].style.display = "block";
}


//
//	READ-MORE-HELPERS.JS
//

var isShowing = true;

function isReadMoreShowing() {
	return isShowing;
}

function hideOrShow() {
	if(isShowing){
		isShowing = false;
		hideReadMore();
	}else{
		isShowing = true;
		showReadMore();
	}
}

function hideReadMore() {
	console.log("hiding");
	//change right grid to 30px 1fr
	//hide everything in read-more except show button
	//set comment-wrapper max height

	//bigger one covering all of conversation
	var liveConvoHeight = document.getElementsByClassName("left")[0].clientHeight - 30;
	//smaller, doesn't cover entry field
	var newMaxHeight = liveConvoHeight - 90;
	var newMaxHeightpx = newMaxHeight + "px";
	var liveConvoHeightpx = liveConvoHeight + "px";
	document.getElementById("comments-wrapper").style.maxHeight = newMaxHeightpx;
	document.getElementById("comments-wrapper").style.height = newMaxHeightpx;
	document.getElementById("live-conversation").style.height = liveConvoHeightpx;
	document.getElementById("conversation").style.height = liveConvoHeightpx;

	var right = document.getElementsByClassName("right");
	right[0].className = right[0].className.replace("right", "no-show");

	//GIVES READ-MORE CLASS OF TEMP-READ-MORE
	document.getElementById("read-more").classList.add("temp-read-more");

	//SHOW MINI BAR
	document.getElementById("mini-bar").style.display = "block";

	//HIDES LIVE-READ-MORE TO SHOW MINIMIZED-READ-MORE
	document.getElementById("live-read-more").style.display = "none";
	document.getElementById("minimized-read-more").style.display = "inline-block";

	// bars[0].style.display = "block";

}

function showReadMore() {
	console.log("showing");
	//change right grid to 1fr 1fr
	//unhide everything in read-more
	var noShow = document.getElementsByClassName("no-show");
	noShow[0].className = noShow[0].className.replace("no-show", "right");

	document.getElementById("read-more").classList.remove("temp-read-more");

	document.getElementById("live-read-more").style.display = "grid";
	document.getElementById("minimized-read-more").style.display = "none";

	//HIDE MINI-BAR
	document.getElementById("mini-bar").style.display = "none";

	var newHeight = (document.getElementsByClassName("left")[0].clientHeight / 2) - 90;
	var newHeightpx = newHeight + "px";
	document.getElementById("comments-wrapper").style.maxHeight = newHeightpx;
}

function showPollResults() {
	//hide poll
	//show results
	document.getElementById("live-read-more").getElementsByClassName("poll")[0].classList.remove("panel");
	document.getElementById("live-read-more").getElementsByClassName("poll")[0].classList.remove("showing");
	document.getElementById("live-read-more").getElementsByClassName("poll")[0].style.display = "none";
	document.getElementById("live-read-more").getElementsByClassName("results")[0].classList.add("panel");
	document.getElementById("live-read-more").getElementsByClassName("results")[0].classList.add("showing");
	var resetLivePAnel = livePanel;
	setupPanels();
	livePanel = resetLivePAnel;
}


function showComment() {
	var hidings = document.getElementById("live-conversation").getElementsByClassName("hiding");
	for(var i = 0; i < hidings.length; i++){
		hidings[i].style.display = "inline-block";
	}
	
}
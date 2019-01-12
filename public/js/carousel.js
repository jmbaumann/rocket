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
	// console.log(livePanel);
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
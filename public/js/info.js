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
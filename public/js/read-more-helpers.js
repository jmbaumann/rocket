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
	var liveConvoHeight = document.getElementsByClassName("right")[0].clientHeight;
	//smaller, doesn't cover entry field
	liveConvoHeight -= 35;
	var liveConvoHeightpx = liveConvoHeight + "px";
	document.getElementById("live-conversation").style.maxHeight = liveConvoHeightpx;

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

	// var newHeight = (document.getElementsByClassName("left")[0].clientHeight / 2) - 90;
	// var newHeightpx = newHeight + "px";
	// document.getElementById("comments-wrapper").style.maxHeight = newHeightpx;
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
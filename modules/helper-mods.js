exports.renameStoryConvos = function() {
	var toRename = document.getElementsByClass("convo");
	for(var i = 0; i < toRename.length; i++){
		// var name = "story" + i;
		var dumi = i+1;
		var name = "story" + dumi + "-conversation";
		toRename[i].setAttribute("id", name);
	}
}
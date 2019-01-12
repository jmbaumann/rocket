function selectShow(idx){
	var showSelector = document.getElementsByClassName("show-option");
	for(var i = 0; i < showSelector.length; i++){
		showSelector[i].classList.remove("option-chosen");
	}
	showSelector[idx].classList.add("option-chosen");

	//call to API
}

$(document).ready(function() {
	var showLinks = $(".show-link");
	showLinks.each(function(index){
		var link = $(this)
		var ser = link.html();
        var data = {
            series: ser
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url : "/shows/get-series",
            data: JSON.stringify(data),
            dataType: 'json',
            success : function(response) {
            	link.attr("href", response.page);
            }
        });
		
	});
})
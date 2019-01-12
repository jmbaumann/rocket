window.onload = function(){
	var navs = document.getElementsByClassName("top-bar-links");
	for(var i = 0; i < navs.length; i++){
		navs[i].classList.remove("nav-active");
	}
	document.getElementById("nav-home").classList.add("nav-active");

	$.setCarControlHeight();
}

$(document).ready(function() {

	// set links for the series tags
	var showLinks = $(".series");
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




	// carousel logic and button controls
	var cc = $('.car-control');
	
	var margPDS = $('#all-recent-pds');
	var margOther = $('#all-recent-episodes');
	var margShop = $('#all-featured-shop');

	var pdsEps = $('#all-recent-pds .episode');
	var numPDS = pdsEps.length;
	var otherEps = $('#all-recent-episodes .episode');
	var numOther = otherEps.length;
	var shopItems = $('#all-featured-shop .product');
	var numShop = shopItems.length;

	var episode = $('.episode');
	var dist = parseFloat(episode.width()) + parseFloat(episode.css('margin-right')) + 4;
	var shiftDistL = "+=" + dist + "px";
	var shiftDistR = "+=-" + dist + "px";


	var product = $('.product');
	var prodDist = parseFloat(product.width()) + parseFloat(product.css('margin-right')) + 4;
	var shiftProdL = "+=" + prodDist + "px";
	var shiftProdR = "+=-" + prodDist + "px";

	var maxRightPDS = 50 - (dist * (numPDS - 1));
	var maxRightOther = 50 - (dist * (numOther - 1));
	var maxRightShop = 50 - (prodDist * (numShop - 1));

	var visible = $('.episode-carousel').first().width() - (cc.first().width());
	var pdsEpsWidth = numPDS * dist;
	var minLeftPDS = visible - pdsEpsWidth;
	var otherEpsWidth = numOther * dist;
	var minLeftOther = visible - otherEpsWidth;
	var shopProdsWidth = numShop * prodDist;
	var minLeftShop = visible - shopProdsWidth;

	$('#shiftLPDS').click(function(event) {
		event.preventDefault();
		if(parseInt(margPDS.css('margin-left')) < 35){
			if(parseInt(margPDS.css('margin-left')) + dist > 50){
				$('#all-recent-pds').animate({
			        marginLeft: "50px"
			    }, "fast");
			}else{
				$('#all-recent-pds').animate({
			        marginLeft: shiftDistL
			    }, "fast");
			}
		}
	});

	$('#shiftRPDS').click(function(event) {
		event.preventDefault();
		if(parseInt(margPDS.css('margin-left')) > minLeftPDS){
			if(parseInt(margPDS.css('margin-left')) - dist < minLeftPDS){
				var ml = minLeftPDS + "px";
				$('#all-recent-pds').animate({
			        marginLeft: ml
			    }, "fast");
			}else{
				$('#all-recent-pds').animate({
			        marginLeft: shiftDistR
			    }, "fast");
			}
		}
	});

	$('#shiftLOther').click(function(event) {
		event.preventDefault();
		if(parseInt(margOther.css('margin-left')) < 35){
			if(parseInt(margOther.css('margin-left')) + dist > 50){
				$('#all-recent-episodes').animate({
			        marginLeft: "50px"
			    }, "fast");
			}else{
				$('#all-recent-episodes').animate({
			        marginLeft: shiftDistL
			    }, "fast");
			}
		}
	});

	$('#shiftROther').click(function(event) {
		event.preventDefault();
		if(parseInt(margOther.css('margin-left')) > minLeftOther){
			if(parseInt(margOther.css('margin-left')) - dist < minLeftOther){
				var ml = minLeftOther + "px";
				$('#all-recent-episodes').animate({
			        marginLeft: ml
			    }, "fast");
			}else{
				$('#all-recent-episodes').animate({
			        marginLeft: shiftDistR
			    }, "fast");
			}
		}
	});

	$('#shiftLShop').click(function(event) {
		event.preventDefault();
		if(parseInt(margShop.css('margin-left')) < 35){
			if(parseInt(margShop.css('margin-left')) + dist > 50){
				$('#all-featured-shop').animate({
			        marginLeft: "50px"
			    }, "fast");
			}else{
				$('#all-featured-shop').animate({
		        	marginLeft: shiftProdL
		    	},"fast");
			}
			 
		}
	});

	$('#shiftRShop').click(function(event) {
		event.preventDefault();
		if(parseInt(margShop.css('margin-left')) > minLeftShop){
			if(parseInt(margShop.css('margin-left')) - dist < minLeftShop){
				var ml = minLeftShop + "px";
				$('#all-featured-shop').animate({
			        marginLeft: ml
			    }, "fast");
			}else{
				$('#all-featured-shop').animate({
			        marginLeft: shiftProdR
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
	
})
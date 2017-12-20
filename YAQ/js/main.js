
window.onload = function () {
    // Initialization
	console.log($("#main_carousel").first().find("[data-slick-index='" + 0 + "']"));
	$("#main_carousel").first().find("[data-slick-index='" + 0 + "']").focus();
	
    // add eventListener for tizenhwkey
	document.addEventListener('keydown', function(e) {
    	console.log(e.keyCode);
    	switch(e.keyCode){
    	// left arrow
		case 37:
			$(".panel:focus").prev().focus();
			break;
		// up arrow
		case 38:
			$("#main_carousel").first().find("[data-slick-index='" + 0 + "']").focus();
			document.scrollTop = 0;
			break; 	
    	// right arrow
    	case 39:
			$(".panel:focus").next().focus();	
    		break;
    	// down arrow
    	case 40:
			$("#subcathegory_carousel").first().find("[data-slick-index='" + 0 + "']").focus();
    		break;
    	}
	});    
};
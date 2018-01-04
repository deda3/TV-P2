//array of selected categories
var categories = []; 

//By default menu is closed
//So set this to false
var menuOpen = false;

window.onload = function () {
	// initialization
	$("#main_carousel").find(".panel.slick-slide.slick-current.slick-active.slick-center").focus();
	// add eventListener for keydown
	document.addEventListener('keydown', function(e) {
		e.preventDefault();
		//console.log(e.keyCode);
		switch(e.keyCode){
		// center button
		case 13: 
			// center button selects/deselects the focused category/subcategory
			if (!$(".panel:focus").hasClass("selected_category")){
				$(".panel:focus").addClass("selected_category");
				var id = getId();
				// if the id is only one character, push all the subcategories
				if (id.length == 1) {
					// erase all the elements already selected before selecting them all.
					// this is to avoid pushing an element twice
					pushSubcategories('erase', id);
					pushSubcategories('push', id);
				} else {
					categories.push(id);
				}
				// select the subcategory panels if needed
				// subcategory string identifiers have more than 11 characters
				if($(".panel:focus").children().attr('src').length <= 11) {
					selectSubcategories('select', id);
				}
			}else{
				$(".panel:focus").removeClass("selected_category");
				var id = getId();
				// if the id is only one character, erase all the subcategories
				if (id.length == 1) {
					pushSubcategories('erase', id);
				} else {
					categories.splice(id,1);
				}
				// unselect the subcategory panels if needed
				// subcategory string identifiers have more than 11 characters
				if($(".panel:focus").children().attr('src').length == 11) {
					selectSubcategories('unselect', id);
				}
			}
			// refresh list of selected categories
			manageListPanel();
			console.log(categories);
			$(".panel:focus").next().focus();
		// left arrow
		case 37:
			$(".panel:focus").prev().focus();
			break;
		// up arrow
		case 38:
			$('html,body').animate({
				scrollTop: 0
			}, 500, function(){ // function to focus here
				$("#main_carousel").find(".panel.slick-slide.slick-current.slick-active.slick-center").focus();
			});
			break; 	
		// right arrow
		case 39:
			$(".panel:focus").next().focus();	
			break;
		// down arrow
		case 40:
			// get the category id the user selected
			var id = getId();
			// load the subcategories panels depending on the category selected
			var subcat = loadSecondPage(id);
			$('html,body').animate({
				scrollTop: $(subcat.concat("carousel")).find(".panel.slick-slide.slick-current.slick-active.slick-center").offset().top
			}, 500, function(){ // function to focus here
				$(subcat.concat("carousel")).find(".panel.slick-slide.slick-current.slick-active.slick-center").focus();
			});
			break;	
		// play button
		case 415:
			// store the categories in localstorage
			localStorage.setItem('categories', categories);
			break;
		// info button
		case 457:
			$("#menu").toggleClass("open");
		    menuOpen =! menuOpen;
			break;
		}
	});    
};

function getId() {
	// get the category which the focused element refers
	var src = $(".panel:focus").children(0).attr('src');
	var id = src.split('_')[0];
	id = id.split('/')[1];
	return id;
}

function loadSecondPage(id) {
	var string
	switch(id) {
	// show elements in music page and hide every other
	case '0':
		$("#music_page").show();
		$("#movies_page").hide();
		$("#sports_page").hide();
		$("#tv_page").hide();
		string = "#music_";
		break;
		// show elements in movies page and hide every other
	case '1': 
		$("#music_page").hide();
		$("#movies_page").show();
		$("#sports_page").hide();
		$("#tv_page").hide();
		string = "#movies_";	
		break;
		// show elements in sports page and hide every other
	case '2': 
		$("#music_page").hide();
		$("#movies_page").hide();
		$("#sports_page").show();
		$("#tv_page").hide();
		string = "#sports_";
		break;
		// show elements in tv page and hide every other
	case '3' : 
		$("#music_page").hide();
		$("#movies_page").hide();
		$("#sports_page").hide();
		$("#tv_page").show();
		string = "#tv_";	
		break;
	}
	return string;
}

function selectSubcategories(string, id) {
	switch (id) {
	// select or unselect every subcategory in the music page
	case '0':
		$("#music_page").children(".wrapper").children(".carousel").children(".slick-list").children(".slick-track").children(".panel").each(function (){
			if(string.localeCompare("select") == 0) {
				$(this).addClass("selected_category");
			} else {
				$(this).removeClass("selected_category");
			}	
		});
		break;
		// select or unselect every subcategory in the movies page
	case '1':
		$("#movies_page").children(".wrapper").children(".carousel").children(".slick-list").children(".slick-track").children(".panel").each(function (){
			if(string.localeCompare("select") == 0) {
				$(this).addClass("selected_category");
			} else {
				$(this).removeClass("selected_category");
			}		
		});
		break;
		// select or unselect every subcategory in the sports page
	case '2': 
		$("#sports_page").children(".wrapper").children(".carousel").children(".slick-list").children(".slick-track").children(".panel").each(function (){
			if(string.localeCompare("select") == 0) {
				$(this).addClass("selected_category");
			} else {
				$(this).removeClass("selected_category");
			}		
		});
		break;
		// select or unselect every subcategory in the tv programs page
	case '3': 
		$("#tv_page").children(".wrapper").children(".carousel").children(".slick-list").children(".slick-track").children(".panel").each(function (){
			if(string.localeCompare("select") == 0) {
				$(this).addClass("selected_category");
			} else {
				$(this).removeClass("selected_category");
			}
		});
		break;
	}
}

function pushSubcategories(string, id) {
	// push every subcategory automatically, the amount of subcategories depends on the category they refere to
	switch(id) {
	case '0':
		for (var i = 0; i < 6; i++) {
			if(string.localeCompare("push") == 0) {
				categories.push(id.concat(i.toString()));
			}else{
				// find the category to substract in the array and substract it
				var index = categories.indexOf(id.concat(i.toString()));
				if (index != -1) {
					categories.splice(index);
				}
			}
		}
		break;
	case '1':
		for (var i = 0; i < 10; i++) {
			if(string.localeCompare("push") == 0) {
				categories.push(id.concat(i.toString()));
			}else{
				// find the category to substract in the array and substract it
				var index = categories.indexOf(id.concat(i.toString()));
				if (index != -1) {
					categories.splice(index);
				}			
			}
		}
		break;
	case '2':
		for (var i = 0; i < 6; i++) {
			if(string.localeCompare("push") == 0) {
				categories.push(id.concat(i.toString()));
			}else{
				// find the category to substract in the array and substract it
				var index = categories.indexOf(id.concat(i.toString()));
				if (index != -1) {
					categories.splice(index);
				}			
			}
		}
		break;
	case '3':
		for (var i = 0; i < 5; i++) {
			if(string.localeCompare("push") == 0) {
				categories.push(id.concat(i.toString()));
			}else{
				// find the category to substract in the array and substract it
				var index = categories.indexOf(id.concat(i.toString()));
				if (index != -1) {
					categories.splice(index);
				}			
			}
		}
		break;
	}
}

function manageListPanel() {
	var string;
	// empty the list in the html
	$(".categories_list").empty();
	// fill the list in the html
	categories.forEach(function(cat){
		switch(cat){
		case '00':
			string = "Music: R&B";
			break;
		case '01':
			string = "Music: Hip - Hop | Rap";
			break;
		case '02': 
			string = "Music: Classical"
			break;
		case '03': 
			string = "Music: Electronical"
			break;
		case '04':
			string = "Music: Pop | Rock";
			break;
		case '05':
			string = "Music: Latin";
			break;
		case '10':
			string = "Movies: Action";
			break;
		case '10':
			string = "Movies: Comedy";
			break;
		case '10':
			string = "Movies: Historical";
			break;
		case '10':
			string = "Movies: Horror";
			break;
		case '10':
			string = "Movies: Sci-Fi";
			break;
		case '10':
			string = "Movies: Fantasy";
			break;
		case '10':
			string = "Movies: Western";
			break;
		case '10':
			string = "Movies: Suspense";
			break;
		case '10':
			string = "Movies: Romance";
			break;
		case '19':
			string = "Movies: Animation";
			break;
		case '20':
			string = "TV: News";
			break;
		case '20':
			string = "TV: Gossip";
			break;
		case '20':
			string = "TV: Reality Shows";
			break;
		case '20':
			string = "TV: Game Shows";
			break;
		case '24':
			string = "TV: Late Nights";
			break;
		case '30':
			string = "Sports: Olympics";
			break;
		case '31':
			string = "Sports: Football";
			break;
		case '32':
			string = "Sports: Basketball";
			break;
		case '33':
			string = "Sports: Tennis";
			break;
		case '34':
			string = "Sports: F1";
			break;
		case '35':
			string = "Sports: Moto GP";
			break;
		}
		
		$(".categories_list").append("<li>" + string + "</li>");
	});
}

function writeFile(){
	var documents_obj, newFile;
	tizen.filesystem.resolve('documents', function(obj) {
		// get the virtual root documents directory
		documents_obj = obj;
		// delete the file if it exists
		newFile = documents_obj.resolve('categories.json');
		if(newFile != null) {
			documents_obj.deleteFile(newFile.fullPath, function(){
				console.log('File categories.json deleted');
			}, onError);
		}
		// create a new file to store the categories
		newFile = documents_obj.createFile('categories.json');
		if (newFile != null) {
			console.log('File categories.json created');
			newFile.openStream('rw', function(fs){
				fs.write('{"categories" : [' + JSON.stringify(categories) + ']}');
				fs.close();
			}, null, 'UTF-8');
		}
		readFile('categories.json');
	}, onError,'rw');
}

function readFile(filePath) {
	var documents_obj, file;
	tizen.filesystem.resolve('documents', function(obj) {
		// get the virtual root documents directory
		documents_obj = obj;
		// find the given path to file and parse it to a JS object
		file = obj.resolve(filePath);
		if(file != null){
			file.openStream('r',function(fs){
				var obj = JSON.parse(fs.read(file.fileSize));
				fs.close();
				console.log(obj);
			}, onError, 'UTF-8');
		}
	}, onError, 'r');
}

var onError = function(e){
	console.log(e.name + ': ' + e.message);
}

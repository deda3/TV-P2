//create Main page
createPage(4, 5, "img/", "#main_carousel");
//create Music page
createPage(6, 2, "img/0", "#music_carousel");
//create Movies page
createPage(10, 2, "img/1", "#movies_carousel");
//create Sports page
createPage(6, 2, "img/2", "#sports_carousel");
//create TV page
createPage(5, 2, "img/3", "#tv_carousel");

function createPage(numOfImages, numOfId, stringRoot, stringElementId) {
	// create the page
	for(i = 0; i < numOfImages; i++) {
		// get a random number between 0 and 2
		var id = Math.floor(Math.random() * numOfId);
		// create the panel element
		var div = document.createElement('div');
		div.className = 'panel';
		// create the image element
		var img = document.createElement('img');
		img.src = stringRoot.concat(i.toString(), "_", id.toString(), ".png");
		// append the elements to create the html structure
		div.append(img);
		$(stringElementId).append(div);
	}
}
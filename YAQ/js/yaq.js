
var hardcoded_video = 'video/1500.mp4';

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function cleanScreen(){
	document.getElementById('container').innerHTML = '';
	
	var videoContainer = document.createElement('div');
	videoContainer.id = 'video-container';
	document.getElementById('container').appendChild(videoContainer);
	
	var numContainer = document.createElement('div');
	numContainer.id = 'num-container';
	document.getElementById('container').appendChild(numContainer);
	
	var timeContainer = document.createElement('div');
	timeContainer.id = 'time-container';
	document.getElementById('container').appendChild(timeContainer);
	
	var questionContainer = document.createElement('div');
	questionContainer.id = 'question-container';
	document.getElementById('container').appendChild(questionContainer);
	
	var answersContainer = document.createElement('div');
	answersContainer.id = 'answers-container';
	document.getElementById('container').appendChild(answersContainer);
	
	var lifelinesContainer = document.createElement('div');
	lifelinesContainer.id = 'lifelines-container';	
	document.getElementById('container').appendChild(lifelinesContainer);
}

function getSelectedCategories(){
	return JSON.parse(localStorage.getItem('categories'));
}

var timer;

var index;

var compt;

var sec;

var selectedCategories;

var elevenQuestions;

var deletedAnswers;

var panelId = 0;

var Lifelines = {
	half: false,
	repeat: false,
	change: false,
	time: false
};

window.onload = function () {
	//Get selected categories from previous sliders
	selectedCategories = getSelectedCategories();
	
	//Set global events
	document.addEventListener('keydown', function(e) {
    	console.log(e.keyCode);
    	
    	switch(e.keyCode){
    	// RED -> 50:50
		case 403:
			if(panelId === 'Q' && Checker.checkLifeline('half')){
				document.getElementById('half').style.backgroundColor = 'maroon';
				document.getElementById('half').style.opacity = '0.6';
				
				sec = timer.getTimeValues().toString();
				
				timer.pause();
				
				var nums = [];
				
				for(var num = 1; num <= 4; num++){
					if(!Checker.isCorrect(num)){
						nums.push(num);
					}
				}
				
				nums = shuffle(nums);
				
				document.getElementById(nums[0]).style.opacity = '0';
				document.getElementById(nums[1]).style.opacity = '0';
				
				deletedAnswers[nums[0]-1] = true;
				deletedAnswers[nums[1]-1] = true;
				
				timer.start({countdown: true, startValues: {seconds: sec}});
			}
			
			break;
		// GREEN -> repeat
		case 404:
			if(panelId === 'Q' && Checker.checkLifeline('repeat')){
				document.getElementById('repeat').style.backgroundColor = 'seagreen';
				document.getElementById('repeat').style.opacity = '0.6';
				
				sec = timer.getTimeValues().toString();
				
				timer.pause();
				
				cleanScreen();
				
				playVideo();
			}
			
			break; 	
    	// YELLOW -> change
    	case 405:
    		if(panelId === 'Q' && Checker.checkLifeline('change')){
				document.getElementById('change').style.backgroundColor = 'gold';
				document.getElementById('change').style.opacity = '0.6';
    			index++;
    			
    			timer.stop();
				
				initQuestion();
			}
    		
    		break;
    	// BLUE -> time
    	case 406:
    		if(panelId === 'Q' && Checker.checkLifeline('time')){
				document.getElementById('time').style.backgroundColor = 'darkblue';
				document.getElementById('time').style.opacity = '0.6';
				
    			timer.reset();
			}
    		
    		break;
    	// ENTER -> several things
    	case 13:
    		switch(panelId){
    		case 'N': initQuestion(); break;
    		case 'W': document.location.href = 'index.html'; break;
    		case 'L': document.location.href = 'index.html'; break;
    		case 'Q': Checker.checkAnswer(); break;
    		}
    		break;
    	// LEFT nav
    	case 37:
    		if(panelId === 'Q'){
    			var id = document.activeElement.id;
    			switch(parseInt(id)){
    			case 1: break;
    			case 2:
    				if(!deletedAnswers[0]){
    					document.activeElement.blur();
    					document.getElementById('1').focus();
    				}else if(!deletedAnswers[2]){
    					document.activeElement.blur();
    					document.getElementById('3').focus();
    				}
    				break;
    			case 3: break;
    			case 4:
    				if(!deletedAnswers[2]){
    					document.activeElement.blur();
    					document.getElementById('3').focus();
    				}else if(!deletedAnswers[0]){
    					document.activeElement.blur();
    					document.getElementById('1').focus();
    				}
    				break;
    			}
    		}
			break;
		// UP nav
		case 38:
			if(panelId === 'Q'){
				var id = document.activeElement.id;
				switch(parseInt(id)){
				case 1: break;
				case 2: break;
				case 3:
					if(!deletedAnswers[0]){
						document.activeElement.blur();
						document.getElementById('1').focus();
					}else if(!deletedAnswers[1]){
						document.activeElement.blur();
						document.getElementById('2').focus();
					}
					break;
				case 4:
					if(!deletedAnswers[1]){
						document.activeElement.blur();
						document.getElementById('2').focus();
					}else if(!deletedAnswers[0]){
						document.activeElement.blur();
						document.getElementById('1').focus();
					}
					break;
				}
			}
			break;
    	// RIGHT nav
    	case 39:
    		if(panelId === 'Q'){
    			var id = document.activeElement.id;
    			switch(parseInt(id)){
    			case 1:
    				if(!deletedAnswers[1]){
						document.activeElement.blur();
						document.getElementById('2').focus();
					}else if(!deletedAnswers[3]){
	    				document.activeElement.blur();
	    				document.getElementById('4').focus();
					}
    				break;
    			case 2: break;
    			case 3:
    				if(!deletedAnswers[3]){
        				document.activeElement.blur();
        				document.getElementById('4').focus();
					}else if(!deletedAnswers[1]){
						document.activeElement.blur();
						document.getElementById('2').focus();
					}
    				break;
    			case 4: break;
    			}
    		}
			break;
    	// DOWN nav
    	case 40:
    		if(panelId === 'Q'){
    			var id = document.activeElement.id;
				switch(parseInt(id)){
				case 1:
					if(!deletedAnswers[2]){
        				document.activeElement.blur();
        				document.getElementById('3').focus();
					}else if(!deletedAnswers[3]){
						document.activeElement.blur();
						document.getElementById('4').focus();
					}
					break;
				case 2:
					if(!deletedAnswers[3]){
        				document.activeElement.blur();
        				document.getElementById('4').focus();
					}else if(!deletedAnswers[2]){
						document.activeElement.blur();
						document.getElementById('3').focus();
					}
					break;
				case 3: break;
				case 4: break;
				}
    		}
			break;
    	}
	});
	
	initGame();
};

function initGame(){
	var selectedQuestions = [];
	
	for(var i = 0; i < selectedCategories.length; i++){
		var selectedCategory = selectedCategories[i];

		var minIndex;
		var maxIndex;
		
		//Is mother
		if(selectedCategory.length === 1){
			minIndex = selectedCategory + '000';
			maxIndex = selectedCategory + '999';
		}
		//Is child
		else{
			minIndex = selectedCategory + '00';
			maxIndex = selectedCategory + '99';
		}
		
		var newQuestions = questions.filter(function(value, index){
			return index >= minIndex && index <= maxIndex;
		}, this);
		
		selectedQuestions = selectedQuestions.concat(newQuestions);
	}
	
	var validQuestions = [];
	
	for (var i = 0; i < selectedQuestions.length; i++) {
	    if (selectedQuestions[i].videoPath) {
	    	validQuestions.push(selectedQuestions[i]);
	    }
	  }
	
	validQuestions = shuffle(validQuestions);
	
	elevenQuestions = validQuestions.slice(0,11);
	
	index = 0;
	compt = 1;
	
	opening();
}

function opening(){
	panelId = 'O';
	
	cleanScreen();
	
	var path = 'video/opening.mp4';
	
	var video = playGameVideo(hardcoded_video, 'opening');
	
	video.addEventListener('ended', function(){
		cleanScreen();
		initQuestion();
	});
}

function initQuestion(){
	cleanScreen();
	
	deletedAnswers = [false, false, false, false];
	
	sec = 60;
	
	timer = new Timer();
	
	playVideo();
}

function playVideo(){
	panelId = 'V';
	
	var path = elevenQuestions[index].videoPath;

	var video = playGameVideo(path, 'video');
	
	video.addEventListener('ended', function(){
		cleanScreen();
		showQuestion();
	});
}

function showQuestion(){
	panelId = 'Q';
	
	var question = elevenQuestions[index].question;
	var answers = elevenQuestions[index].answers;
	
	document.getElementById('num-container').innerHTML = compt + ' / 10';
	
	var timeContainer = document.getElementById('time-container');
	var countdownTag = document.createElement('p');
	countdownTag.id = 'countdown';
	timeContainer.appendChild(countdownTag);
	countdownTag.innerHTML = '60';
	timer.addEventListener('secondsUpdated', function() {
		countdownTag.innerHTML = timer.getTimeValues().seconds.toString();
		
		if(timer.getTimeValues().seconds === 1 || timer.getTimeValues().seconds === 3){
			countdownTag.style.backgroundColor = 'rgba(200,0,0,0.5)';
		}else{
			countdownTag.style.backgroundColor = 'rgba(20,20,20,0.5)';
		}
	});
	timer.addEventListener('targetAchieved', function() {
		timer.stop();
	    lose();
	});
	
	var questionContainer = document.getElementById('question-container');
	var questionTag = document.createElement('p');
	questionTag.innerHTML = question;
	questionTag.id = 'question';
	questionContainer.appendChild(questionTag);
	
	var answersContainer = document.getElementById('answers-container');
	var answersTable = document.createElement('table');
	var row1 = document.createElement('tr');
	var answer1 = document.createElement('td');
	answer1.innerHTML = answers[0];
	answer1.id = '1';
	answer1.setAttribute('class', 'answer');
	answer1.setAttribute('tabindex', '0');
	if(deletedAnswers[0]){answer1.style.opacity = '0';}
	var answer2 = document.createElement('td');
	answer2.innerHTML = answers[1];
	answer2.id = '2';
	answer2.setAttribute('class', 'answer');
	answer2.setAttribute('tabindex', '0');
	if(deletedAnswers[1]){answer2.style.opacity = '0';}
	row1.appendChild(answer1);
	row1.appendChild(answer2);
	var row2 = document.createElement('tr');
	var answer3 = document.createElement('td');
	answer3.innerHTML = answers[2];
	answer3.id = '3';
	answer3.setAttribute('class', 'answer');
	answer3.setAttribute('tabindex', '0');
	if(deletedAnswers[2]){answer3.style.opacity = '0';}
	var answer4 = document.createElement('td');
	answer4.innerHTML = answers[3];
	answer4.id = '4';
	answer4.setAttribute('class', 'answer');
	answer4.setAttribute('tabindex', '0');
	if(deletedAnswers[3]){answer4.style.opacity = '0';}
	row2.appendChild(answer3);
	row2.appendChild(answer4);
	answersTable.appendChild(row1);
	answersTable.appendChild(row2);
	answersContainer.appendChild(answersTable);
	
	answer1.focus();
	
	var lifelinesContainer = document.getElementById('lifelines-container');
	var lifelinesTable = document.createElement('table');
	var bHalf = document.createElement('td');
	bHalf.innerHTML = '<p> 50:50 </p>';
	bHalf.id = 'half';
	bHalf.setAttribute('class', 'lifeline');
	lifelinesTable.appendChild(bHalf);
	var bRepeat = document.createElement('td');
	bRepeat.innerHTML = '<i class="fa fa-repeat"></i>';
	bRepeat.id = 'repeat';
	bRepeat.setAttribute('class', 'lifeline');
	lifelinesTable.appendChild(bRepeat);
	var bChange = document.createElement('td');
	bChange.innerHTML = '<i class="fa fa-exchange"></i>';
	bChange.id = 'change';
	bChange.setAttribute('class', 'lifeline');
	lifelinesTable.appendChild(bChange);
	var bTime = document.createElement('td');
	bTime.innerHTML = '<i class="fa fa-hourglass-end"></i>';
	bTime.id = 'time';
	bTime.setAttribute('class', 'lifeline');
	lifelinesTable.appendChild(bTime);
	lifelinesContainer.appendChild(lifelinesTable);
	
	if(Lifelines.half){
		bHalf.style.backgroundColor = 'maroon';
		bHalf.style.opacity = '0.6';
	}
	if(Lifelines.repeat){
		bRepeat.style.backgroundColor = 'seagreen';
		bRepeat.style.opacity = '0.6';
	}
	if(Lifelines.change){
		bChange.style.backgroundColor = 'gold';
		bChange.style.opacity = '0.6';
	}
	if(Lifelines.time){
		bTime.style.backgroundColor = 'darkblue';
		bTime.style.opacity = '0.6';
	}

	var color;
	
	switch(elevenQuestions[index].category){
	case 'music': color = 'rgba(102, 0, 102, 0.3)'; break;
	case 'movies&TVseries': color = 'rgba(102, 0, 0, 0.3)'; break;
	case 'TVprograms': color = 'rgba(0, 134, 179, 0.3)'; break;
	case 'sports': color = 'rgba(51, 102, 0, 0.3)'; break;
	}
	
	timeContainer.style.backgroundColor = color;
	questionContainer.style.backgroundColor = color;
	
	var str = 'solid thin white';
	answersContainer.style.borderTop = str;
	answersContainer.style.borderBottom = str;
	
	timer.start({countdown: true, startValues: {seconds: sec}});
}

var Checker = {
	checkLifeline: function checkLifeline(lifeline){
		if(Lifelines[lifeline]){
			return false;
		}else{
			Lifelines[lifeline] = true;
			return true;
		}
	},
	
	checkAnswer: function checkAnswer(){
		timer.stop();
		
		if(Checker.isCorrect()){
			index++;
			compt++;
			
			if(!Lifelines.change && index < 10 || Lifelines.change && index < 11){
				next();
			}else{
				win();
			}
		}else{
			lose();
		}
	},
	
	isCorrect: function isCorrect(id){
		if(id){
			return (elevenQuestions[index].correctAnswer === elevenQuestions[index].answers[id-1]);
		}else{
			return (elevenQuestions[index].correctAnswer === document.activeElement.innerHTML);
		}
	}
};

function next(){
	panelId = 'N';
	
	cleanScreen();
	
	var path = 'video/next.mp4';
	
	playGameVideo(hardcoded_video, 'next');
}

function win(){
	panelId = 'W';
	
	cleanScreen();
	
	var path = 'video/win.mp4';
	
	playGameVideo(hardcoded_video, 'win');
}

function lose(){
	panelId = 'L';
	
	cleanScreen();
	
	var path = 'video/lose.mp4';
	
	playGameVideo(hardcoded_video, 'lose');
}

function playGameVideo(path, id){
	var container = document.getElementById('video-container');
	
	var video = document.createElement('video');
	video.id = id;
	video.autoplay = true;
	video.src = path;
	
	container.appendChild(video);
	
	return video;
}


function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function cleanScreen(){
	document.getElementById('container').innerHTML = '';
}

function loadAllJSON(){
	var path = 'json/questions.json';
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function(){
		if(this.xmlhttp.readyState === 4 && this.xmlhttp.status !== 200){
			var questions = JSON.parse(this.xmlhttp.responseText);
			
			initGame(questions);
		}
	};
	
	xmlhttp.open("GET", path, true);
	xmlhttp.overrideMimeType("application/json");
	xmlhttp.send();
}

var timer;

var index;

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
	//Set global events
	document.addEventListener('keydown', function(e) {
    	console.log(e.keyCode);
    	
    	switch(e.keyCode){
    	// RED -> 50:50 lifeline
		case 403:
			if(Checker.checkLifeline('half') && panelId === 'Q'){
				sec = timer.getTimeValues().toString();
				
				timer.pause();
				
				var nums = [];
				
				for(var num = 1; num <= 4; num++){
					if(!Checker.isCorrect(num)){
						nums += num;
					}
				}
				
				shuffle(nums);
				
				document.getElementById(nums[0]).disabled = true;
				document.getElementById(nums[1]).disabled = true;
				
				deletedAnswers[nums[0]-1] = true;
				deletedAnswers[nums[1]-1] = true;
				
				timer.start({countdown: true, startValues: {seconds: sec}});
			}
			
			break;
		// GREEN -> repeat lifeline
		case 404:
			if(Checker.checkLifeline('repeat') && panelId === 'Q'){
				sec = timer.getTimeValues().toString();
				
				timer.pause();
				
				cleanScreen();
				
				playVideo();
			}
			
			break; 	
    	// YELLOW -> change lifeline
    	case 405:
    		if(Checker.checkLifeline('change') && panelId === 'Q'){
    			index++;
				
				initQuestion();
			}
    		
    		break;
    	// BLUE -> time lifeline
    	case 406:
    		if(Checker.checkLifeline('time') && panelId === 'Q'){
    			sec = timer.getTimeValues().toString();
				
				timer.pause();
				
				sec += 30;
				
				timer.start({countdown: true, startValues: {seconds: sec}});
			}
    		
    		break;
    	//ENTER -> several things
    	case 13:
    		switch(panelId){
    		case 'N': initQuestion(); break;
    		case 'W': break;
    		case 'L': break;
    		case 'Q': Checker.checkAnswer($(".answer:focus").id); break;
    		}
    		
    		break;
    	}
	});
	
	loadAllJSON();
};

function initGame(questions){
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
		
		selectedQuestions = selectedQuestions + questions.filter(function(index, minIndex, maxIndex){
			return index > minIndex && index < maxIndex;
		});
	}
	
	shuffle(selectedQuestions);
	
	elevenQuestions = selectedQuestions.slice(0,10);
	
	index = 0;
	
	opening();
}

function opening(){
	panelId = 'O';
	
	cleanScreen();
	
	var path = 'video/opening.mp4';
	
	var video = playGameVideo(path, 'opening');
	
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
	
	var path = elevenQuestions[index].video;

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
	
	var timeContainer = document.getElementById('time-container');
	var countdownTag = document.createElement('h2');
	countdownTag.id = 'countdown';
	timeContainer.appendChild(countdownTag);
	countdownTag.html(timer.getTimeValues().toString());
	timer.addEventListener('secondsUpdated', function() {
		countdownTag.html(timer.getTimeValues().toString());
	});
	timer.addEventListener('targetAchieved', function() {
	    lose();
	});
	
	var questionContainer = document.getElementById('question-container');
	var questionTag = document.createElement('h2');
	questionTag.innerHTML = question;
	questionTag.id = 'question';
	questionContainer.appendChild(questionTag);
	
	var answersContainer = document.getElementById('answers-container');
	var answer1 = document.createElement('button');
	answer1.innerHTML = answers[0];
	answer1.id = '1';
	answer1.setAttribute('class', 'answer');
	answer1.focusable = true;
	answersContainer.appendChild(answer1);
	if(deletedAnswers[0]){document.getElementById(1).disabled = true;}
	var answer2 = document.createElement('button');
	answer2.innerHTML = answers[1];
	answer2.id = '2';
	answer2.setAttribute('class', 'answer');
	answer2.focusable = true;
	answersContainer.appendChild(answer2);
	if(deletedAnswers[1]){document.getElementById(2).disabled = true;}
	var answer3 = document.createElement('button');
	answer3.innerHTML = answers[2];
	answer3.id = '3';
	answer3.setAttribute('class', 'answer');
	answer3.focusable = true;
	answersContainer.appendChild(answer3);
	if(deletedAnswers[2]){document.getElementById(3).disabled = true;}
	var answer4 = document.createElement('button');
	answer4.innerHTML = answers[3];
	answer4.id = '4';
	answer4.setAttribute('class', 'answer');
	answer4.focusable = true;
	answersContainer.appendChild(answer4);
	if(deletedAnswers[3]){document.getElementById(4).disabled = true;}
	
	var lifelinesContainer = document.getElementById('lifelines-container');
	var bHalf = document.createElement('button');
	bHalf.innerHTML = '50:50';
	bHalf.id = 'half';
	bHalf.setAttribute('class', 'lifeline');
	lifelinesContainer.appendChild(bHalf);
	var bRepeat = document.createElement('button');
	bRepeat.innerHTML = '&#xe5d5;';
	bRepeat.id = 'repeat';
	bRepeat.setAttribute('class', 'lifeline');
	lifelinesContainer.appendChild(bRepeat);
	var bChange = document.createElement('button');
	bChange.innerHTML = '&#xf268;';
	bChange.id = 'change';
	bChange.setAttribute('class', 'lifeline');
	lifelinesContainer.appendChild(bChange);
	var bTime = document.createElement('button');
	bTime.innerHTML = '&#xe077;';
	bTime.id = 'time';
	bTime.setAttribute('class', 'lifeline');
	lifelinesContainer.appendChild(bTime);
	
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
	
	checkAnswer: function checkAnswer(id){
		if(Checker.isCorrect(id)){
			index++;
			
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
		return (elevenQuestions[index].correctAnswer === elevenQuestions[index].answers[id-1]);
	}
};

function next(){
	panelId = 'N';
	
	cleanScreen();
	
	var path = 'video/next.mp4';
	
	playGameVideo(path, 'next');
}

function win(){
	panelId = 'W';
	
	cleanScreen();
	
	var path = 'video/win.mp4';
	
	playGameVideo(path, 'win');
}

function lose(){
	panelId = 'L';
	
	cleanScreen();
	
	var path = 'video/lose.mp4';
	
	playGameVideo(path, 'lose');
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
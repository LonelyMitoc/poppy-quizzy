// Start button -> starts timer and quiz
// Multiple choices as buttons, button click -> Next question and answer to question before
// >if incorrect, subtract time
// Answer all Qs or score or timer is 0 -> "Game Over"
// Game over -> show score and prompt input of initials
// submit -> store in local storage and display high score, return & clear high score button

// DOM elements
var scoreEl = document.getElementById('scores');
var timerEl = document.getElementById('countdown');
var quizContainer = document.getElementById('quiz-container');
var questionHeading = document.getElementById('heading-questions');
var multipleChoice = document.getElementById('content-body');
var startQuizBtn = document.getElementById('start');
var showAnswer = document.getElementById('answer');

// Quiz state variables
var timeLeft = 75;
var currentQuestionNum = 0;
var timeInterval;
var quizStat = false;

// High score storage
var highScore = [];
var userInitials = "";

// Start button and high score button listeners
startQuizBtn.addEventListener("click", startQuiz);
scoreEl.addEventListener("click", showScores);

// start of the quiz
function startQuiz() {
    countdown();
    renderQuestions();
}

// starts timer and ends quiz when timer is 0
function countdown() {
    timeInterval = setInterval(function () {  
        timeLeft--;
        timerEl.textContent = 'Time: ' + timeLeft +'  seconds';
        if (timeLeft === 0) {
            clearInterval(timeInterval);
            if (questionHeading !== 'Game Over!') {
                endQuiz();
            }
        }
    }, 1000)
}

//renders questions from questions.js
// each multiple choice answer is turned into a button
function renderQuestions() {
    quizStat = true;
    // hide the start button
    startQuizBtn.setAttribute("style", "display: none");
    multipleChoice.textContent = '';
    //render question
    var currentQuestion = questions[currentQuestionNum];
    questionHeading.textContent = currentQuestion.title;
    multipleChoice.innerHtml = "";
    //render multiple choice
    currentQuestion.choices.forEach(function(choice, i){
        var choiceBtn = document.createElement("button");
        choiceBtn.setAttribute("class", "choice");
        choiceBtn.setAttribute("value", choice);

        choiceBtn.textContent = choice;
        choiceBtn.addEventListener("click", answerClick);
        multipleChoice.appendChild(choiceBtn);
    })

}

//action after pressing the answer choice
function answerClick() {
    //if statement to subtract time if incorrect
    if(this.value !== questions[currentQuestionNum].answer) {
        timeLeft -= 15;
        if (timeLeft <0) {
            timeLeft = 0;
        }

        timerEl.textContent = 'Time: ' + timeLeft + ' seconds';
        //shows the result of the question
        showAnswer.textContent = "Wrong"
        showAnswer.style.color = "Red";
        showAnswer.style.fontSize = "200%";
    } else {
        showAnswer.textContent = "Correct"
        showAnswer.style.color = "Green";
        showAnswer.style.fontSize = "200%";
    }

    //the correct/wrong disappears after 1000 ms
    setTimeout(function() {
        showAnswer.textContent = "";
    }, 1000);

    currentQuestionNum++;

    //if statement to check how many questions has been answered -
    //continue rendering questions or end the quiz
    if(currentQuestionNum === questions.length) {
        endQuiz();
    } else {
        renderQuestions();
    }

}

//page shown when quiz ends
function endQuiz() {
    questionHeading.textContent = 'Game Over!'
    multipleChoice.textContent = 'Your final score is ' + timeLeft;
    clearInterval(timeInterval);
    timerEl.textContent = "Time: 0 seconds";
    inputInitials();
}

//append form to input initials for local storage
function inputInitials() {
    var initialsForm = document.createElement("form");
    multipleChoice.appendChild(initialsForm);
    initialsForm.setAttribute("id", "form");

    var label = document.createElement("label");
    initialsForm.appendChild(label);
    label.textContent = "Input initials here: ";

    var input = document.createElement("input")
    initialsForm.appendChild(input);
    input.setAttribute("id", "userInitials");
    input.setAttribute("maxlength", "3");

    var submitInitial = document.createElement("button");
    initialsForm.appendChild(submitInitial);
    submitInitial.setAttribute("id", "submit");
    submitInitial.textContent = "Submit";

    input.addEventListener("keydown", stopDefault);
    submitInitial.addEventListener("click", addScore);
}

//prevent enter key of triggering a default effect
function stopDefault(event) {
    if (event.key === "Enter") {
    event.preventDefault();
    }
}

//check if input is filled, if not message shows, if filled remove the form
function addScore(event) {
    if (event !== undefined) {
        event.preventDefault();
    }
    var initials = document.getElementById("userInitials");
    if (initials.value.length === 0) {
        showAnswer.textContent = "Please enter initials before proceeding";
        setTimeout(function() {
            showAnswer.textContent = "";
        }, 1000);
        return;
    }

    quizStat = false;
    document.getElementById("form").remove();
    saveHighscore(initials);
}

//save high score into local storage
function saveHighscore(initials) {
    if (localStorage.getItem("highScore") !== null) {
        highScore = JSON.parse(window.localStorage.getItem("highScore"));
    }
        var newScore = (
            timeLeft + " " +
            initials.value
        );

        highScore.push(newScore);
        window.localStorage.setItem("highScore", JSON.stringify(highScore));
    
        showScores();
}

//show the high scores page (from high score button and after selecting the submit button above)
function showScores() {
    if (!quizStat) {
        questionHeading.textContent = "High Scores";
        startQuizBtn.setAttribute("style", "display: none");
        storedScores();
        scoresheetBtns();
    } else if (questionHeading === "Game Over!") {
        showAnswer.textContent = "Please enter your initials before proceeding";
    } else {
        showAnswer.textContent = "Please finish the quiz first";
    }
    setTimeout(function() {
        showAnswer.textContent = "";
    }, 1000);
}

//show the high scores from local storage
function storedScores() {
    multipleChoice.textContent ="";
    multipleChoice.setAttribute("style", "white-space: pre-wrap");
    if (localStorage.getItem("highScore") !== null) {
        highScore = JSON.parse(localStorage.getItem("highScore"));
    }
    highScore.sort();
    highScore.reverse();
    var limit = 10;
    if(limit > highScore.length) {
        limit = highScore.length;
    }
    for (var i = 0; i < limit; i++) {
        multipleChoice.textContent += highScore[i] + '\n';
    }

}

//append buttons for restarting the quiz or clearing the local storage
function scoresheetBtns() {
    if(!document.getElementById("restart")) {
        var restartEl = document.createElement("button");
        quizContainer.appendChild(restartEl);
        restartEl.textContent = "Restart Quiz";
        restartEl.setAttribute("id", "restart");

        var clearEl = document.createElement("button");
        quizContainer.appendChild(clearEl);
        clearEl.textContent = "Clear All High Scores";
        clearEl.setAttribute("id", "clear");

        restartEl.addEventListener("click", restartGame);
        clearEl.addEventListener("click", clearScores);
    }
}

//re input the opening page as it was and reset variables 
function restartGame () {
    document.getElementById("restart").remove();
    document.getElementById("clear").remove();
    questionHeading.textContent = "Javascript Quiz?";
    multipleChoice.textContent = "Wanna take a quick quiz? Once you press the START button you will have 75 seconds to answer 5 quick questions. Fair warning, wrong answers will deduct 15 seconds from the timer. GOOD LUCK!"
    currentQuestionNum = 0;
    timeLeft = 75;
    startQuizBtn.setAttribute("style", "display: visible")
}

//clear local storage when clear button is selected from above
function clearScores() {
    localStorage.clear();
    multipleChoice.textContent = "";
    highScore = [];
}
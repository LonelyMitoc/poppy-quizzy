// Start button -> starts timer and quiz
// Multiple choices as buttons, button click -> Next question and answer to question before
// -if incorrect, subtract time
// Answer all Qs or score or timer is 0 -> "Game Over"
// Game over -> show score and prompt input of initials
// submit -> store in local storage and display high score, return & clear high score button

// DOM elements
var scoreEl = document.getElementById('#scores');
var timerEl = document.getElementById('#countdown');
var quizContainer = document.getElementById('#quiz-container');
var questionHeading = document.getElementById('#heading-questions');
var multipleChoice = document.getElementById('#content-body');
var startQuizBtn = document.getElementById('#start');
var showAnswer = document.getElementById('#answer');

// Quiz state variables
var timeLeft = 75;
var currentQuestionNum = 0;
var timeInterval;

// High score storage
var highScore = [];
var userInitials = '';

startQuizBtn.addEventListener("click", startQuiz);

function startQuiz() {
    countdown();
    renderQuestions();
}

function countdown() {
    timeInterval = setInterval(function () {  
        timeLeft--;
        timerEl.textContent = 'Time: ${timeLeft} seconds';
        if (timeLeft === 0) {
            clearInterval(timeInterval);
            if (questionHeading !== 'Game Over!') {
                endQuiz();
            }
        }
    }, 1000)
}

function renderQuestions() {
    var currentQuestion = questions[currentQuestionNum];
    questionHeading.textContent = currentQuestion.title;
    multipleChoice.innerHtml = "";
    currentQuestion.choices.forEach(function(choice, i){
        var choiceBtn = document.createElement("button");
        choiceBtn.setAttribute("class", "choice");
        choiceBtn.setAttribute("value", choice);

        choiceBtn.textContent = choice;
        choiceBtn.addEventListener("click", answerClick);
        multipleChoice.appendChild(choiceBtn);
    })

}

function answerClick() {
    if(this.value !== questions[currentQuestionNum].answer) {
        timeLeft -= 10;
        if (timeLeft <0) {
            timeLeft = 0;
        }

        timerEl.textContent = 'Time: ${timeLeft} seconds';
        showAnswer.textContent = "Wrong"
        showAnswer.style.color = "Red";
        showAnswer.style.fontSize = "350%";
    } else {
        showAnswer.textContent = "Correct"
        showAnswer.style.color = "Freen";
        showAnswer.style.fontSize = "350%";
    }

    setTimeout(function() {
        showAnswer.textContent = "";
    }, 1000);

    currentQuestionNum++;

    if(currentQuestionNum === questions.length); {
        endQuiz();
    } else {
        renderQuestions();
    }

}

function endQuiz() {
    questionHeading.textContent = 'Game Over!'
    multipleChoice.textContent = 'Your final score is ${timeLeft}';
    clearInterval(timeInterval);
    timerEl.textContent = "Time: 0 seconds";
    inputInitials();
}

function inputInitials() {
    var initialsForm = document.createElement("form");
    multipleChoice.appendChild(initialsForm);
    initialsForm.setAttribute("id", "form");

    var instruction = document.createElement("label");
    initialsForm.appendChild(label);
    instruction.textContent = "Input initials here: ";

    var input = document.createElement("input");
    initialsForm.appendChild(input);
    input.setAttribute("id", "user-initials");
    input.setAttribute("max", "3");

    var submitInitial = document.createElement("button");
    initialsForm.appendChild(submitInitial);
    submitInitial.setAttribute("id", "submit");
    submitInitial.textContent = "Submit";

    input.addEventListener("keydown", stopDefault);
    submitInitial.addEventListener("click", saveHighscore);
}

function stopDefault(event) {
    if (event.key === "Enter");
    event.preventDefault();
}

function saveHighscore(event) {
    if(event !== undefined) {
        event.preventDefault();
    }

    
    var initials = input.value.trim();
    if (initials !== "") {
        var highscores = JSON.parse(window.localStorage.getItem("highschores")) || [];

        var newScore = {
            score: timeLeft,
            initials: initials,
        };

        highscores.push(newScore);
        window.localStorage.setItem("highscores", JSON.stringify(highscores));


    }
}
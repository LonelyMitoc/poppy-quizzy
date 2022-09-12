// Start button -> starts timer and quiz
// Multiple choices as buttons, button click -> Next question and answer to question before
// -if incorrect, subtract time
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

startQuizBtn.addEventListener("click", startQuiz);
scoreEl.addEventListener("click", showScores);

function startQuiz() {
    countdown();
    renderQuestions();
}

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

function renderQuestions() {
    quizStat = true;
    startQuizBtn.setAttribute("style", "display: none");
    multipleChoice.textContent = '';
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
        timeLeft -= 15;
        if (timeLeft <0) {
            timeLeft = 0;
        }

        timerEl.textContent = 'Time: ' + timeLeft + ' seconds';
        showAnswer.textContent = "Wrong"
        showAnswer.style.color = "Red";
        showAnswer.style.fontSize = "200%";
    } else {
        showAnswer.textContent = "Correct"
        showAnswer.style.color = "Green";
        showAnswer.style.fontSize = "200%";
    }

    setTimeout(function() {
        showAnswer.textContent = "";
    }, 1000);

    currentQuestionNum++;

    if(currentQuestionNum === questions.length) {
        endQuiz();
    } else {
        renderQuestions();
    }

}

function endQuiz() {
    questionHeading.textContent = 'Game Over!'
    multipleChoice.textContent = 'Your final score is ' + timeLeft;
    clearInterval(timeInterval);
    timerEl.textContent = "Time: 0 seconds";
    inputInitials();
}

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

function stopDefault(event) {
    if (event.key === "Enter") {
    event.preventDefault();
    }
}

function addScore(event) {
    if (event !== undefined) {
        event.preventDefault();
    }
    var id = document.getElementById("userInitials");

    quizStat = false;
    document.getElementById("form").remove();
    saveHighscore(id);
}

function saveHighscore(id) {
    if (localStorage.getItem("highScore") !== null) {
        highScore = JSON.parse(window.localStorage.getItem("highScore"));

        var newScore = {
            score: timeLeft,
            initials: id,
        };

        highScore.push(newScore);
        window.localStorage.setItem("highScore", JSON.stringify(highScore));
    }

    // var initials = document.getElementById("userInitials");
    // if (initials !== "") {
    //     var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];

    //     var newScore = {
    //         score: timeLeft,
    //         initials: initials,
    //     };

    //     highscores.push(newScore);
    //     window.localStorage.setItem("highscores", JSON.stringify(highscores));

    //     document.getElementById("form").remove();

    //     quizStat = false;
        showScores();
}

function showScores() {
    if (!quizStat) {
        questionHeading.textContent = "High Scores";
        startQuizBtn.setAttribute("style", "display: none");
        storedScores();
        scoresheetBtns();
    } else if (questionHeading === "Game Over!") {
        showAnswer.textContent = "Please enter your initials";
    } else {
        showAnswer.textContent = "Please finish the quiz first";

    }
}

function storedScores() {
    multipleChoice.textContent ="";
    if (localStorage.getItem("highScore") !== null) {
        highscores = JSON.parse(localStorage.getItem("highScore"));
    }
    highScore.sort();
    highScore.reverse();
    var limit = 10;
    if(limit > highScore.legnth) {
        limit = highScore.length;
    }
    for (var i = 0; i <limit; i++) {
        multipleChoice.textContent += highScore[i] + '\n';
    }

}

function scoresheetBtns() {
    if(!document.getElementById("restart")) {
        var restartEl = document.createElement("button");
        multipleChoice.appendChild(restartEl);
        restartEl.textContent = "Restart Quiz";
        restartEl.setAttribute("id", "restart");

        var clearEl = document.createElement("button");
        multipleChoice.appendChild(clearEl);
        clearEl.textContent = "Clear All High Scores";
        clearEl.setAttribute("id", "clear");

        restartEl.addEventListener("click", restartGame);
        clearEl.addEventListener("click", clearScores);
    }
}

function restartGame () {
    document.getElementById("restart").remove();
    document.getElementById("clear").remove();
    questionHeading.textContent = "Javascript Quiz?";
    multipleChoice.textContent = "Wanna take a quick quiz? Once you press the START button you will have 75 seconds to answer 5 quick questions. Fair warning, wrong answers will deduct 15 seconds from the timer. GOOD LUCK!"
    currentQuestionNum = 0;
    timeLeft = 75;
}

function clearScores() {
    localStorage.clear();
    multipleChoice.textContent = "";
    highScore = [];
}
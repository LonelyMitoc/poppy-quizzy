// Start button -> starts timer and quiz
// Multiple choices as buttons

var scoreEl = document.getElementById('#scores');
var timerEl = document.getElementById('#countdown');
var quizContainer = document.getElementById('#quiz-container');
var questionHeading = document.getElementById('#heading-questions');
var multipleChoice = document.getElementById('#content-body');
var startQuiz = document.getElementById('#start');
var showAnswer = document.getElementById('#answer');


function countdown() {
    var timeLeft = 75;

    var timeInterval = setInterval(function () {
        if (timeLeft > 1) {
            timerEl.textContent = timeLeft;   
            timeLeft--;         
        } else {

        }
    })
}
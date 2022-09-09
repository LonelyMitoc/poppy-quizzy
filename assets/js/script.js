// Start button -> starts timer and quiz
// Multiple choices as buttons

var scoreEl = document.getElementById('#scores');
var timerEl = document.getElementById('#countdown');
var quizContainer = document.getElementById('#quiz-container');
var questionHeading = document.getElementById('#heading-questions');
var multipleChoice = document.getElementById('#content-body');
var startQuiz = document.getElementById('#start');
var showAnswer = document.getElementById('#answer');

var timeLeft = 75;
var highScore = [];
var userInitials = '';


function countdown() {
    var timeInterval = setInterval(function () {  
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
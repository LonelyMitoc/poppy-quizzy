// Start button -> starts timer and quiz
// Multiple choices as buttons, button click -> Next question and answer to question before
// -if incorrect, subtract time
// Answer all Qs or timer is 0 -> "Game Over"
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
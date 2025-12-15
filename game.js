const question = document.getElementById("question")
const choices = Array.from(document.getElementsByClassName("choice-text"))

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 1;
let avaliableQuestions = [];
const progressText = document.getElementById('progressText')
const scoreText = document.getElementById('score')
const progressBarFull = document.getElementById('progress-Bar-Full')

let questions = []

fetch("questions.json").then(res => {
    return res.json();
}).then(loadedQuestions => {
    questions = loadedQuestions
    startGame()
})
.catch( err => {
    console.error(err)
})

//constants

const CORRECT_BONUS = 1
const MAX_QUESTIONS  = 3

startGame = () => {
    questionCounter = 0;
    score = 0;
    avaliableQuestions = [...questions]
    getNewQuestion()

};

getNewQuestion = () => {

    if(avaliableQuestions == 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score)
        return window.location.assign('/end.html')
    }

    questionCounter++;
    progressText.innerText = "Question " + questionCounter + "/" + MAX_QUESTIONS;

    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * avaliableQuestions.length);
    currentQuestion = avaliableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach (choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];

    })

    avaliableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;


}

choices.forEach(choices => {
    choices.addEventListener('click', e => {
        if(!acceptingAnswers) return;

        acceptingAnswers =  false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        console.log(classToApply);

        if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }


        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion()
        }, 1000);


        

    })
})

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};




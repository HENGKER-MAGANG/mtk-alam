const query = new URLSearchParams(window.location.search);
const level = query.get("level") || "easy";

const levelName = {
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sulit"
};

document.getElementById("levelName") &&
  (document.getElementById("levelName").textContent = levelName[level]);

const questions = {
  easy: [
    { question: "5 + 3 = ?", answers: [6, 8, 9, 10], correct: 1 },
    { question: "2 × 4 = ?", answers: [6, 7, 8, 9], correct: 2 },
    { question: "9 - 4 = ?", answers: [4, 5, 6, 3], correct: 1 }
  ],
  medium: [
    { question: "12 ÷ 4 = ?", answers: [2, 3, 4, 5], correct: 1 },
    { question: "7 × 6 = ?", answers: [42, 36, 48, 40], correct: 0 },
    { question: "15 + 17 = ?", answers: [31, 32, 33, 34], correct: 2 }
  ],
  hard: [
    { question: "√49 = ?", answers: [5, 6, 7, 8], correct: 2 },
    { question: "25 × 4 = ?", answers: [100, 90, 110, 120], correct: 0 },
    { question: "81 ÷ 9 = ?", answers: [8, 9, 7, 6], correct: 1 }
  ]
};

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;
const totalQuestions = questions[level].length;

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const answerButtons = document.getElementById("answerButtons");
const nextBtn = document.getElementById("nextBtn");
const currentScoreEl = document.getElementById("currentScore");
const progressBar = document.getElementById("progressBar");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const tickSound = document.getElementById("tickSound");

const timerDisplay = document.getElementById("timer");

function startQuiz() {
  showQuestion();
  startTimer();
}

function showQuestion() {
  resetState();

  const question = questions[level][currentQuestion];
  questionNumber.textContent = currentQuestion + 1;
  questionText.textContent = question.question;

  question.answers.forEach((ans, index) => {
    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-outline-success", "py-2", "text-lg");
    btn.textContent = ans;
    btn.onclick = () => selectAnswer(index, question.correct);
    answerButtons.appendChild(btn);
  });

  updateProgress();
}

function resetState() {
  answerButtons.innerHTML = "";
  nextBtn.classList.add("d-none");
  clearInterval(timer);
  timeLeft = 30;
  timerDisplay.textContent = timeLeft;
  startTimer();
}

function selectAnswer(selected, correctIndex) {
  const buttons = answerButtons.querySelectorAll("button");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correctIndex) {
      btn.classList.remove("btn-outline-success");
      btn.classList.add("btn-success");
    }
    if (idx === selected && idx !== correctIndex) {
      btn.classList.remove("btn-outline-success");
      btn.classList.add("btn-danger");
    }
  });

  if (selected === correctIndex) {
    score++;
    currentScoreEl.textContent = score;
    correctSound.play();
  } else {
    wrongSound.play();
  }

  nextBtn.classList.remove("d-none");
  clearInterval(timer);
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < totalQuestions) {
    showQuestion();
  } else {
    finishQuiz();
  }
}

function updateProgress() {
  const progress = ((currentQuestion) / totalQuestions) * 100;
  progressBar.style.width = `${progress}%`;
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    tickSound.play();
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoNext();
    }
  }, 1000);
}

function autoNext() {
  const question = questions[level][currentQuestion];
  selectAnswer(-1, question.correct); // Salah otomatis
}

function finishQuiz() {
  localStorage.setItem("score", score);
  localStorage.setItem("total", totalQuestions);
  window.location.href = "result.html";
}

window.onload = startQuiz;

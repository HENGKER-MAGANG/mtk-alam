const query = new URLSearchParams(window.location.search);
const level = query.get("level") || "easy";
const levelName = {
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sulit"
};

document.getElementById("levelName") && (document.getElementById("levelName").textContent = levelName[level]);

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
    { question: "25 × 4 = ?", answers: [100, 75, 90, 80], correct: 0 },
    { question: "81 ÷ 9 = ?", answers: [7, 8, 9, 10], correct: 2 }
  ]
}[level];

let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const answerButtons = document.getElementById("answerButtons");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const tickSound = document.getElementById("tickSound");

function startTimer() {
  const timerEl = document.getElementById("timer");
  timeLeft = 30;
  timerEl.textContent = timeLeft;
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    tickSound?.play();
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      selectAnswer(-1, questions[currentQuestion].correct);
    }
  }, 1000);
}

function updateProgress() {
  const percent = ((currentQuestion + 1) / questions.length) * 100;
  progressBar.style.width = percent + "%";
}

function showQuestion() {
  clearInterval(timerInterval);
  startTimer();
  const q = questions[currentQuestion];
  questionNumber.textContent = currentQuestion + 1;
  questionText.textContent = q.question;
  answerButtons.innerHTML = "";
  nextBtn.classList.add("d-none");

  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.className = "btn btn-outline-success py-2";
    btn.onclick = () => selectAnswer(i, q.correct);
    answerButtons.appendChild(btn);
  });

  updateProgress();
}

function selectAnswer(selected, correct) {
  clearInterval(timerInterval);
  const buttons = answerButtons.querySelectorAll("button");
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    btn.classList.remove("btn-outline-success");
    btn.classList.add(i === correct ? "btn-success" : i === selected ? "btn-danger" : "btn-secondary");
  });

  if (selected === correct) {
    score++;
    correctSound?.play();
  } else {
    wrongSound?.play();
  }

  document.getElementById("currentScore").textContent = score;
  nextBtn.classList.remove("d-none");
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    localStorage.setItem("score", score);
    localStorage.setItem("total", questions.length);
    window.location.href = "result.html";
  }
}

window.onload = showQuestion;

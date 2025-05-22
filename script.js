let questions = [];
let currentIndex = 0;
let score = 0;

const quizContainer = document.getElementById('quiz-container');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const resultEl = document.getElementById('result');

function typeText(element, text, callback) {
  let i = 0;
  element.textContent = '';
  const timer = setInterval(() => {
    element.textContent += text.charAt(i++);
    if (i > text.length) {
      clearInterval(timer);
      if (callback) callback();
    }
  }, 20);
}

function loadQuestions(data) {
  questions = data.slice(0, 20);
  showQuestion();
}

function showQuestion() {
  nextBtn.classList.add('hidden');
  optionsEl.innerHTML = '';
  const q = questions[currentIndex];
  typeText(questionEl, `${currentIndex + 1}. ${q.Question}`, () => {
    ['Option1', 'Option2', 'Option3', 'Option4'].forEach((optKey, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = q[optKey].replace(/^[A-D]\\.\s*/, '');
      btn.addEventListener('click', () => selectOption(btn, idx + 1, q.Answer));
      optionsEl.appendChild(btn);
    });
  });
}

function selectOption(button, choice, correct) {
  const allButtons = optionsEl.querySelectorAll('.option-btn');
  allButtons.forEach((btn, index) => {
    btn.disabled = true;
    if (index + 1 === correct) btn.classList.add('correct');
  });

  if (choice === correct) {
    score++;
    button.classList.add('correct');
  } else {
    button.classList.add('wrong');
  }

  nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizContainer.innerHTML = `<h2>Bạn đã trả lời đúng ${score} / ${questions.length} câu</h2>`;
}

fetch('quiz_data.json')
  .then(res => res.json())
  .then(data => loadQuestions(data));

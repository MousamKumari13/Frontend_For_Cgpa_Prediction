const cycle = document.querySelector('.cycle');
const leafContainer = document.getElementById('leaf-container');

// Falling Leaf Animation
function createFallingLeaf() {
  const leaf = document.createElement('img');
  leaf.src = 'transparent_leaf.png';
  leaf.classList.add('leaf');
  leafContainer.appendChild(leaf);

  const startX = Math.random() * window.innerWidth;
  leaf.style.left = `${startX}px`;

  const fallDuration = Math.random() * 3 + 3;
  leaf.style.animation = `fall ${fallDuration}s linear, drift ${fallDuration}s linear`;

  setTimeout(() => {
    leaf.remove();
  }, fallDuration * 2000);
}

function generateLeaves() {
  setInterval(createFallingLeaf, 1000);
}
generateLeaves();

// Form Handling
const form = document.getElementById('inputForm');
const inputArea = document.getElementById('inputArea');
const questionLabel = document.getElementById('questionLabel');
const stepNum = document.getElementById('stepNum');
const prevBtn = document.getElementById('prevBtn');

const resultContainer = document.getElementById('resultContainer');
const cgpaDisplay = document.getElementById('cgpaDisplay');
const emojiDisplay = document.getElementById('emojiDisplay');
const homeBtn = document.getElementById('homeBtn');

let currentStep = 0;
let formData = {};

const questions = [
  { label: "Enter your Previous Semester  CGPA:", type: "number", name: "Sem1" },
  { label: "How many average hours do you study per day for semester Exam(in hours)?", type: "number", name: "Study_Hr" },
  { label: "How many hours do you sleep per day during semester Exam(in hours) ?", type: "number", name: "Sleep_Hr" },
  { label: "Do you have any active backlogs?", type: "select", name: "Active_backlog", options: ["Yes", "No"] },
  { label: "How much time do you spend on extra curriculum activities per day during semester Exam (in hours)?", type: "number", name: "ExtraCurriculum" },
  { label: "What is your daily screen time on Social media(in hours)?", type: "number", name: "Screen_time" },
  { label: "How would you rate your Health?", type: "select", name: "Health", options: ["Low", "Medium", "High"] },
  { label: "What is your stress level?", type: "select", name: "stress_level", options: ["Low", "Medium", "High"] },
  { label: "What is your motivation level?", type: "select", name: "Motivation", options: ["Low", "Medium", "High"] },
];

function loadQuestion() {
  const current = questions[currentStep];
  questionLabel.textContent = current.label;
  stepNum.textContent = currentStep + 1;

  if (current.type === "number") {
    inputArea.innerHTML = `<input type="number" id="inputField" min="0" step="0.01" required />`;
  } else if (current.type === "select") {
    inputArea.innerHTML = `
      <select id="inputField" required>
        ${current.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
      </select>
    `;
  }

  prevBtn.classList.toggle('hidden', currentStep === 0);
  homeBtn.classList.add('hidden');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('inputField');
  formData[questions[currentStep].name] = input.value;

  if (currentStep < questions.length - 1) {
    currentStep++;
    loadQuestion();
  } else {
    form.classList.add('hidden');

    fetch('https://student-score-predictor-ml-project.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.prediction) {
        const prediction = parseFloat(data.prediction);
        let emoji = "😔";
        let message = "Don't worry, stay consistent and improve!";

        if (prediction > 8) {
          emoji = "🎉😁";
          message = "Amazing! You're doing great!";
        } else if (prediction >= 7) {
          emoji = "🙂";
          message = "Good! Keep pushing a bit more.";
        }

        resultContainer.classList.remove('hidden');
        emojiDisplay.innerHTML = `<div style="font-size: 5rem; margin-bottom: 10px;">${emoji}</div>`;
        cgpaDisplay.textContent = `Your predicted CGPA: ${prediction.toFixed(2)} — ${message}`;
        prevBtn.classList.add('hidden');
        homeBtn.classList.remove('hidden');
      } else {
        alert('Prediction not found or incorrect response from backend.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Something went wrong!');
    });
  }
});

prevBtn.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    loadQuestion();
  }
});

homeBtn.addEventListener('click', () => {
  formData = {};
  currentStep = 0;
  loadQuestion();
  form.classList.remove('hidden');
  resultContainer.classList.add('hidden');
});

// Footer navigation function
function navigateFooter() {
  const select = document.getElementById("footerSelect");
  const selectedPage = select.value;
  if (selectedPage) {
    window.location.href = selectedPage;
  }
}

loadQuestion();

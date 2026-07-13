const toggle = document.querySelector('.theme-toggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('studyflow-theme');
if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
  toggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  root.setAttribute('data-theme', 'dark');
  toggle.textContent = '☀️';
}

toggle?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', current);
  localStorage.setItem('studyflow-theme', current);
  toggle.textContent = current === 'dark' ? '☀️' : '🌙';
});

const plannerForm = document.querySelector('#planner-form');
const taskList = document.querySelector('#task-list');
plannerForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const taskInput = document.querySelector('#task-input');
  const taskText = taskInput.value.trim();
  if (!taskText) return;
  const li = document.createElement('li');
  li.textContent = taskText;
  taskList.prepend(li);
  taskInput.value = '';
});

const quizForm = document.querySelector('#quiz-form');
const quizOutput = document.querySelector('#quiz-output');
quizForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const topic = document.querySelector('#quiz-topic').value || 'general study';
  const difficulty = document.querySelector('#difficulty').value || 'medium';
  const questions = [
    `What is the main idea of ${topic}?`,
    `How would you explain ${topic} in one sentence?`,
    `Which study habit helps most when learning ${topic} at ${difficulty} difficulty?`
  ];
  quizOutput.innerHTML = `
    <h3>Generated quiz for ${topic}</h3>
    <ol>
      ${questions.map((q) => `<li>${q}</li>`).join('')}
    </ol>
  `;
});

const defaultGoals = [
  { text: 'Review biology notes', done: true },
  { text: 'Practice algebra chapter', done: false },
  { text: 'Prepare for chemistry quiz', done: false }
];
let goals = [...defaultGoals];

const goalForm = document.querySelector('#goal-form');
const goalInput = document.querySelector('#goal-input');
const goalList = document.querySelector('#goal-list');
const progressFill = document.querySelector('#progress-fill');
const progressLabel = document.querySelector('#progress-label');
const streakValue = document.querySelector('#streak-value');
const focusValue = document.querySelector('#focus-value');
const quizValue = document.querySelector('#quiz-value');
const goalsLeftValue = document.querySelector('#goals-left-value');

function renderDashboard() {
  if (!goalList) return;
  goalList.innerHTML = '';
  goals.forEach((goal, index) => {
    const li = document.createElement('li');
    li.className = `goal-item ${goal.done ? 'done' : ''}`;
    const span = document.createElement('span');
    span.textContent = goal.text;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = goal.done ? '↺' : '✓';
    button.addEventListener('click', () => {
      goals[index].done = !goals[index].done;
      renderDashboard();
    });
    li.append(span, button);
    goalList.appendChild(li);
  });

  const completed = goals.filter((goal) => goal.done).length;
  const total = goals.length;
  const percent = Math.round((completed / total) * 100);
  if (progressFill) progressFill.style.width = `${percent}%`;
  if (progressLabel) progressLabel.textContent = `${percent}% of your weekly target completed.`;
  if (streakValue) streakValue.textContent = `${Math.max(3, 5 + completed)} days`;
  if (focusValue) focusValue.textContent = `${Math.max(70, 74 + completed)}%`;
  if (quizValue) quizValue.textContent = `${Math.min(24, 18 + completed)}`;
  if (goalsLeftValue) goalsLeftValue.textContent = `${total - completed}`;
}

goalForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = goalInput.value.trim();
  if (!text) return;
  goals.push({ text, done: false });
  goalInput.value = '';
  renderDashboard();
});

renderDashboard();

const chatWindow = document.querySelector('#chat-window');
const assistantForm = document.querySelector('#assistant-form');
const assistantInput = document.querySelector('#assistant-input');
const promptChips = document.querySelectorAll('.prompt-chip');

function addMessage(text, role = 'assistant') {
  const message = document.createElement('div');
  message.className = `message ${role === 'user' ? 'user-msg' : 'assistant-msg'}`;
  const strong = document.createElement('strong');
  strong.textContent = role === 'user' ? 'You' : 'PragyanAI';
  const p = document.createElement('p');
  p.textContent = text;
  message.append(strong, p);
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function generateReply(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes('flashcard')) {
    return 'Absolutely. I would create a compact set of flashcards with the term on one side and a one-sentence explanation on the other.';
  }
  if (lower.includes('quiz')) {
    return 'I can create a short quiz with multiple-choice and short-answer questions tailored to your topic and difficulty.';
  }
  if (lower.includes('summary')) {
    return 'A strong summary focuses on the main idea, supporting points, and one takeaway you can remember easily.';
  }
  if (lower.includes('explain')) {
    return 'I would explain it in simple language, then add a quick example and a study tip so it sticks.';
  }
  return `That sounds like a great study goal. I would break it into small steps, suggest a revision plan, and turn it into a clear checklist for you.`;
}

assistantForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const prompt = assistantInput.value.trim();
  if (!prompt) return;
  addMessage(prompt, 'user');
  assistantInput.value = '';
  window.setTimeout(() => {
    addMessage(generateReply(prompt), 'assistant');
  }, 500);
});

promptChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    assistantInput.value = chip.dataset.prompt;
    assistantInput.focus();
  });
});

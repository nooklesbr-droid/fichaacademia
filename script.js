const STORAGE_KEY = "treinoABC:status:v1";

const workouts = {
  A: [
    {
      section: "PERNA",
      name: "Agachamento livre ou Smith",
      label: "4x6–8",
      sets: 4
    },
    {
      section: "PERNA",
      name: "Leg Press 45°",
      label: "3x10–12",
      sets: 3
    },
    {
      section: "PERNA",
      name: "Stiff",
      label: "3x8–10",
      sets: 3
    },
    {
      section: "PERNA",
      name: "Cadeira extensora",
      label: "3x12–15",
      sets: 3
    },
    {
      section: "PERNA",
      name: "Mesa flexora ou cadeira flexora",
      label: "3x10–12",
      sets: 3
    },
    {
      section: "OMBRO",
      name: "Desenvolvimento de ombro",
      label: "3x8–10",
      sets: 3
    },
    {
      section: "OMBRO",
      name: "Elevação lateral",
      label: "4x12–20",
      sets: 4
    },
    {
      section: "ABDÔMEN",
      name: "Cable crunch (polia)",
      label: "3x12–15",
      sets: 3
    },
    {
      section: "ABDÔMEN",
      name: "Prancha",
      label: "2x30–60s",
      sets: 2
    }
  ],

  B: [
    {
      section: "PEITO",
      name: "Supino declinado (barra ou máquina)",
      label: "4x6–10",
      sets: 4
    },
    {
      section: "PEITO",
      name: "Supino reto",
      label: "3x6–8",
      sets: 3
    },
    {
      section: "PEITO",
      name: "Supino inclinado",
      label: "3x8–10",
      sets: 3
    },
    {
      section: "PEITO",
      name: "Peck deck",
      label: "3x12–15",
      sets: 3
    },
    {
      section: "OMBRO",
      name: "Desenvolvimento de ombro",
      label: "3x8–10",
      sets: 3
    },
    {
      section: "OMBRO",
      name: "Elevação lateral",
      label: "4x12–20",
      sets: 4
    },
    {
      section: "TRÍCEPS",
      name: "Tríceps testa",
      label: "3x6–10",
      sets: 3
    },
    {
      section: "TRÍCEPS",
      name: "Tríceps francês (acima da cabeça)",
      label: "3x10–12",
      sets: 3
    },
    {
      section: "TRÍCEPS",
      name: "Tríceps corda",
      label: "2–3x12–15",
      sets: 3
    },
    {
      section: "PANTURRILHA",
      name: "Panturrilha em pé ou leg press",
      label: "4x10–15",
      sets: 4
    },
    {
      section: "ABDÔMEN",
      name: "Abdominal na polia (cable crunch)",
      label: "2–3x12–15",
      sets: 3
    }
  ],

  C: [
    {
      section: "COSTAS",
      name: "Puxada alta (barra fixa ou pulley)",
      label: "4x6–10",
      sets: 4
    },
    {
      section: "COSTAS",
      name: "Remada apoiada (máquina ou banco)",
      label: "3x8–10",
      sets: 3
    },
    {
      section: "COSTAS",
      name: "Remada baixa na polia",
      label: "3x8–12",
      sets: 3
    },
    {
      section: "COSTAS",
      name: "Pulldown braço reto",
      label: "3x12–15",
      sets: 3
    },
    {
      section: "POSTERIOR DE OMBRO / ESTABILIDADE",
      name: "Face pull",
      label: "3x12–20",
      sets: 3
    },
    {
      section: "BÍCEPS",
      name: "Rosca direta (barra W)",
      label: "3x6–10",
      sets: 3
    },
    {
      section: "BÍCEPS",
      name: "Rosca martelo OU alternada inclinada",
      label: "3x10–12",
      sets: 3
    }
  ]
};

let currentWorkout = "A";
let timerSeconds = 180;
let timerInterval = null;
let timerPaused = false;

const workoutContainer = document.getElementById("workoutContainer");
const workoutTitle = document.getElementById("workoutTitle");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const timerDisplay = document.getElementById("timerDisplay");
const pauseTimerBtn = document.getElementById("pauseTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");
const resetCurrentBtn = document.getElementById("resetCurrentBtn");
const resetAllBtn = document.getElementById("resetAllBtn");
const tabs = document.querySelectorAll(".tab");

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getSetKey(workout, exerciseIndex, setNumber) {
  return `${workout}-${exerciseIndex}-${setNumber}`;
}

function isSetDone(workout, exerciseIndex, setNumber) {
  const state = loadState();
  return state[getSetKey(workout, exerciseIndex, setNumber)] === true;
}

function toggleSet(workout, exerciseIndex, setNumber) {
  const state = loadState();
  const key = getSetKey(workout, exerciseIndex, setNumber);

  const wasDone = state[key] === true;

  if (wasDone) {
    delete state[key];
  } else {
    state[key] = true;
    startTimer();
  }

  saveState(state);
  renderWorkout();
}

function renderWorkout() {
  workoutContainer.innerHTML = "";
  workoutTitle.textContent = `Treino ${currentWorkout}`;

  let lastSection = "";

  workouts[currentWorkout].forEach((exercise, exerciseIndex) => {
    if (exercise.section !== lastSection) {
      const sectionTitle = document.createElement("h2");
      sectionTitle.className = "section-title";
      sectionTitle.textContent = exercise.section;
      workoutContainer.appendChild(sectionTitle);
      lastSection = exercise.section;
    }

    const card = document.createElement("article");
    card.className = "exercise-card";

    const doneCount = countExerciseDone(currentWorkout, exerciseIndex, exercise.sets);

    const top = document.createElement("div");
    top.className = "exercise-top";

    const titleBlock = document.createElement("div");

    const name = document.createElement("h3");
    name.className = "exercise-name";
    name.textContent = exercise.name;

    const meta = document.createElement("span");
    meta.className = "exercise-meta";
    meta.textContent = exercise.label;

    titleBlock.appendChild(name);
    titleBlock.appendChild(meta);

    const count = document.createElement("span");
    count.className = "exercise-count";
    count.textContent = `${doneCount}/${exercise.sets}`;

    top.appendChild(titleBlock);
    top.appendChild(count);

    const sets = document.createElement("div");
    sets.className = "sets";

    for (let setNumber = 1; setNumber <= exercise.sets; setNumber++) {
      const btn = document.createElement("button");
      btn.className = "set-btn";
      btn.type = "button";
      btn.textContent = setNumber;
      btn.setAttribute("aria-label", `${exercise.name}, série ${setNumber}`);

      if (isSetDone(currentWorkout, exerciseIndex, setNumber)) {
        btn.classList.add("done");
      }

      btn.addEventListener("click", () => {
        toggleSet(currentWorkout, exerciseIndex, setNumber);
      });

      sets.appendChild(btn);
    }

    card.appendChild(top);
    card.appendChild(sets);

    workoutContainer.appendChild(card);
  });

  updateProgress();
}

function countExerciseDone(workout, exerciseIndex, totalSets) {
  let count = 0;

  for (let setNumber = 1; setNumber <= totalSets; setNumber++) {
    if (isSetDone(workout, exerciseIndex, setNumber)) {
      count++;
    }
  }

  return count;
}

function updateProgress() {
  const exercises = workouts[currentWorkout];

  let total = 0;
  let done = 0;

  exercises.forEach((exercise, exerciseIndex) => {
    total += exercise.sets;

    for (let setNumber = 1; setNumber <= exercise.sets; setNumber++) {
      if (isSetDone(currentWorkout, exerciseIndex, setNumber)) {
        done++;
      }
    }
  });

  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

  progressText.textContent = `${percentage}%`;
  progressFill.style.width = `${percentage}%`;
}

function startTimer() {
  clearInterval(timerInterval);

  timerSeconds = 180;
  timerPaused = false;

  pauseTimerBtn.textContent = "Pausar";
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    if (timerPaused) return;

    timerSeconds--;

    if (timerSeconds <= 0) {
      timerSeconds = 0;
      clearInterval(timerInterval);
      timerInterval = null;
      updateTimerDisplay();
      notifyTimerEnd();
      return;
    }

    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const seconds = String(timerSeconds % 60).padStart(2, "0");

  timerDisplay.textContent = `${minutes}:${seconds}`;

  if (timerSeconds === 0) {
    timerDisplay.style.color = "#22c55e";
  } else if (timerSeconds <= 30) {
    timerDisplay.style.color = "#f59e0b";
  } else {
    timerDisplay.style.color = "#ffffff";
  }
}

function toggleTimerPause() {
  if (!timerInterval) return;

  timerPaused = !timerPaused;
  pauseTimerBtn.textContent = timerPaused ? "Continuar" : "Pausar";
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerPaused = false;
  timerSeconds = 180;
  pauseTimerBtn.textContent = "Pausar";
  updateTimerDisplay();
}

function notifyTimerEnd() {
  if ("vibrate" in navigator) {
    navigator.vibrate([300, 120, 300]);
  }

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);

    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.35);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.38);
  } catch {
    // Alguns navegadores bloqueiam som automático. A vibração já cobre o básico.
  }
}

function resetCurrentWorkout() {
  const confirmed = confirm(`Resetar somente o Treino ${currentWorkout}?`);

  if (!confirmed) return;

  const state = loadState();

  Object.keys(state).forEach((key) => {
    if (key.startsWith(`${currentWorkout}-`)) {
      delete state[key];
    }
  });

  saveState(state);
  renderWorkout();
}

function resetAllWorkouts() {
  const confirmed = confirm("Limpar todos os treinos A, B e C?");

  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);
  renderWorkout();
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentWorkout = tab.dataset.workout;

    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    renderWorkout();
  });
});

pauseTimerBtn.addEventListener("click", toggleTimerPause);
resetTimerBtn.addEventListener("click", resetTimer);
resetCurrentBtn.addEventListener("click", resetCurrentWorkout);
resetAllBtn.addEventListener("click", resetAllWorkouts);

updateTimerDisplay();
renderWorkout();
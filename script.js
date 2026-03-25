const STORAGE_KEY = "bgmi_tracker_v1";

const initialData = {
  players: {}
};

const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(initialData));

const matchForm = document.getElementById("matchForm");
const achievementForm = document.getElementById("achievementForm");
const playerCards = document.getElementById("playerCards");

document.getElementById("matchDate").valueAsDate = new Date();
document.getElementById("achievementDate").valueAsDate = new Date();

matchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("playerName").value.trim(),
    type: document.getElementById("matchType").value,
    date: document.getElementById("matchDate").value,
    kills: Number(document.getElementById("kills").value),
    position: Number(document.getElementById("position").value),
    pointsChased: Number(document.getElementById("pointsChased").value)
  };

  if (!payload.name || !payload.date) return;

  if (!state.players[payload.name]) {
    state.players[payload.name] = {
      matches: [],
      achievements: []
    };
  }

  state.players[payload.name].matches.push(payload);
  persist();
  matchForm.reset();
  document.getElementById("matchDate").valueAsDate = new Date();
  render();
});

achievementForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("achievementPlayer").value.trim();
  const date = document.getElementById("achievementDate").value;
  const text = document.getElementById("achievementText").value.trim();

  if (!name || !date || !text) return;

  if (!state.players[name]) {
    state.players[name] = {
      matches: [],
      achievements: []
    };
  }

  state.players[name].achievements.push({ date, text });
  persist();
  achievementForm.reset();
  document.getElementById("achievementDate").valueAsDate = new Date();
  render();
});

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function avg(values) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function buildAiInsights(matches) {
  if (!matches.length) return ["No match data yet."];

  const killList = matches.map((m) => m.kills);
  const posList = matches.map((m) => m.position);
  const avgKills = avg(killList);
  const avgPos = avg(posList);

  const sortedByDate = [...matches].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sortedByDate.slice(-5);
  const latestKillAvg = avg(latest.map((m) => m.kills));
  const latestPosAvg = avg(latest.map((m) => m.position));

  const insights = [];

  if (avgKills < 2) {
    insights.push("Improve early fight confidence: practice hot-drop 3 times/week to boost opening duel success.");
  } else {
    insights.push("Fragging output is healthy. Keep one designated entry-fragger strategy in scrims.");
  }

  if (avgPos > 20) {
    insights.push("Rotation timing needs work: start zone movement 30-45 seconds earlier.");
  } else {
    insights.push("Good survival consistency. Focus on converting top-10 games into top-3 finishes.");
  }

  if (latestKillAvg < avgKills) {
    insights.push("Recent kills are dropping. Review last 5 matches for overextension and split pushes.");
  } else {
    insights.push("Recent kill trend is improving. Continue current gunfight drills.");
  }

  if (latestPosAvg > avgPos) {
    insights.push("Recent placement trend is weaker. Add IGL check-calls every 2 minutes mid game.");
  }

  return insights;
}

function render() {
  const names = Object.keys(state.players).sort();

  if (!names.length) {
    playerCards.innerHTML = `<p class="small">No players added yet. Start by saving a match.</p>`;
    return;
  }

  playerCards.innerHTML = names
    .map((name) => {
      const { matches, achievements } = state.players[name];
      const totalKills = matches.reduce((t, m) => t + m.kills, 0);
      const totalPointsChased = matches.reduce((t, m) => t + m.pointsChased, 0);
      const avgKills = avg(matches.map((m) => m.kills));
      const avgPos = avg(matches.map((m) => m.position));
      const aiInsights = buildAiInsights(matches);

      const recentMatches = [...matches]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5)
        .map(
          (m) => `<li>${m.date} · ${m.type} · Kills: ${m.kills}, Position: ${m.position}, Points: ${m.pointsChased}</li>`
        )
        .join("");

      const achievementList = achievements
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5)
        .map((a) => `<li>${a.date} · ${a.text}</li>`)
        .join("");

      return `
        <article class="player-card">
          <h3>${name}</h3>
          <div class="stats">
            <div>Total Matches: <strong>${matches.length}</strong></div>
            <div>Total Kills: <strong class="good">${totalKills}</strong></div>
            <div>Avg Kills/Match: <strong>${avgKills.toFixed(2)}</strong></div>
            <div>Avg Position/Match: <strong class="${avgPos > 20 ? "bad" : "good"}">${avgPos.toFixed(2)}</strong></div>
            <div>Total Points Chased: <strong>${totalPointsChased}</strong></div>
          </div>

          <p><strong>Recent Matches</strong></p>
          <ul>${recentMatches || "<li class='small'>No match history yet.</li>"}</ul>

          <p><strong>Achievements</strong></p>
          <ul>${achievementList || "<li class='small'>No achievements yet.</li>"}</ul>

          <p><strong>AI Analysis & Improvement Points</strong></p>
          <ul>${aiInsights.map((tip) => `<li>${tip}</li>`).join("")}</ul>
        </article>
      `;
    })
    .join("");
}

render();

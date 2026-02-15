console.log("JS Loaded");

// ===== SUPABASE SETUP =====
const SUPABASE_URL = "https://knxsgxcwgvrglabgwglx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Zp5NmaVM_Ps9CsX0YlkMYg_0yEXybPk";

var supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ===== GLOBAL ELEMENTS =====


const setupScreen = document.getElementById("setupScreen");
const appScreen = document.getElementById("appScreen");
const startBtn = document.getElementById("startBtn");

const yourNameInput = document.getElementById("yourName");
const crushNameInput = document.getElementById("crushName");
const moodSelect = document.getElementById("moodSelect");
const anonymousCheckbox = document.getElementById("anonymous");

const question = document.getElementById("question");
const character = document.getElementById("character");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttons = document.getElementById("buttons");

const shareBox = document.getElementById("shareBox");
const shareBtn = document.getElementById("shareBtn");
const copyLinkBtn = document.getElementById("copyLinkBtn");
const shareLinkInput = document.getElementById("shareLink");
const linkStatus = document.getElementById("linkStatus");

const bg = document.querySelector(".bg-overlay");
const heartLayer = document.querySelector(".heart-layer");

const sound = document.getElementById("valSound");
const soundToggle = document.getElementById("soundToggle");
const themeToggle = document.getElementById("themeToggle");

// ===== STATE =====
let yesScale = 1;
let noScale = 1;
let noCount = 0;
let soundOn = true;

// ===== THEME =====
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

// ===== SOUND =====
soundToggle.onclick = () => {
  soundOn = !soundOn;
  soundToggle.textContent = soundOn ? "🔊" : "🔇";
  sound.volume = soundOn ? 0.6 : 0;
};

// ===== MOODS =====
const moods = {
  cute: { emoji: "🙈", yesText: "Yayyy 😍💖", final: "You're my Valentine 💘" },
  romantic: { emoji: "😍", yesText: "My love 😘💖", final: "Forever my Valentine 💍💘" },
  funny: { emoji: "😂", yesText: "E choke 😂💖", final: "Valentine confirmed 🤣💘" },
  dramatic: { emoji: "😭", yesText: "At last 🕺💃💖", final: "My Destinied Valentine 💘" }
};

const noTexts = [
  "No 😳","Are you sure? 😢","Think again 🥺",
  "Don't break my heart 💔","Last chance 😭",
  "Just say yes 😭💘","You can't escape 😈💓", "Don't do this 😭", 
    "You're breaking my heart 💔",
    "Try again 🥺",
    "You joking right? 😭",
    "Be Serious 😭",
    "Stop this 😭",
    "You're killing me 😭",
];

function getCodeFromURL() {
  const path = window.location.pathname;
  const parts = path.split("/");

  if (parts[1] === "v" && parts[2]) {
    return parts[2];
  }

  return null;
}
async function loadProposal(code) {

  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !data) {
    alert("Proposal not found 💔");
    return;
  }

  initApp({
    yourName: data.sender_name,
    crushName: data.crush_name,
    mood: data.mood
  });
}


// ===== UTILITIES =====
function createHeart(x, y) {
  const h = document.createElement("div");
  h.className = "heart";
  h.innerText = "💖";
  h.style.left = x + "px";
  h.style.top = y + "px";
  heartLayer.appendChild(h);
  setTimeout(() => h.remove(), 2000);
}

// Hearts fall from TOP 👇
function rainHearts() {
  const h = document.createElement("div");
  h.className = "heart";
  h.innerText = "💘";
  h.style.left = Math.random() * window.innerWidth + "px";
  h.style.top = "-40px";
  heartLayer.appendChild(h);
  setTimeout(() => h.remove(), 4000);
}

// Typing effect ✍️
function typeText(el, text, speed = 35) {
  el.textContent = "";
  let i = 0;
  const t = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(t);
  }, speed);
}

// ===== URL =====
function buildURL(data) {
  const params = new URLSearchParams(data).toString();
  return `${window.location.origin}/?${params}`;
}

function buildShareURL(data) {
  const params = new URLSearchParams(data).toString();
  return `https://be-my-valentine-app891.vercel.app/?${params}`;
}

function readURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    yourName: params.get("yourName"),
    crushName: params.get("crushName"),
    mood: params.get("mood")
  };
}

// ===== INIT =====
function initApp(data) {
  setupScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");

  const moodData = moods[data.mood];
  character.innerText = moodData.emoji;

  typeText(
    question,
    `${data.yourName} is asking 💘\n Will you be my Valentine, ${data.crushName}? 🌹`
  );
}

// ===== START =====
startBtn.onclick = async () => {

  let yourName = yourNameInput.value.trim();
  const crushName = crushNameInput.value.trim();
  const mood = moodSelect.value;
  const anonymous = anonymousCheckbox.checked;

  if (!yourName || !crushName) {
    alert("Fill both names 💖");
    return;
  }

  if (anonymous) yourName = "Someone";

  // Generate short code
  const code = Math.random().toString(36).substring(2, 8);

  // Save to database
  await supabase.from("proposals").insert({
    code,
    sender_name: yourName,
    crush_name: crushName,
    mood,
    anonymous,
    accepted: false
  });

  // Redirect to share page
  window.location.href = `/v/${code}`;
};

// ===== NO BUTTON =====
noBtn.onclick = () => {
  noCount++;
  noBtn.innerText = noTexts[Math.min(noCount, noTexts.length - 1)];

  yesScale += 0.25;
  yesBtn.style.transform = `scale(${yesScale})`;
  yesBtn.classList.add("glow");

  noScale = Math.max(0.85, noScale - 0.05);
  noBtn.style.transform = `scale(${noScale})`;

  bg.style.opacity = Math.min(1, yesScale / 2);

  const rect = yesBtn.getBoundingClientRect();
  createHeart(rect.left + rect.width / 2, rect.top);
};

// ===== YES BUTTON =====
yesBtn.onclick = () => {
  if (soundOn) sound.play().catch(() => {});

  buttons.innerHTML = "";

  const params = readURL();
  const moodData = moods[params.mood];

  question.innerHTML = `${moodData.yesText}<br>${moodData.final}`;
  question.style.animation = "beat 0.6s infinite";
  bg.style.opacity = 1;

  const rain = setInterval(rainHearts, 120);
  setTimeout(() => clearInterval(rain), 12000);

  const shareURL = buildShareURL(params);
  shareLinkInput.value = shareURL;
  shareBox.classList.remove("hidden");

  // Save acceptance (for persistence)
  localStorage.setItem("valAccepted", "true");
};

// ===== SHARE =====
shareBtn.onclick = async () => {
  const data = {
    title: "💘 Someone has a question for you",
    text: "Tap this 💖",
    url: shareLinkInput.value
  };

  if (navigator.share) {
    try { await navigator.share(data); } catch {}
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(data.text + "\n" + data.url)}`);
  }
};

// ===== COPY =====
copyLinkBtn.onclick = async () => {
  try {
    await navigator.clipboard.writeText(shareLinkInput.value);
    linkStatus.innerText = "💘 Link copied!";
  } catch {
    linkStatus.innerText = "❌ Couldn't copy link";
  }
};

// ===== AUTO LOAD =====
(function () {
  const data = readURL();

  // ===== AUTO LOAD FROM LINK =====
// ===== AUTO LOAD FROM LINK OR NORMAL MODE =====
(async function () {

  const code = getCodeFromURL();

  if (code) {
    await loadProposal(code);
    return;
  }

  // 👉 No link → show setup screen normally
  setupScreen.classList.remove("hidden");

})();



  // Restore celebration if refreshed
  if (localStorage.getItem("valAccepted")) {
    bg.style.opacity = 1;
  }
})();

document.addEventListener("DOMContentLoaded", async () => {

  const path = window.location.pathname;
  const parts = path.split("/");

  // Check if URL is /v/ABC123
  if (parts[1] === "v" && parts[2]) {

    const code = parts[2];

    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !data) {
      alert("Proposal not found 💔");
      return;
    }

    // Hide setup screen
    document.getElementById("setupscreen")?.classList.add("hidden");

    // Show app screen
    document.getElementById("appscreen")?.classList.remove("hidden");

    // Load proposal
    initApp({
      yourName: data.sender_name,
      crushName: data.crush_name,
      mood: data.mood
    });
  }

});


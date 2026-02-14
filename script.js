// ===== GLOBAL ELEMENTS =====
document.addEventListener("DOMContentLoaded", () => {

console.log("JS Loaded");

const setupScreen = document.getElementById("setupScreen");
const appScreen = document.getElementById("appScreen");
const startBtn = document.querySelector("#startBtn");


const yourNameInput = document.getElementById("yourName");
const crushNameInput = document.getElementById("crushName");
const moodSelect = document.getElementById("moodSelect");

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

// ===== STATE =====
let yesScale = 1;
let noScale = 1;
let noCount = 0;

// ===== MOOD ENGINE =====
const moods = {
  cute: {
    emoji: "🥺",
    yesText: "Yayyy 😍💖",
    final: "You're my Valentine 💘",
  },
  romantic: {
    emoji: "❤️",
    yesText: "My love 😍💖",
    final: "Forever my Valentine 💍💘",
  },
  funny: {
    emoji: "😂",
    yesText: "E choke 😂💖",
    final: "Valentine confirmed 😂💘",
  },
  dramatic: {
    emoji: "😭",
    yesText: "At last 😭💖",
    final: "Destiny Valentine 😭💘",
  }
};

const noTexts = [
  "No 😳",
  "Are you sure? 😢",
  "Think again 🥺",
  "Don't break my heart 💔",
  "Last chance 😭",
  "Stop this 😭",
  "Just say yes 😭💘",
  "You can't escape 😈💓",
];

// ===== UTILITIES =====
function createHeart(x,y){
  const h = document.createElement("div");
  h.className = "heart";
  h.innerText = "💖";
  h.style.left = x + "px";
  h.style.top = y + "px";
  heartLayer.appendChild(h);
  setTimeout(()=>h.remove(),2000);
}

function rainHearts(){
  const h = document.createElement("div");
  h.className = "heart";
  h.innerText = "💘";
  h.style.left = Math.random()*window.innerWidth + "px";
  h.style.top = window.innerHeight + "px";
  heartLayer.appendChild(h);
  setTimeout(()=>h.remove(),3000);
}

// ===== URL ENGINE =====
function buildURL(data){
  const params = new URLSearchParams(data).toString();
  return `${window.location.origin}/?${params}`;
}


function readURL(){
  const params = new URLSearchParams(window.location.search);
  return {
    yourName: params.get("yourName"),
    crushName: params.get("crushName"),
    mood: params.get("mood")
  };
}

// ===== SETUP FLOW =====
startBtn.addEventListener("click", ()=>{
  const yourName = yourNameInput.value.trim();
  const crushName = crushNameInput.value.trim();
  const mood = moodSelect.value;

  if(!yourName || !crushName){
    alert("Please fill both names 💖");
    return;
  }

  const url = buildURL({ yourName, crushName, mood });
  window.history.pushState({}, "", url);

  initApp({ yourName, crushName, mood });
});

// ===== INIT ENGINE =====
function initApp(data){
  setupScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  if(sound){
  sound.currentTime = 0;
  sound.volume = 0.6;
  sound.play().catch(()=>{});
}


  const moodData = moods[data.mood];

  character.innerText = moodData.emoji;
  question.innerHTML = `Will you be my Valentine, <span>${data.crushName}</span>? 🌹`;
}

// ===== BUTTON LOGIC =====
noBtn.addEventListener("click", ()=>{
  noCount++;
  noBtn.innerText = noTexts[Math.min(noCount, noTexts.length-1)];

  yesScale += 0.25;
  yesBtn.style.transform = `scale(${yesScale})`;
  yesBtn.classList.add("glow");

  noScale -= 0.05;
  if(noScale < 0.85) noScale = 0.85;
  noBtn.style.transform = `scale(${noScale})`;

  // FORCE overlay dominance
  yesBtn.style.zIndex = 10;
  noBtn.style.zIndex = 1;

  bg.style.opacity = Math.min(1, yesScale / 2);

  const rect = yesBtn.getBoundingClientRect();
  createHeart(rect.left + rect.width/2, rect.top);
});



yesBtn.addEventListener("click", ()=>{
  //if(sound){ sound.currentTime = 0; sound.play().catch(()=>{}); }

  buttons.innerHTML = "";

  const params = readURL();
  const moodData = moods[params.mood];

  question.innerHTML = `${moodData.yesText}<br>${moodData.final}`;
  question.style.animation = "beat 0.6s infinite";
  bg.style.opacity = 1;

  const rain = setInterval(rainHearts, 120);

  setTimeout(()=>clearInterval(rain), 12000);

  // Share
  const shareURL = window.location.href;
  shareLinkInput.value = shareURL;
  shareBox.classList.remove("hidden");
});

// ===== SHARE ENGINE =====
shareBtn.addEventListener("click", async ()=>{
  const data = {
    title: "Be My Valentine 💘",
    text: "Someone is asking you to be their Valentine 😍💖",
    url: window.location.href
  };

  if(navigator.share){
    try{ await navigator.share(data); }catch(e){}
  }else{
    window.open(`https://wa.me/?text=${encodeURIComponent(data.text + "\n" + data.url)}`);
  }
});

copyLinkBtn.addEventListener("click", async ()=>{
  try{
    await navigator.clipboard.writeText(window.location.href);
    linkStatus.innerText = "💘 Link copied! Send to your crush 😏";
  }catch(e){
    linkStatus.innerText = "❌ Couldn't copy link";
  }
});

// ===== AUTO INIT FROM URL =====
(function(){
  const data = readURL();
  if(data.yourName && data.crushName && data.mood){
    initApp(data);
  }
})();

});

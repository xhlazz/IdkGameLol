// --- Pixel Lyric Animation with 3-2-1 Countdown Button ---
// Created by @xhlazz

const canvas = document.getElementById('pixel-canvas');
const ctx = canvas.getContext('2d');
const lyricElem = document.getElementById('lyric');
const startScreen = document.getElementById('start-screen');
const countdownScreen = document.getElementById('countdown-screen');
const countdownNum = document.getElementById('countdown-num');
const startBtn = document.getElementById('start-btn');
const topCredit = document.getElementById('top-credit');

// Show credit at top
topCredit.textContent = "Created by @xhlazz";

// Lyric lines, timings (frames at 60fps), and highlight granularity
const lyricScenes = [
  { lyric: "Vem,", duration: 48, granularity: 1 },
  { lyric: "vem brilhar mais,", duration: 138, granularity: 3 },
  { lyric: "ser uma estrela sobre o sol", duration: 180, granularity: 6 },
  { lyric: "Estrelar mais,", duration: 120, granularity: 2 },
  { lyric: "ser mais brilhante do que o sol", duration: 180, granularity: 6 },
  { lyric: "Se mostrar mais,", duration: 240, granularity: 3 },
  { lyric: "ser Deus no céu, na terra eu Encantar mais,", duration: 240, granularity: 8 },
  { lyric: "ser tudo por um dia", duration: 240, granularity: 5 }
];

// -------- Background Drawing Functions --------

function drawPixelSky(frame) {
  let grad = ctx.createLinearGradient(0,0,0,canvas.height);
  grad.addColorStop(0, "#273148");
  grad.addColorStop(1, "#5e7bb1");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 65; i++) {
    let x = (i * 39 + Math.sin(frame / 13 + i * 2) * 18) % canvas.width;
    let y = (i * 17 + Math.cos(frame / 9 + i * 3) * 12) % 110;
    ctx.fillStyle = i % 3 == 0 ? "#fff" : "#aad";
    ctx.globalAlpha = 0.7 + 0.3 * Math.sin(frame/30 + i);
    ctx.fillRect(Math.floor(x), Math.floor(y)+6, 2, 2);
    ctx.globalAlpha = 1;
  }
}

function drawPixelSun(x, y, frame, brightness=1.0) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,200,0,${0.8})`;
  ctx.fill();
  for (let i = 0; i < 22; i++) {
    let angle = (frame/4 + i*16.3) * Math.PI/180;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = `rgba(255,220,80,${0.3+0.6*Math.abs(Math.sin(frame/40+i))})`;
    ctx.fillRect(25, -3, 20, 6);
    ctx.restore();
  }
  ctx.restore();
}

function drawPixelGrass(frame) {
  for (let x = 0; x < canvas.width; x += 7) {
    let h = 17 + Math.sin((frame/9) + x/19) * 5;
    ctx.beginPath();
    ctx.moveTo(x, 245);
    ctx.lineTo(x, 245-h);
    ctx.strokeStyle = "#59d34b";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.lineWidth = 1;
}

function drawPixelRoad(frame) {
  ctx.fillStyle = "#2d2d2d";
  ctx.fillRect(0, 246, canvas.width, 36);
  for (let i = 0; i < 15; i++) {
    let rx = i * 32 + frame % 32;
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(rx, 262, 18, 5);
  }
}

function drawPixelHouses(frame) {
  const houseColors = ["#db7a34", "#e8e6e1", "#5792e3", "#ffd700", "#b8db7a"];
  for (let i = 0; i < 5; i++) {
    let baseX = 38 + i*86 + Math.sin(frame/35+i)*4;
    let baseY = 190 + Math.cos(frame/29+i)*3;
    ctx.fillStyle = houseColors[i];
    ctx.fillRect(baseX, baseY, 54, 32);
    ctx.fillStyle = "#593b1c";
    ctx.fillRect(baseX+14, baseY+21, 16, 17);
    ctx.fillStyle = "#fff";
    ctx.fillRect(baseX+40, baseY+7, 8, 8);
    ctx.beginPath();
    ctx.moveTo(baseX-4, baseY);
    ctx.lineTo(baseX+27, baseY-23);
    ctx.lineTo(baseX+62, baseY);
    ctx.closePath();
    ctx.fillStyle = "#8b3c1c";
    ctx.fill();
  }
}

// -------- Scene Actors --------

function drawStickMan(x, y, frame, waving=false, armsUp=false, smile=false, color="#fff", halo=false, cross=false, glow=0) {
  ctx.save();
  // Draw cross if needed (Jesus)
  if (cross) {
    ctx.save();
    ctx.strokeStyle = "#ffe4b2";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x+8, y-15); // vertical
    ctx.lineTo(x+8, y+45);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x-12, y+10); // horizontal
    ctx.lineTo(x+28, y+10);
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = color;
  ctx.fillRect(x + 4, y + 26, 2, 18); // left leg
  ctx.fillRect(x + 10, y + 26, 2, 18); // right leg
  ctx.fillRect(x + 6, y + 12, 4, 16); // body
  ctx.beginPath();
  ctx.arc(x + 8, y + 6, 7, 0, Math.PI * 2);
  ctx.fill(); // head
  if (glow > 0) {
    ctx.globalAlpha = 0.5 * glow;
    ctx.beginPath();
    ctx.arc(x + 8, y + 6, 13, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd700";
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = "#222";
  if (smile) {
    ctx.beginPath();
    ctx.arc(x + 8, y + 11, 4, 0, Math.PI, false);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#222";
    ctx.fillRect(x + 6, y + 7, 2, 2);
    ctx.fillRect(x + 10, y + 7, 2, 2);
  }
  ctx.save();
  ctx.translate(x + 8, y + 18);
  if (armsUp) {
    ctx.rotate(-Math.PI/4 + Math.sin(frame/8)*0.2);
    ctx.fillRect(-16, 0, 16, 2);
    ctx.rotate(Math.PI/2);
    ctx.fillRect(0, 0, 16, 2);
  } else if (waving) {
    ctx.rotate(Math.sin(frame/8)*0.4);
    ctx.fillRect(-16, 0, 16, 2);
    ctx.rotate(-Math.PI/2);
    ctx.fillRect(0, 0, 16, 2);
  } else {
    ctx.fillRect(-8, 4, 16, 2);
  }
  ctx.restore();
  // Halo
  if (halo) {
    ctx.beginPath();
    ctx.arc(x + 8, y + 2, 10, 0, Math.PI * 2);
    ctx.strokeStyle = "#fffcaa";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
  }
  ctx.restore();
}

function drawStar(x, y, frame, scale=1.0, glow=0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.rotate(Math.sin(frame/15)*0.2);
  ctx.fillStyle = `rgba(255,215,0,${0.8+glow*0.2})`;
  for(let i=0;i<5;i++){
    ctx.rotate(Math.PI/2.5);
    ctx.fillRect(0, -9, 7, 32);
  }
  ctx.restore();
}

// Draw group of people (brothers, friends) dancing and cheering gently
function drawPeopleGroup(frame, options={}) {
  const baseY = options.y || 190;
  let colors = ["#fff", "#aae", "#f99", "#9cf", "#ffd700"];
  for (let i = 0; i < 5; i++) {
    let x = 60 + i*44 + Math.sin(frame/18 + i)*12;
    let armsUp = (frame/20+i)%2 < 1;
    let smile = true;
    drawStickMan(x, baseY, frame+i*9, false, armsUp, smile, colors[i]);
  }
}

// ----------- Lyric Highlight Logic -----------

function getLyricHighlightHTML(line, duration, granularity, frame) {
  let words = line.split(' ');
  let wordFrames = Math.floor(duration / granularity);
  let highlightIdx = Math.min(granularity-1, Math.floor(frame / wordFrames));
  let groupSize = Math.ceil(words.length/granularity);
  let html = "";
  for (let i = 0; i < granularity; i++) {
    let start = i*groupSize;
    let end = Math.min(words.length, (i+1)*groupSize);
    let phrase = words.slice(start, end).join(' ');
    if (i === highlightIdx) {
      html += `<span class="highlight">${phrase}</span> `;
    } else {
      html += `<span>${phrase}</span> `;
    }
  }
  return html.trim();
}

// -------- Scene Logic --------
let sceneIdx = 0;
let sceneFrame = 0;

// -------- Countdown Animation --------
function showCountdownAnimation(callback) {
  let num = 3;
  countdownScreen.style.display = "";
  countdownNum.textContent = "";
  let interval;
  function nextCount() {
    countdownNum.textContent = num;
    countdownNum.style.color = "#ffd700";
    countdownNum.style.fontSize = "60px";
    countdownNum.style.textShadow = "0 0 16px #fff";
    num--;
    if(num >= 0) {
      setTimeout(nextCount, 700);
    } else {
      countdownScreen.style.display = "none";
      canvas.style.display = "";
      callback();
    }
  }
  nextCount();
}

// -------- Main Animation --------
function mainAnimate() {
  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // --- Draw background ---
    drawPixelSky(sceneFrame);
    drawPixelSun(400, 60, sceneFrame, 1.0); // Only 1 sun in the sky
    drawPixelHouses(sceneFrame);
    drawPixelGrass(sceneFrame);
    drawPixelRoad(sceneFrame);
    // Credit already at top

    // --- Animate main story per lyric line ---
    let scene = lyricScenes[sceneIdx];
    let mainY = 190;
    let secondY = 190;
    let starX = 350;
    let starY = 110;

    if(sceneIdx === 0) {
      // Invitation: waving stick-man and group of calm brothers
      drawStickMan(80, mainY, sceneFrame, waving=true, false, smile=true, "#fff");
      drawPeopleGroup(sceneFrame, {y: mainY+14});
      ctx.font = "bold 11px 'Press Start 2P', cursive";
      ctx.fillStyle = "#ffd700";
      ctx.globalAlpha = 0.8;
      ctx.fillRect(120, mainY-60, 122, 24);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#222";
      ctx.fillText("Vem brilhar!", 138, mainY-43);
    } else if(sceneIdx === 1) {
      // Second stick-man enters, glows, brothers cheer
      drawStickMan(80, mainY, sceneFrame, false, false, smile=true, "#fff");
      let x = 350 - Math.max(0, 100 - sceneFrame); // slide in
      let glow = Math.min(1, sceneFrame/60);
      drawStickMan(x, secondY, sceneFrame, false, false, true, "#ffd700", false, false, glow);
      drawPeopleGroup(sceneFrame, {y: mainY+14});
      drawStickMan(80, mainY, sceneFrame, true, false, true, "#fff");
    } else if(sceneIdx === 2) {
      // Morph into star, float above sun, brothers cheer
      let personY = secondY - Math.min(sceneFrame, 45);
      if (sceneFrame < 70) {
        drawStickMan(starX, personY, sceneFrame, false, false, true, "#ffd700");
      } else {
        let starAscendY = personY - (sceneFrame - 70) * 0.7;
        drawStar(starX, Math.max(80, starAscendY), sceneFrame, 1 + Math.min(1, (sceneFrame-70)/38), 1.2);
      }
      drawStickMan(80, mainY, sceneFrame, false, false, true, "#fff");
      drawPeopleGroup(sceneFrame, {y: mainY+14});
    } else if(sceneIdx === 3) {
      // Star sparkles and grows, people cheer
      drawStar(starX, 80, sceneFrame, 1.5 + 0.25*Math.sin(sceneFrame/7), 1.2);
      drawStickMan(80, mainY, sceneFrame, false, false, true, "#fff");
      drawPeopleGroup(sceneFrame, {y: mainY+14});
    } else if(sceneIdx === 4) {
      // Star pulses, sun glows, people look up
      drawStar(starX, 80, sceneFrame, 1.7 + 0.22 * Math.sin(sceneFrame/6), 2);
      drawStickMan(80, mainY, sceneFrame, false, true, true, "#fff");
      drawPeopleGroup(sceneFrame, {y: mainY+14});
    } else if(sceneIdx === 5) {
      // Jesus appears with cross, joins stick-man, brothers celebrate
      drawStar(starX, 80, sceneFrame, 1.6, 2);
      drawStickMan(80, mainY, sceneFrame, false, false, true, "#fff");
      drawStickMan(180, mainY, sceneFrame, false, false, true, "#aae", true, true);
      drawPeopleGroup(sceneFrame, {y: mainY+14});
    } else if(sceneIdx === 6) {
      // Jesus and stick-man dance gently, brothers sway calmly
      drawStar(starX, 80, sceneFrame, 1.6, 2);
      let dx = Math.sin(sceneFrame/28)*16;
      drawStickMan(80+dx, mainY, sceneFrame, false, true, true, "#fff");
      drawStickMan(180-dx, mainY, sceneFrame, false, true, true, "#aae", true, true);
      drawPeopleGroup(sceneFrame, {y: mainY+14});
    } else {
      // Final scene: gentle glow, everyone together, calm unity
      drawStar(starX, 80, sceneFrame, 1.7, 2);
      drawStickMan(80, mainY, sceneFrame, false, true, true, "#fff");
      drawStickMan(180, mainY, sceneFrame, false, true, true, "#aae", true, true);
      drawPeopleGroup(sceneFrame, {y: mainY+14});
      ctx.font = "bold 22px 'Press Start 2P', cursive";
      ctx.fillStyle = "#fff";
      ctx.globalAlpha = 0.7 + 0.3*Math.abs(Math.sin(sceneFrame/20));
      ctx.fillText("Fim!", canvas.width/2, 140);
      ctx.globalAlpha = 1;
    }

    // --- Lyric Highlight at rhythm ---
    lyricElem.innerHTML = getLyricHighlightHTML(scene.lyric, scene.duration, scene.granularity, sceneFrame);

    sceneFrame++;
    if (sceneFrame > scene.duration) {
      sceneIdx++;
      sceneFrame = 0;
      if (sceneIdx >= lyricScenes.length) {
        lyricElem.innerHTML = `<span class="highlight">Fim!</span>`;
        return;
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// -------- Start Button Logic --------
startBtn.onclick = () => {
  startScreen.style.display = "none";
  showCountdownAnimation(mainAnimate);
};
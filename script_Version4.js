const canvas = document.getElementById('pixel-canvas');
const ctx = canvas.getContext('2d');
const lyricElem = document.getElementById('lyric');

// Lyrics and timings (approx frames per word for slow/beautiful pacing)
const lyrics = [
  "Vem,", "vem brilhar mais,", "ser uma estrela sobre o sol",
  "Estrelar mais,", "ser mais brilhante do que o sol",
  "Se mostrar", "mais,", "ser Deus no céu, na terra eu",
  "Encantar mais,", "ser tudo por um dia"
];
const wordFrames = [30, 40, 60, 40, 60, 30, 30, 60, 40, 60]; // Each word/line duration

// Helper: Draw stick-person (basic pixel art, animated)
function drawStickMan(x, y, frame, waving=false, armsUp=false, smile=false, color="#fff", halo=false) {
  // Legs
  ctx.fillStyle = color;
  ctx.fillRect(x+4, y+16, 2, 14);
  ctx.fillRect(x+10, y+16, 2, 14);
  // Body
  ctx.fillRect(x+6, y+6, 4, 16);
  // Head
  ctx.beginPath();
  ctx.arc(x+8, y+2, 6, 0, Math.PI*2);
  ctx.fill();
  // Face
  if (smile) {
    ctx.strokeStyle="#222";
    ctx.beginPath();
    ctx.arc(x+8, y+4, 3, 0, Math.PI, false);
    ctx.stroke();
  } else {
    ctx.fillStyle="#222";
    ctx.fillRect(x+6, y+2, 2, 2);
    ctx.fillRect(x+10, y+2, 2, 2);
  }
  // Arms
  ctx.save();
  ctx.translate(x+8, y+10);
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
    ctx.arc(x+8, y-2, 8, 0, Math.PI * 2);
    ctx.strokeStyle = "#fffcaa";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
  }
}

// Helper: Draw star (pixel art, animated)
function drawStar(x, y, frame, scale=1.0, glow=0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.rotate(Math.sin(frame/15)*0.2);
  ctx.fillStyle = `rgba(255,215,0,${0.8+glow*0.2})`;
  for(let i=0;i<5;i++){
    ctx.rotate(Math.PI/2.5);
    ctx.fillRect(0, -8, 5, 28);
  }
  ctx.restore();
}

// Helper: Draw sun
function drawSun(x, y, frame, brightness=1.0) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, 24, 0, Math.PI*2);
  ctx.fillStyle = `rgba(255,180,0,${0.7+0.3*Math.sin(frame/9)*brightness})`;
  ctx.fill();
  // Rays
  for(let i=0; i<12; i++) {
    let a = (frame/5 + i*30) * Math.PI/180;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.fillStyle = `rgba(255,220,50,0.4)`;
    ctx.fillRect(24, -2, 16, 4);
    ctx.restore();
  }
  ctx.restore();
}

// Helper: Draw raining stars
function drawRainingStars(frame) {
  for(let i=0;i<22;i++){
    let x = i*18 + Math.sin(frame/8+i)*10;
    let y = (frame*2 + i*24)%300;
    drawStar(x, y, frame+i*4, 0.5+0.2*Math.sin(frame/7+i), 1);
  }
}

function drawLyricDance(line, frame) {
  // Split lyric into words, animate a mini dancer above each word
  let words = line.split(' ');
  let lyricW = canvas.width / (words.length+1);
  for(let i=0; i<words.length; i++) {
    let x = lyricW/2 + i*lyricW - 6;
    let y = 260 - Math.abs(Math.sin(frame/7+i)*8);
    drawStickMan(x, y, frame+i*5, true, false, true, "#ffd700");
  }
}

// ----------- Animation State Machine -------------

let scene = 0;
let frame = 0;
let lyricFrame = 0;
let lyricIdx = 0;

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // --- Scene 1: Stick-man invites ---
  if(scene === 0) {
    drawSun(340, 50, frame, 0.8);
    drawStickMan(80, 180, frame, true, false, true, "#fff");
    // Speech bubble
    ctx.fillStyle = "#ffd700";
    ctx.globalAlpha = 0.9;
    ctx.fillRect(110, 140, 90, 26);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#222";
    ctx.font = "bold 10px 'Press Start 2P', cursive";
    ctx.fillText("Vem brilhar!", 120, 156);
    if(frame > 40) {scene++; frame=0;}
  }
  // --- Scene 2: Second stick-person arrives ---
  else if(scene === 1) {
    drawSun(340, 50, frame, 0.7);
    drawStickMan(80, 180, frame, false, false, true, "#fff");
    drawStickMan(180, 180, frame, false, false, false, "#ffd700");
    if(frame > 30) {scene++; frame=0;}
  }
  // --- Scene 3: Transformation into star ---
  else if(scene === 2) {
    drawSun(340, 50, frame, 0.7);
    drawStickMan(80, 180, frame, false, false, true, "#fff");
    drawStickMan(180, 180, frame, false, true, true, "#ffd700");
    // Star morph
    drawStar(188, 170-Math.abs(Math.sin(frame/6)*8), frame, 0.8+0.3*Math.sin(frame/5), 1);
    if(frame > 40) {scene++; frame=0;}
  }
  // --- Scene 4: Star floats above sun ---
  else if(scene === 3) {
    drawSun(200, 90, frame, 1.0);
    drawStickMan(80, 180, frame, false, false, true, "#fff");
    let starY = 170 - frame*2;
    drawStar(200, Math.max(100, starY), frame, 1.1, 1);
    if(frame > 35) {scene++; frame=0;}
  }
  // --- Scene 5: Star shines brighter, grows bigger ---
  else if(scene === 4) {
    drawSun(200, 90, frame, 1.0);
    let scale = 1.1 + 0.25*Math.sin(frame/7);
    drawStar(200, 100, frame, scale, 2);
    drawStickMan(80, 180, frame, false, false, true, "#fff");
    if(frame > 40) {scene++; frame=0;}
  }
  // --- Scene 6: Jesus appears ---
  else if(scene === 5) {
    drawSun(200, 90, frame, 1.0);
    drawStar(200, 100, frame, 1.3, 2);
    drawStickMan(80, 180, frame, false, false, true, "#fff");
    // Jesus (stick-man with halo, robe)
    drawStickMan(120, 180, frame, false, false, true, "#aae", true);
    // Robe
    ctx.fillStyle = "#88e";
    ctx.fillRect(126, 190, 12, 18);
    if(frame > 35) {scene++; frame=0;}
  }
  // --- Scene 7: All look up together ---
  else if(scene === 6) {
    drawSun(200, 90, frame, 1.0);
    drawStar(200, 100, frame, 1.2, 2);
    drawStickMan(80, 180, frame, false, true, true, "#fff");
    drawStickMan(120, 180, frame, false, true, true, "#aae", true);
    if(frame > 30) {scene++; frame=0;}
  }
  // --- Scene 8: Slow dance ---
  else if(scene === 7) {
    drawSun(200, 90, frame, 1.0);
    drawStar(200, 100, frame, 1.2, 2);
    // Gentle side-to-side dance
    let dx = Math.sin(frame/12)*12;
    drawStickMan(80+dx, 180, frame, false, true, true, "#fff");
    drawStickMan(120-dx, 180, frame, false, true, true, "#aae", true);
    if(frame > 60) {scene++; frame=0;}
  }
  // --- Scene 9: Rain stars, beautiful ending ---
  else if(scene === 8) {
    drawSun(200, 90, frame, 1.0);
    drawStar(200, 100, frame, 1.3, 2);
    drawStickMan(80, 180, frame, false, true, true, "#fff");
    drawStickMan(120, 180, frame, false, true, true, "#aae", true);
    drawRainingStars(frame);
    if(frame > 70) {scene++; frame=0;}
  }
  // --- Scene 10: End, everyone happy ---
  else {
    drawRainingStars(frame);
    ctx.font = "bold 18px 'Press Start 2P', cursive";
    ctx.fillStyle = "#fff";
    ctx.fillText("Fim!", 160, 160);
  }

  // --- Draw dancing lyric sprites above lyrics ---
  if(lyricIdx < lyrics.length){
    lyricElem.textContent = lyrics[lyricIdx];
    drawLyricDance(lyrics[lyricIdx], lyricFrame);
    lyricFrame++;
    if (lyricFrame > wordFrames[lyricIdx]) {
      lyricIdx++;
      lyricFrame = 0;
    }
  } else {
    lyricElem.textContent = "";
  }

  frame++;
  requestAnimationFrame(animate);
}

animate();
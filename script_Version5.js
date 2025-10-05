const canvas = document.getElementById('pixel-canvas');
const ctx = canvas.getContext('2d');
const lyricElem = document.getElementById('lyric');

// Lyric lines and timings
const lyricScenes = [
  { // 1
    lyric: "Vem,",
    duration: 48,
    action: function(frame) {
      // Stick-man waves arms, inviting
      drawStickMan(100, 180, frame, waving=true);
    }
  },
  { // 2
    lyric: "vem brilhar mais,",
    duration: 138,
    action: function(frame) {
      // Second stick-man enters, gets brighter
      drawStickMan(100, 180, frame, false);
      let x = 280 - Math.max(0, 100 - frame); // slide in
      let glow = Math.min(1, frame/60);
      drawStickMan(x, 180, frame, false, false, true, "#ffd700", false, glow);
      // Stick-man gestures toward second
      drawStickMan(100, 180, frame, true);
    }
  },
  { // 3
    lyric: "ser uma estrela sobre o sol",
    duration: 180,
    action: function(frame) {
      // Stick-person morphs into star, floats up
      let personY = 180 - Math.min(frame, 40);
      if (frame < 60) {
        drawStickMan(280, personY, frame, false, false, true, "#ffd700");
      } else {
        let starY = personY - (frame - 60) * 0.6;
        drawStar(280, Math.max(100, starY), frame, 1 + Math.min(1, (frame-60)/40), 1);
      }
      drawStickMan(100, 180, frame, false, false, true, "#fff");
      drawSun(200, 90, frame, 1.0);
    }
  },
  { // 4
    lyric: "Estrelar mais,",
    duration: 120,
    action: function(frame) {
      // Star sparkles and grows
      drawStar(280, 100, frame, 1.2 + 0.2*Math.sin(frame/8), 1);
      drawSun(200, 90, frame, 1.0);
      drawStickMan(100, 180, frame, false, false, true, "#fff");
    }
  },
  { // 5
    lyric: "ser mais brilhante do que o sol",
    duration: 180,
    action: function(frame) {
      // Star pulses, sun glows, all eyes on star
      drawStar(280, 100, frame, 1.4 + 0.3*Math.sin(frame/6), 2);
      drawSun(200, 90, frame, 1.0 + 0.5*Math.abs(Math.sin(frame/12)));
      drawStickMan(100, 180, frame, false, false, true, "#fff");
    }
  },
  { // 6
    lyric: "Se mostrar mais,",
    duration: 240,
    action: function(frame) {
      // Jesus appears, joins scene
      drawStar(280, 100, frame, 1.4, 2);
      drawSun(200, 90, frame, 1.2);
      drawStickMan(100, 180, frame, false, false, true, "#fff");
      // Jesus (stick-man, halo, robe)
      drawStickMan(180, 180, frame, false, false, true, "#aae", true);
      ctx.fillStyle = "#88e";
      ctx.fillRect(186, 190, 12, 18); // robe
    }
  },
  { // 7
    lyric: "ser Deus no céu, na terra eu Encantar mais,",
    duration: 240,
    action: function(frame) {
      // Jesus, stick-man, and star all look up and dance gently
      drawStar(280, 100, frame, 1.4, 2);
      drawSun(200, 90, frame, 1.2);
      let dx = Math.sin(frame/24)*10;
      drawStickMan(100+dx, 180, frame, false, true, true, "#fff");
      drawStickMan(180-dx, 180, frame, false, true, true, "#aae", true);
      ctx.fillStyle = "#88e";
      ctx.fillRect(186-dx, 190, 12, 18); // robe
    }
  },
  { // 8
    lyric: "ser tudo por um dia",
    duration: 240,
    action: function(frame) {
      // Stars rain, everything glows, beautiful
      drawStar(280, 100, frame, 1.4, 2);
      drawSun(200, 90, frame, 1.2);
      drawStickMan(100, 180, frame, false, true, true, "#fff");
      drawStickMan(180, 180, frame, false, true, true, "#aae", true);
      ctx.fillStyle = "#88e";
      ctx.fillRect(186, 190, 12, 18); // robe
      drawRainingStars(frame);
    }
  }
];

// Draw stick-man (with some options)
function drawStickMan(x, y, frame, waving=false, armsUp=false, smile=false, color="#fff", halo=false, glow=0) {
  ctx.save();
  ctx.fillStyle = color;
  // Legs
  ctx.fillRect(x+4, y+16, 2, 14);
  ctx.fillRect(x+10, y+16, 2, 14);
  // Body
  ctx.fillRect(x+6, y+6, 4, 16);
  // Head
  ctx.beginPath();
  ctx.arc(x+8, y+2, 6, 0, Math.PI*2);
  ctx.fill();
  // Glow
  if (glow > 0) {
    ctx.globalAlpha = 0.5 * glow;
    ctx.beginPath();
    ctx.arc(x+8, y+2, 10, 0, Math.PI*2);
    ctx.fillStyle = "#ffd700";
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // Face
  ctx.strokeStyle="#222";
  if (smile) {
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
  ctx.restore();
}

// Star
function drawStar(x, y, frame, scale=1, glow=0) {
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

// Sun
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

// Raining stars
function drawRainingStars(frame) {
  for(let i=0;i<22;i++){
    let x = i*18 + Math.sin(frame/8+i)*10;
    let y = (frame*2 + i*24)%300;
    drawStar(x, y, frame+i*4, 0.5+0.2*Math.sin(frame/7+i), 1);
  }
}

// Dancing lyric sprites above each word
function drawLyricDance(line, frame) {
  let words = line.split(' ');
  let lyricW = canvas.width / (words.length+1);
  for(let i=0; i<words.length; i++) {
    let x = lyricW/2 + i*lyricW - 6;
    let y = 260 - Math.abs(Math.sin(frame/7+i)*8);
    drawStickMan(x, y, frame+i*5, true, false, true, "#ffd700");
  }
}

let sceneIdx = 0;
let sceneFrame = 0;

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  let scene = lyricScenes[sceneIdx];
  scene.action(sceneFrame);

  // Lyric display + mini dancers
  lyricElem.textContent = scene.lyric;
  drawLyricDance(scene.lyric, sceneFrame);

  sceneFrame++;
  if (sceneFrame > scene.duration) {
    sceneIdx++;
    sceneFrame = 0;
    if (sceneIdx >= lyricScenes.length) {
      lyricElem.textContent = "Fim!";
      return;
    }
  }
  requestAnimationFrame(animate);
}

animate();
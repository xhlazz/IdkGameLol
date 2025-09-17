// --- Utility: Draw Cute Character ---
function drawCharacter(ctx, x, y, facing = 'right', sitting = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing === 'left' ? -1 : 1, 1);

  // Body
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "#666";
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Eyes
  ctx.beginPath(); ctx.arc(-6, -2, 3.2, 0, Math.PI * 2);
  ctx.arc(6, -2, 3.2, 0, Math.PI * 2);
  ctx.fillStyle = "#222";
  ctx.fill();

  // Smile
  ctx.beginPath();
  ctx.arc(0, 7, 7, Math.PI*0.15, Math.PI*0.85);
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Hands
  if (!sitting) {
    ctx.beginPath();
    ctx.arc(-13, 8, 7, Math.PI*0.4, Math.PI*1.6);
    ctx.arc(13, 8, 7, Math.PI*1.6, Math.PI*0.4, true);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#222";
    ctx.stroke();
  } else {
    // Sitting hands
    ctx.beginPath();
    ctx.arc(-11, 15, 4.5, Math.PI*0.9, Math.PI*2, false);
    ctx.arc(11, 15, 4.5, Math.PI*1, Math.PI*2.1, false);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#222";
    ctx.stroke();
  }

  // Saucer
  if (sitting) {
    ctx.save();
    ctx.translate(0, 22);
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#eee";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 7, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// --- Utility: Draw Smooth Heart ---
function drawSmoothHeart(ctx, x, y, size, color, rot = 0, alpha = 1, shine = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  for (let t = 0; t < Math.PI * 2; t += 0.06) {
    let px = size * 16 * Math.pow(Math.sin(t), 3) / 17;
    let py = -size * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17;
    if (t === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 0.7;
  ctx.fillStyle = color;
  ctx.fill();
  ctx.shadowBlur = 0;
  if (shine) {
    ctx.globalAlpha *= 0.5;
    ctx.save();
    ctx.rotate(-0.5);
    ctx.beginPath();
    ctx.ellipse(size * 0.7, -size * 0.5, size * 0.6, size * 0.22, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

// --- Utility: Starry Background ---
function createStars(w, h, layers = 3) {
  let stars = [];
  let colors = ['#fff', '#aef', '#fee'];
  for (let l = 0; l < layers; l++) {
    for (let i = 0; i < 30 + l * 7; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5 + l * 0.4,
        a: Math.random() * Math.PI * 2,
        tw: Math.random() * 0.6 + 0.4,
        layer: (l + 1) / layers,
        color: colors[l % colors.length]
      });
    }
  }
  return stars;
}

function drawStars(ctx, stars, w, h) {
  ctx.clearRect(0, 0, w, h);
  for (const star of stars) {
    star.a += 0.016 + star.tw * 0.011;
    let alpha = 0.6 + Math.sin(star.a) * 0.4;
    let px = star.x + Math.sin(star.a * 0.1) * 5 * star.layer;
    let py = star.y + Math.cos(star.a * 0.13) * 3 * star.layer;
    ctx.beginPath();
    ctx.arc(px, py, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${star.color === '#fff' ? '255,255,255' : star.color === '#aef' ? '170,238,255' : '255,238,238'},${alpha})`;
    ctx.shadowColor = star.color;
    ctx.shadowBlur = 8 * star.layer;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// --- Heart Arc Scene ---
function heartArcScene(ctx, w, h, frame) {
  // Draw stars
  drawStars(ctx, heartArcScene.stars, w, h);

  // Characters
  drawCharacter(ctx, 50, h - 65, 'right');
  drawCharacter(ctx, w - 50, h - 65, 'left');

  // Heart arcs
  let n = 22;
  for (let i = 0; i < n; i++) {
    let t = i / (n - 1);
    // Left arc
    let x1 = 50, y1 = h - 65;
    let x2 = w / 2, y2 = h * 0.33;
    let cx = w / 2 - 100, cy = h * 0.15;
    let bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
    let by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
    drawSmoothHeart(ctx, bx, by, 13, "#ff1361", Math.sin(frame * 0.07 + i) * 0.4);

    // Right arc
    x1 = w - 50;
    x2 = w / 2;
    cx = w / 2 + 100;
    bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
    by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
    drawSmoothHeart(ctx, bx, by, 13, "#ff1361", Math.sin(frame * 0.07 + i + 1) * 0.4);
  }
}

// --- Heart Shape Scene ---
function heartShapeScene(ctx, w, h, frame) {
  // Draw stars
  drawStars(ctx, heartShapeScene.stars, w, h);

  // Characters (sitting)
  drawCharacter(ctx, 60, h - 65, 'right', true);
  drawCharacter(ctx, w - 60, h - 65, 'left', true);

  // "Te amo" text
  ctx.save();
  ctx.font = "bold 44px Arial Rounded MT Bold, Arial, sans-serif";
  ctx.fillStyle = "#ff6ec7";
  ctx.textAlign = "center";
  ctx.shadowColor = "#ff1361";
  ctx.shadowBlur = 16;
  ctx.fillText("Te amo", w / 2, h * 0.18);
  ctx.restore();

  // Heart shape made from hearts
  let n = 38;
  let cx = w / 2, cy = h * 0.36, r = 83;
  for (let i = 0; i < n; i++) {
    let t = i / (n - 1);
    let a = Math.PI * (1.13 * t + 0.2);
    let px = cx + Math.sin(a) * r * (1 - 0.18 * Math.abs(t - 0.5));
    let py = cy - Math.cos(a) * r - 30 * Math.abs(t - 0.5);
    drawSmoothHeart(ctx, px, py, 15, "#ff1361", Math.sin(frame * 0.12 + i) * 0.23);
  }
}

// --- Scene Switcher ---
function runAnimation() {
  const canvas = document.getElementById("surprise-canvas");
  const w = canvas.width = window.innerWidth;
  const h = canvas.height = window.innerHeight;
  heartArcScene.stars = createStars(w, h);
  heartShapeScene.stars = heartArcScene.stars;
  let frame = 0;
  let scene = 0;
  let switchTime = 220; // frames before switching to heart shape

  function draw() {
    if (scene === 0) {
      heartArcScene(canvas.getContext('2d'), w, h, frame);
      if (frame > switchTime) scene = 1;
    } else {
      heartShapeScene(canvas.getContext('2d'), w, h, frame - switchTime);
    }
    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}

// --- Button Logic ---
window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById('center-btn');
  const canvas = document.getElementById('surprise-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  btn.addEventListener("click", () => {
    btn.style.opacity = 0;
    setTimeout(() => { btn.style.display = 'none'; }, 600);
    canvas.style.display = "block";
    runAnimation();
  });
});
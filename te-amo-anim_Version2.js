// --- STAR BACKGROUND ---
const starsCanvas = document.getElementById('stars-bg');
const starsCtx = starsCanvas.getContext('2d');
let stars = [];
function resizeStarsCanvas() {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
}
resizeStarsCanvas();
window.addEventListener('resize', resizeStarsCanvas);

function createStars() {
  stars = [];
  let layers = [0.3, 0.6, 1];
  let colors = ['#fff', '#aef', '#fee'];
  for (let l = 0; l < layers.length; l++) {
    for (let i = 0; i < 36 + l * 6; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.2 + 0.7 + l * 0.4,
        a: Math.random() * Math.PI * 2,
        tw: Math.random() * 0.8 + 0.3,
        layer: layers[l],
        color: colors[l]
      });
    }
  }
}
createStars();
window.addEventListener('resize', createStars);

function drawStars() {
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  for (const star of stars) {
    star.a += 0.015 + star.tw * 0.009;
    let alpha = 0.6 + Math.sin(star.a) * 0.37;
    let px = star.x + Math.sin(star.a * 0.11) * 6 * star.layer;
    let py = star.y + Math.cos(star.a * 0.13) * 3.5 * star.layer;
    starsCtx.beginPath();
    starsCtx.arc(px, py, star.r, 0, Math.PI * 2);
    starsCtx.fillStyle = `rgba(${star.color === '#fff' ? '255,255,255' : star.color === '#aef' ? '170,238,255' : '255,238,238'},${alpha})`;
    starsCtx.shadowColor = star.color;
    starsCtx.shadowBlur = 10 * star.layer;
    starsCtx.fill();
    starsCtx.shadowBlur = 0;
  }
  requestAnimationFrame(drawStars);
}
drawStars();

// --- CUTE CHARACTER DRAW ---
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

// --- SMOOTH HEART DRAW ---
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

// --- HEART ARC SCENE ---
function heartArcScene(ctx, w, h, frame) {
  drawStars(ctx, heartArcScene.stars, w, h);
  drawCharacter(ctx, 50, h - 65, 'right');
  drawCharacter(ctx, w - 50, h - 65, 'left');
  let n = 22;
  for (let i = 0; i < n; i++) {
    let t = i / (n - 1);
    let x1 = 50, y1 = h - 65;
    let x2 = w / 2, y2 = h * 0.33;
    let cx = w / 2 - 100, cy = h * 0.15;
    let bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
    let by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
    drawSmoothHeart(ctx, bx, by, 13, "#ff1361", Math.sin(frame * 0.07 + i) * 0.4);
    x1 = w - 50;
    x2 = w / 2;
    cx = w / 2 + 100;
    bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
    by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
    drawSmoothHeart(ctx, bx, by, 13, "#ff1361", Math.sin(frame * 0.07 + i + 1) * 0.4);
  }
}

// --- HEART SHAPE SCENE ---
function heartShapeScene(ctx, w, h, frame) {
  drawStars(ctx, heartShapeScene.stars, w, h);
  drawCharacter(ctx, 60, h - 65, 'right', true);
  drawCharacter(ctx, w - 60, h - 65, 'left', true);
  ctx.save();
  ctx.font = "bold 44px Arial Rounded MT Bold, Arial, sans-serif";
  ctx.fillStyle = "#ff6ec7";
  ctx.textAlign = "center";
  ctx.shadowColor = "#ff1361";
  ctx.shadowBlur = 16;
  ctx.fillText("Te amo", w / 2, h * 0.18);
  ctx.restore();
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

// --- SCENE SWITCHER ---
function runAnimation() {
  const canvas = document.getElementById("surprise-canvas");
  const w = canvas.width = window.innerWidth;
  const h = canvas.height = window.innerHeight;
  heartArcScene.stars = createStars(w, h);
  heartShapeScene.stars = heartArcScene.stars;
  let frame = 0;
  let scene = 0;
  let switchTime = 220;
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

// --- BUTTON LOGIC ---
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

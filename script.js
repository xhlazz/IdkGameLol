// --- Retro Obby Monster-Killer ---
// Basic web game demo (Vanilla JS, no frameworks)

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gui = {
  health: document.getElementById('gui-health'),
  lives: document.getElementById('gui-lives'),
  level: document.getElementById('gui-level'),
  score: document.getElementById('gui-score'),
};
const menu = document.getElementById('main-menu');
const startBtn = document.getElementById('start-btn');
const characterDivs = document.querySelectorAll('.character');

let currentCharacter = "melkin";
let gameState = "menu"; // menu, playing, gameover
let assets = {};
let player, monsters, level, score, health, lives, currentLevel;

// --- ASSET LOADING ---
function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.src = src;
    img.onload = () => res(img);
    img.onerror = rej;
  });
}

async function loadAssets() {
  assets.melkin = await loadImage('assets/characters/melkin.png');
  assets.monster1 = await loadImage('assets/monsters/monster1.png');
}

// --- GAME OBJECTS ---
function resetPlayer() {
  player = {
    x: 32, y: 208, vx: 0, vy: 0,
    w: 16, h: 24,
    dir: 1,
    onGround: false,
    attackFrame: 0,
    character: currentCharacter,
  };
  health = 3;
}

function resetMonsters(monsterDefs) {
  monsters = monsterDefs.map(def => ({
    x: def.x,
    y: def.y,
    w: 16,
    h: 16,
    type: def.type,
    hp: 1,
    dir: Math.random() < 0.5 ? -1 : 1,
    alive: true,
  }));
}

function loadLevel(n) {
  // For demo: 2 hardcoded levels. Make more in real game!
  currentLevel = n;
  const levels = [
    {
      tiles: [
        "........................",
        "........................",
        "...................M....",
        "........................",
        ".............####.......",
        "........................",
        "......###...............",
        "........................",
        "########################"
      ],
      monsters: [{x: 320, y: 176, type: 'monster1'}]
    },
    {
      tiles: [
        "........................",
        "........................",
        "....................M...",
        "....................#...",
        "............#####.......",
        "........................",
        ".....###.........###....",
        "........................",
        "########################"
      ],
      monsters: [{x: 380, y: 128, type: 'monster1'}]
    }
  ];
  let lvl = levels[n % levels.length];
  level = lvl;
  resetPlayer();
  resetMonsters(lvl.monsters);
}

// --- INPUT HANDLING ---
const keys = {};
window.addEventListener('keydown', e => {
  keys[e.code] = true;
});
window.addEventListener('keyup', e => {
  keys[e.code] = false;
});

// --- GAME LOOP ---
function update() {
  if (gameState !== "playing") return;

  // Movement
  let speed = 2;
  if (keys['ArrowLeft']) { player.vx = -speed; player.dir = -1; }
  else if (keys['ArrowRight']) { player.vx = speed; player.dir = 1; }
  else player.vx = 0;

  // Jump
  if (keys['Space'] && player.onGround) {
    player.vy = -6;
    player.onGround = false;
  }

  // Gravity
  player.vy += 0.35;
  player.y += player.vy;
  player.x += player.vx;

  // Collision (simplified)
  let ground = 232;
  if (player.y + player.h > ground) {
    player.y = ground - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  // Obby tiles
  for (let y = 0; y < level.tiles.length; ++y) {
    for (let x = 0; x < level.tiles[0].length; ++x) {
      if (level.tiles[y][x] === "#") {
        let tx = x * 16, ty = y * 16;
        if (rectsCollide(player, {x: tx, y: ty, w: 16, h: 16})) {
          // Push player up
          if (player.vy > 0) {
            player.y = ty - player.h;
            player.vy = 0;
            player.onGround = true;
          } else if (player.vy < 0) {
            player.y = ty + 16;
            player.vy = 0;
          }
        }
      }
    }
  }

  // Attack
  if (keys['KeyZ'] && player.attackFrame === 0) {
    player.attackFrame = 10;
  }
  if (player.attackFrame > 0) player.attackFrame--;

  // Monster logic
  for (const m of monsters) {
    if (!m.alive) continue;
    m.x += m.dir * 1;
    if (Math.random() < 0.01) m.dir *= -1;

    // Collide with player
    if (rectsCollide(player, m)) {
      if (player.attackFrame > 0 && Math.abs(player.x - m.x) < 20) {
        m.hp -= 1;
        if (m.hp <= 0) {
          m.alive = false;
          score += 100;
        }
      } else {
        health -= 1;
        if (health <= 0) {
          lives -= 1;
          if (lives > 0) {
            resetPlayer();
          } else {
            gameState = "gameover";
          }
        }
      }
    }
  }

  // Level end: reach far right
  if (player.x > 480) {
    loadLevel(currentLevel + 1);
    score += 500;
  }
}

function draw() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "#384c6d";
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

  // Tiles
  for (let y = 0; y < level.tiles.length; ++y) {
    for (let x = 0; x < level.tiles[0].length; ++x) {
      let t = level.tiles[y][x];
      if (t === "#") {
        ctx.fillStyle = "#666";
        ctx.fillRect(x*16, y*16, 16, 16);
        ctx.strokeStyle = "#888";
        ctx.strokeRect(x*16, y*16, 16, 16);
      }
    }
  }

  // Monsters
  for (const m of monsters) {
    if (!m.alive) continue;
    ctx.drawImage(assets.monster1, m.x, m.y, m.w, m.h);
  }

  // Player
  drawPlayer();

  // GUI
  gui.health.textContent = "♥ ".repeat(health);
  gui.lives.textContent = `Lives: ${lives}`;
  gui.level.textContent = `Level ${currentLevel+1}/50`;
  gui.score.textContent = `Score: ${score}`;
}

function drawPlayer() {
  if (player.character === "melkin") {
    ctx.drawImage(assets.melkin, player.x, player.y, player.w, player.h);
    if (player.attackFrame > 0) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(player.x + player.dir*16, player.y+8, 8, 8);
    }
  }
}

function gameLoop() {
  if (gameState === "playing") {
    update();
    draw();
  } else if (gameState === "gameover") {
    ctx.fillStyle = "#000a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "24px monospace";
    ctx.fillText("GAME OVER", 170, 160);
    ctx.font = "12px monospace";
    ctx.fillText("Refresh page to play again", 165, 195);
  }
  requestAnimationFrame(gameLoop);
}

// --- UTILS ---
function rectsCollide(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

// --- MENU AND GAME START ---
let selectedChar = "melkin";
characterDivs.forEach(div => {
  div.addEventListener('click', () => {
    characterDivs.forEach(d => d.classList.remove('selected'));
    div.classList.add('selected');
    selectedChar = div.dataset.char;
  });
});
startBtn.addEventListener('click', async () => {
  await loadAssets();
  menu.style.display = "none";
  canvas.style.display = "block";
  document.getElementById('gui').style.display = "flex";
  currentCharacter = selectedChar;
  score = 0; lives = 3;
  loadLevel(0);
  gameState = "playing";
  gameLoop();
});

// --- INIT ---
window.onload = () => {
  characterDivs[0].classList.add('selected');
};

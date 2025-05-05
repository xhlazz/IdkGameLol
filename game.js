const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
let yesChance = 75;
let noChance = 25;
let targets = [];
let boosters = [];
let particles = [];
let pugReaction = "";
let gameRunning = true;

// Utility functions
const random = (min, max) => Math.random() * (max - min) + min;

// Classes
class Target {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // "yes" or "no"
    this.radius = 30;
    this.dx = random(-2, 2);
    this.dy = random(-2, 2);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.type === "yes" ? "#28a745" : "#dc3545";
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    // Bounce off walls
    if (this.x < this.radius || this.x > canvas.width - this.radius) this.dx *= -1;
    if (this.y < this.radius || this.y > canvas.height - this.radius) this.dy *= -1;

    this.draw();
  }
}

class Booster {
  constructor(x, y, effect) {
    this.x = x;
    this.y = y;
    this.effect = effect; // "increaseYes" or "decreaseNo"
    this.radius = 20;
    this.dy = random(1, 3);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.effect === "increaseYes" ? "#007bff" : "#ffc107";
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.y += this.dy;

    // Remove booster if it goes off screen
    if (this.y > canvas.height + this.radius) {
      boosters.splice(boosters.indexOf(this), 1);
    }

    this.draw();
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = random(2, 5);
    this.color = color;
    this.dx = random(-2, 2);
    this.dy = random(-2, 2);
    this.life = 50;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.life -= 1;
    this.draw();
  }
}

// Game functions
const spawnTargets = () => {
  targets.push(new Target(random(50, canvas.width - 50), random(50, canvas.height - 50), "yes"));
  targets.push(new Target(random(50, canvas.width - 50), random(50, canvas.height - 50), "no"));
};

const spawnBooster = () => {
  const effect = Math.random() > 0.5 ? "increaseYes" : "decreaseNo";
  boosters.push(new Booster(random(50, canvas.width - 50), -30, effect));
};

const explodeParticles = (x, y, color) => {
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(x, y, color));
  }
};

const checkCollision = (x, y, obj) => {
  return Math.hypot(x - obj.x, y - obj.y) < obj.radius;
};

const updateChancesDisplay = () => {
  document.getElementById("chances").textContent = `Yes: ${yesChance}% | No: ${noChance}%`;
};

const decidePugStream = () => {
  const randomNumber = Math.random() * 100;
  pugReaction = randomNumber < yesChance ? "Yes! 🐶🎥" : "No 😴";
  document.getElementById("result").textContent = `Pug Streaming Today? ${pugReaction}`;
};

// Handle clicks
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  targets.forEach((target, index) => {
    if (checkCollision(mouseX, mouseY, target)) {
      explodeParticles(target.x, target.y, target.type === "yes" ? "#28a745" : "#dc3545");
      decidePugStream();
      gameRunning = false;
    }
  });

  boosters.forEach((booster, index) => {
    if (checkCollision(mouseX, mouseY, booster)) {
      explodeParticles(booster.x, booster.y, booster.effect === "increaseYes" ? "#007bff" : "#ffc107");
      if (booster.effect === "increaseYes" && yesChance < 100) yesChance += 5;
      if (booster.effect === "decreaseNo" && noChance > 0) noChance -= 5;
      boosters.splice(index, 1);
      updateChancesDisplay();
    }
  });
});

// Game loop
const gameLoop = () => {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  targets.forEach((target) => target.update());
  boosters.forEach((booster) => booster.update());
  particles.forEach((particle, index) => {
    if (particle.life <= 0) particles.splice(index, 1);
    else particle.update();
  });

  requestAnimationFrame(gameLoop);
};

// Initialize game
spawnTargets();
setInterval(spawnBooster, 5000);
updateChancesDisplay();
gameLoop();

const homeScreen = document.getElementById("homeScreen");
const gameUI = document.getElementById("gameUI");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const homeBtn = document.getElementById("homeBtn");
const restartBtn = document.getElementById("restartBtn");

let player = document.getElementById("player");
let score = 0;
let playerX = 180;
let bullets = [];
let enemies = [];
let paused = false;
let gameOver = false;
let animationFrame;
let enemyInterval;
let selectedShip = "🚀"; // Default ship

// ----- Player selection -----
const shipButtons = document.querySelectorAll(".ship-btn");
shipButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    shipButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedShip = btn.dataset.ship;
  });
});

// ----- Start Game -----
function startGame() {
  homeScreen.classList.add("hidden");
  gameUI.classList.remove("hidden");

  gameArea.innerHTML = `<div id="player">${selectedShip}</div>`;
  player = document.getElementById("player");
  player.style.left = playerX + "px";
  player.style.bottom = "20px";
  player.style.position = "absolute";

  score = 0;
  scoreDisplay.textContent = score;
  bullets = [];
  enemies = [];
  paused = false;
  gameOver = false;

  if (enemyInterval) clearInterval(enemyInterval);
  enemyInterval = setInterval(createEnemy, 1200);

  update();
}

// ----- Pause Game -----
function pauseGame() {
  paused = !paused;
  pauseBtn.textContent = paused ? "▶️ Resume" : "⏸ Pause";
  if (!paused) update();
}

// ----- Home Button -----
function goHome() {
  cancelAnimationFrame(animationFrame);
  clearInterval(enemyInterval);
  bullets = [];
  enemies = [];

  // Reset area and return to home
  gameArea.innerHTML = `<div id="player">${selectedShip}</div>`;
  player = document.getElementById("player");
  player.style.left = "180px";
  player.style.bottom = "20px";

  homeScreen.classList.remove("hidden");
  gameUI.classList.add("hidden");
}

// ----- Player Controls -----
document.addEventListener("keydown", (e) => {
  if (gameOver || paused) return;
  if (e.key === "ArrowLeft" && playerX > 0) {
    playerX -= 20;
    player.style.left = playerX + "px";
  } else if (e.key === "ArrowRight" && playerX < 360) {
    playerX += 20;
    player.style.left = playerX + "px";
  } else if (e.key === " ") {
    shoot();
  }
});

// ----- Event Listeners -----
startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
homeBtn.addEventListener("click", goHome);

// ----- Shooting -----
function shoot() {
  const bullet = document.createElement("div");
  bullet.classList.add("bullet");
  bullet.style.left = playerX + 20 + "px";
  bullet.style.bottom = "60px";
  bullet.textContent = "💥";
  gameArea.appendChild(bullet);
  bullets.push(bullet);
}

// ----- Enemies -----
function createEnemy() {
  if (paused || gameOver) return;
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.top = "0px";
  enemy.style.left = Math.floor(Math.random() * 360) + "px";

  const enemyTypes = ["👾", "🛸", "☄️", "🌑", "🛰️"];
  enemy.textContent = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

  gameArea.appendChild(enemy);
  enemies.push(enemy);
}

// ----- Game Update Loop -----
function update() {
  if (gameOver || paused) return;

  // Move bullets
  bullets.forEach((b, i) => {
    let bottom = parseInt(b.style.bottom);
    if (bottom > 600) {
      b.remove();
      bullets.splice(i, 1);
    } else {
      b.style.bottom = bottom + 10 + "px";
    }
  });

  // Move enemies
  enemies.forEach((enemy, ei) => {
    let top = parseInt(enemy.style.top);
    if (top > 560) {
      endGame();
    } else {
      enemy.style.top = top + 3 + "px";
    }

    // Collision check
    bullets.forEach((bullet, bi) => {
      const bRect = bullet.getBoundingClientRect();
      const eRect = enemy.getBoundingClientRect();
      if (
        bRect.left < eRect.right &&
        bRect.right > eRect.left &&
        bRect.top < eRect.bottom &&
        bRect.bottom > eRect.top
      ) {
        enemy.remove();
        bullet.remove();
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score++;
        scoreDisplay.textContent = score;
      }
    });
  });

  animationFrame = requestAnimationFrame(update);
}

// ----- End Game -----
function endGame() {
  gameOver = true;
  cancelAnimationFrame(animationFrame);
  clearInterval(enemyInterval);
  alert("💥 Game Over! Final Score: " + score);
  goHome();
}

function restartGame() {
  cancelAnimationFrame(animationFrame);
  clearInterval(enemyInterval);
  bullets = [];
  enemies = [];
  score = 0;
  scoreDisplay.textContent = score;
  playerX = 180;

  // Reset game area and player
  gameArea.innerHTML = `<div id="player">${selectedShip}</div>`;
  player = document.getElementById("player");
  player.style.left = playerX + "px";
  player.style.bottom = "20px";

  paused = false;
  gameOver = false;

  // Restart enemy creation
  enemyInterval = setInterval(createEnemy, 1200);
  update();
}

restartBtn.addEventListener("click", restartGame);

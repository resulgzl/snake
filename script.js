const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 30;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let food = randomPosition();
let foodEaten = 0;
let gameOver = false;
let lightEffect = false;
let lightColor = getRandomColor();
let timeLeft = 30;
let gameInterval;
let timerInterval;
let username = "";

// Yılan ve Yemek Görselleri
const snakeImage = new Image();
const foodImage = new Image();
snakeImage.src = "images/snake_head.jpg";  // snake_head.jpg olarak değiştirildi
foodImage.src = "images/food.jpg";  // food.jpg olarak değiştirildi

// Ses Efekti
const eatSound = new Audio("sounds/eat.mp3");

// Oyun Başlatma
document.getElementById("startButton").addEventListener("click", () => {
  username = document.getElementById("usernameInput").value;
  if (username.trim() === "") username = "Bilinmeyen Kullanıcı";  // Boş kullanıcı adı kontrolü
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("gameContainer").classList.remove("hidden");
  document.getElementById("usernameDisplay").textContent = `Merhaba, ${username}!`;
  startGame();
});

function startGame() {
  food = randomPosition();
  foodEaten = 0;
  gameOver = false;
  timeLeft = 30;

  gameInterval = setInterval(gameLoop, 200);
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  document.getElementById("timer").textContent = timeLeft;
  if (timeLeft <= 0) endGame();
}

function randomPosition() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize)),
  };
}

function getRandomColor() {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A5", "#FFC300", "#8E44AD"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function changeDirection(x, y) {
  direction = { x, y };
}

function update() {
  if (gameOver) return;

  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (head.x < 0) head.x = canvas.width / gridSize - 1;
  else if (head.x >= canvas.width / gridSize) head.x = 0;

  if (head.y < 0) head.y = canvas.height / gridSize - 1;
  else if (head.y >= canvas.height / gridSize) head.y = 0;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = randomPosition();
    foodEaten++;
    lightEffect = true;
    lightColor = getRandomColor();
    eatSound.play();  // Yemek yediğinde ses çal
    setTimeout(() => (lightEffect = false), 100);
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (lightEffect) {
    ctx.fillStyle = lightColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  snake.forEach((segment) => ctx.drawImage(snakeImage, segment.x * gridSize, segment.y * gridSize, gridSize, gridSize));
  ctx.drawImage(foodImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  document.getElementById("score").textContent = `Yemek Sayısı: ${foodEaten}`;
}

function gameLoop() {
  update();
  draw();
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  alert(`Oyun bitti! Skorun: ${foodEaten}`);
  location.reload();
}

const canvas = document.getElementById('game-canvas');
canvas.width = 600;
canvas.height = 400;
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const scoreElem = document.getElementById('score');

const CELL_SIZE = 10;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const NUM_COLS = CANVAS_WIDTH / CELL_SIZE;
const NUM_ROWS = CANVAS_HEIGHT / CELL_SIZE;

let snake = [{x: 5, y: 5}];
let food = {};
let score = 0;
let direction = 'right';
let isPaused = false;
let intervalId;

function init() {
  createFood();
  drawSnake();
  startBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', pauseGame);
  resumeBtn.addEventListener('click', resumeGame);
  document.addEventListener('keydown', handleKeyDown);
}

function createFood() {
  food = {
    x: Math.floor(Math.random() * NUM_COLS),
    y: Math.floor(Math.random() * NUM_ROWS)
  };
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawSnake() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  snake.forEach(segment => {
    ctx.fillStyle = 'green';
    ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  });
  drawFood();
}

function moveSnake() {
  const head = snake[0];
  let newHead;
  switch (direction) {
    case 'right':
      newHead = {x: head.x + 1, y: head.y};
      break;
    case 'down':
      newHead = {x: head.x, y: head.y + 1};
      break;
    case 'left':
      newHead = {x: head.x - 1, y: head.y};
      break;
    case 'up':
      newHead = {x: head.x, y: head.y - 1};
      break;
  }
  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    scoreElem.textContent = `Score: ${score}`;
    createFood();
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
}

function isGameOver() {
  const head = snake[0];
  return (
    head.x < 0 ||
    head.x >= NUM_COLS ||
    head.y < 0 ||
    head.y >= NUM_ROWS ||
    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
  );
}

function startGame() {
  if (intervalId) {
    clearInterval(intervalId);
  }
  isPaused = false;
  score = 0;
  scoreElem.textContent = `Score: ${score}`;
  // Update the initial position of the snake
  snake = [
    { x: NUM_COLS / 2, y: NUM_ROWS / 2 },
    { x: NUM_COLS / 2 - 1, y: NUM_ROWS / 2 }
  ];
  createFood();
  intervalId = setInterval(() => {
    if (!isPaused) {
      moveSnake();
      drawSnake();
      if (isGameOver()) {
        clearInterval(intervalId);
        alert('Game over!');
      }
    }
  }, 50);
}


function pauseGame() {
  isPaused = true;
}

function resumeGame() {
  isPaused = false;
}

function handleKeyDown(event) {
  switch (event.code) {
    case 'ArrowRight':
      if (direction !== 'left') {
        direction = 'right';
      }
      break;
    case 'ArrowDown':
      if (direction !== 'up') {
        direction = 'down';
      }
      break;
    case 'ArrowLeft':
      if (direction !== 'right') {
        direction = 'left';
      }
      break;
    case 'ArrowUp':
      if (direction !== 'down') {
        direction = 'up';
      }
      break;
  }
}

init();

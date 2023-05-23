// Constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 3;
const INITIAL_DELAY = 200;
const COLORS = ['red', 'green', 'blue'];

const eating=new Audio("eating.mp3");
const themesong=new Audio("themesong.mp3");
const gameOverSound = new Audio('gameover.mp3');

// Game state
let snake = [];
let direction = 'right';
let food = [];
let score = 0;
let timer = 60;
let intervalId;
let delay = INITIAL_DELAY;

// Get DOM elements
const gameGrid = document.getElementById('game-grid');
const scoreValue = document.getElementById('score-value');
const timerValue = document.getElementById('timer-value');
const hiscoreValue=document.getElementById('hiscore-value')

// Create initial snake
function createSnake() {
  const startX = Math.floor(GRID_SIZE / 2);
  const startY = Math.floor(GRID_SIZE / 2);

  for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
    snake.push({ x: startX - i, y: startY });
  }
}
function generatefood(){
  //location
  for(let i=0;i<3;i++){
    X=Math.floor(Math.random()*GRID_SIZE);
    Y=Math.floor(Math.random()*GRID_SIZE);
    food.push({x:X,y:Y})}
    console.log(food)
}
function displayfood(){
  //Display food
  for(let i=0;i<3;i++){
    const fsegment=document.createElement('div');
    fsegment.style.gridRowStart=food[i].y+1;
    fsegment.style.gridColumnStart=food[i].x+1;
    fsegment.style.backgroundColor=COLORS[i];
    fsegment.style.width = `${CELL_SIZE}px`;
    fsegment.style.height = `${CELL_SIZE}px`;
    console.log(fsegment);
    fsegment.classList.add('fsegment')
    gameGrid.appendChild(fsegment);
    
  }
}



// Check if the snake has collided with the walls or itself
function checkCollision() {
  const head = snake[0];

  // Check collision with walls
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    return true;
  }

  // Check collision with itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

// Update the game grid with snake and food positions
function updateGrid() {
  gameGrid.innerHTML = '';

  // Draw snake
  snake.forEach((segment) => {
    const snakeSegment = createSegment();
    snakeSegment.style.gridColumnStart = segment.x + 1;
    snakeSegment.style.gridRowStart = segment.y + 1;
    snakeSegment.style.width = `${CELL_SIZE}px`;
    snakeSegment.style.height = `${CELL_SIZE}px`;
    gameGrid.appendChild(snakeSegment);
  });
  //Display food
  displayfood();
}

// Create a segment for the snake or food
function createSegment() {
  const segment = document.createElement('div'); 
  segment.classList.add('segment')
  return segment;
}

// Handle user input to change snake direction
function handleInput(event) {
  const key = event;

  if (key === 'ArrowUp' && direction !== 'down') {
    direction = 'up';
  } else if (key === 'ArrowDown' && direction !== 'up') {
    direction = 'down';
  } else if (key === 'ArrowLeft' && direction !== 'right') {
    direction = 'left';
  } else if (key === 'ArrowRight' && direction !== 'left') {
    direction = 'right';
  }
}

// Move the snake
function moveSnake() {
  const head = { ...snake[0] };

  // Update head position based on direction
  if (direction === 'up') {
    head.y--;
  } else if (direction === 'down') {
    head.y++;
  } else if (direction === 'left') {
    head.x--;
  } else if (direction === 'right') {
    head.x++;
  }

  // Add new head to the snake
  snake.unshift(head);

  // Check if the snake has collided with any food segment
  let foodEatenIndex = -1;

  for (let i = 0; i < food.length; i++) {
    if (head.x === food[i].x && head.y === food[i].y) {
        foodEatenIndex = i;
        break;      
    }
  }

  if (foodEatenIndex !== -1) {
    

    // Remove the eaten food segment
    food.splice(foodEatenIndex, 1);

    // Check if all food segments have been eaten
    if (food.length === 0) {
        // Increase score
      score++;timer=timer+3
      scoreValue.textContent = score;
      timerValue.textContent=timer;
      delay--;
      // Generate new food segments
      generatefood();
      //Display new food segment
      displayfood();
    }

    //Increase snake length
      const tail = { ...snake[snake.length - 1] };
      snake.push(tail);

    // Increase delay to make the game faster
    delay -= 5;
  } else {
    // Remove tail segment
    snake.pop();
  }

  // Check for collision
  if (checkCollision()) {
    gameOverSound.play();
    themesong.pause();
    clearInterval(intervalId);
    alert('Game Over! Your score: ' + score);
    let hiscoreval=0; 
    if(score>hiscoreval){
      hiscoreval = score;
      const playerName = prompt('Game Over! Enter your name:');
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreValue.textContent=hiscoreval;
      alert('congrats  '+playerName+' for new highscore')
      resetGame();
    }
    else{
      resetGame();}
  };

  // Update game grid
  updateGrid();
}

// Reset the game state
function resetGame() {
  snake = [];
  direction = 'right';
  score = 0;timer=60;
  delay = INITIAL_DELAY;
  food = [];

  createSnake();
  
  generatefood();
  updateGrid();
  
  checkCollision();
  
  
  moveSnake();
  updateTimer();
  scoreValue.textContent = score;
  timerValue.textContent = timer;
  themesong.play();
  intervalId = setInterval(moveSnake, delay);
}

// Start the game
function startGame() {
  createSnake();
  generatefood();
  updateGrid();
  
  console.log(food)
  
  checkCollision();
  
  
  moveSnake();
  updateTimer();
  scoreValue.textContent = score;
  timerValue.textContent = timer;
  themesong.play();
  intervalId = setInterval(moveSnake, delay);
}


// Handle game timer
function updateTimer() {
  timer--;
  timerValue.textContent = timer;

  if (timer <= 0) {
    gameOverSound.play();
    themesong.pause();
    clearInterval(intervalId);
    alert('Game Over! Your score: ' + score);
    let hiscoreval=0;  
    if(score>hiscoreval){
      const playerName = prompt('Game Over! Enter your name:');
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreValue.textContent=hiscoreval+" by "+playerName;
      alert('congrats  '+playerName+' for new highscore')
    }
        
    resetGame();
  };
};

// Event listeners
document.addEventListener('keydown', handleInput);

// Start the game
startGame();

// Start the timer
setInterval(updateTimer, 1000);

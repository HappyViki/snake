// Setup game board

const gameSize = 5;

let html = '';
for (let y = -gameSize; y <= gameSize; y++) {
    html += '<div class="row">';
    for (let x = -gameSize; x <= gameSize; x++) {
        html += `<div id="${'x'+x+'y'+y}" class="box" x="${x}" y="${y}"></div>`;
    }
    html += '</div>';
}
gameBoard.innerHTML = html;

// Set vars

let gameOver = false;
const highscore = 54;
let points = 0;
let food = {x:0,y:0}
let snake = [
    {
        x: 0,
        y: 0
    }
];

// Functions

const populateFood = () => {
    const randLocation = () => (Math.floor(Math.random() * gameSize) * (Math.random() < 0.5 ? -1 : 1));
    food = { x: randLocation(), y: randLocation()}
    
    document.querySelector('#x' + food.x + 'y' + food.y).classList.add("food");
};

const eat = () => {
    points++;
    pointsEl.innerHTML = points;
    document.querySelector('#x' + food.x + 'y' + food.y).classList.remove("food");
    populateFood()
};

const moveSnakePosition = (x, y) => {   
    const newSnakeHead = { x: snake[0].x + x, y: snake[0].y + y }
    const oldTailTip = snake[snake.length - 1]

    // validate
    const touchingItself = snake.slice(1, snake.length).some(s => {
        return (s.x === newSnakeHead.x) && (s.y === newSnakeHead.y)
    });

    if (gameOver) {
        return;
    }
    
    if (touchingItself || (newSnakeHead.x < -5) || (newSnakeHead.x > 5) || (newSnakeHead.y < -5) || (newSnakeHead.y > 5)) {
        gameOver = true;
        gameBoard.innerHTML += "<h2>Game Over Dude!</h2>";
        return;
    }

    // set snake location
    let newSnakeTail = snake.slice(1,snake.length).map((s,i)=>{        
        return {
            x: snake[i].x,
            y: snake[i].y
        }
    })
    
    snake = [newSnakeHead, ...newSnakeTail]

    // remove old snake
    document.querySelectorAll('.snake').forEach(el => el.classList.remove("snake"));

    // add new snake
    snake.map(s => document.querySelector('#x' + s.x + 'y' + s.y)).forEach(el => el.classList.add("snake"));

    // points
    if ((snake[0].x === food.x) && (snake[0].y === food.y)) {
        eat();
        snake.push(oldTailTip)
    }
};

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        e.preventDefault();
        moveSnakePosition(0,-1);
    }
    else if (e.keyCode == '40') {
        // down arrow
        e.preventDefault();
        moveSnakePosition(0,1);
    }
    else if (e.keyCode == '37') {
        // left arrow
        e.preventDefault();
        moveSnakePosition(-1,0);
    }
    else if (e.keyCode == '39') {
        // right arrow
        e.preventDefault();
        moveSnakePosition(1,0);
    }

}

// Mobile friendly
up.addEventListener("pointerdown", () => moveSnakePosition(0, -1) )
down.addEventListener("pointerdown", () => moveSnakePosition(0, 1))
left.addEventListener("pointerdown", () => moveSnakePosition(-1, 0))
right.addEventListener("pointerdown", () => moveSnakePosition(1, 0))

// Play!
populateFood();
moveSnakePosition(0, 0);
document.onkeydown = checkKey;

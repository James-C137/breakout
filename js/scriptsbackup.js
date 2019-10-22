// --------------- VARIABLES ---------------
var canvas = document.getElementById("canvasId");
var ctx = canvas.getContext("2d");

var started = false;
var ballRadius = 16;
var paddleWidth = 140;
var paddleHeight = 16;
var paddleSpeed = 10;
var numCols = 8;
var numRows = 5;
var shadowOffset = 3;
var mainColor = '#ffa726'
var subColor = '#c77800'
var bgColor = '#ffd95b'
var timer = 0;

var brickPadding = 16;
var brickMarginX = canvas.width / 16;
var brickMarginY = canvas.height / 10;
var brickX = (canvas.width - (brickMarginX * 2)) / numCols;
var brickY = (canvas.height - (brickMarginY * 2)) / (numRows * 2);
var brickW = brickX - brickPadding;
var brickH = brickY - brickPadding;

var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = canvas.height - paddleHeight - 16;
var ballX = canvas.width / 2;
var ballY = paddleY;

var brickArray = new Array(numCols);
for (a = 0; a < numCols; a++) {
    brickArray[a] = new Array(numRows);
}

var ballAngle = Math.PI / 4;
var ballSpeed = 6;
var velocityX = ballSpeed * (Math.cos(ballAngle));
var velocityY = ballSpeed * (Math.sin(ballAngle));

var leftPressed = false;
var rightPressed = false;

var lives = 3;
var score = 0;
var finalScore = 0;
var numBricks = numCols * numRows;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// --------------- FUNCTIONS ---------------
function keyDownHandler(e) {
    //    window.alert(e.keyCode);
    if (e.keyCode === 37) {
        leftPressed = true;
    }
    if (e.keyCode === 39) {
        rightPressed = true;
    }
    // if (e.keyCode === 13) {
    //     started = true;
    // }
}

function keyUpHandler(e) {
    //    window.alert(e.keyCode);
    if (e.keyCode === 37) {
        leftPressed = false;
    }
    if (e.keyCode === 39) {
        rightPressed = false;
    }
    // if (e.keyCode === 13) {
    //     started = true;
    // }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = mainColor;
    ctx.closePath();
    ctx.fill();
}

function drawPaddle() {
    ctx.fillStyle = mainColor;
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

function drawBrick() {
    for (x = 0; x < numCols; x++) {
        for (y = 0; y < numRows; y++) {
            if (brickArray[x][y] === 1) {
                // ctx.shadowColor = 'black';
                // ctx.shadowOffsetY = shadowOffset;
                // ctx.shadowOffsetX = shadowOffset;
                ctx.shadowBlur = 4;
                ctx.fillStyle = mainColor;
                ctx.fillRect((brickX * x) + brickMarginX + (brickPadding / 2), (brickY * y) + brickMarginY, brickW, brickH)
            }
        }
    }
}

function drawBackground() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawShadow() {
    for (x = 0; x < numCols; x++) {
        for (y = 0; y < numRows; y++) {
            if (brickArray[x][y] === 1) {
                ctx.fillStyle = subColor;
                ctx.fillRect((brickX * x) + brickMarginX + (brickPadding / 2) + shadowOffset, (brickY * y) + brickMarginY + shadowOffset, brickW, brickH)
            }
            ctx.fillRect(paddleX + shadowOffset, paddleY + shadowOffset, paddleWidth, paddleHeight);
            ctx.beginPath();
            ctx.arc(ballX + (shadowOffset / 2), ballY + (shadowOffset / 2), ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = subColor;
            ctx.closePath();
            ctx.fill();
        }
    }
}

function drawScore() {
    ctx.font = '48px Ariel';
    ctx.fillStyle = subColor;
    ctx.fillText('Bricks: ' + score, (brickMarginX + 30), 50);
}

function drawLives() {
    ctx.font = '48px Orbitron';
    ctx.fillStyle = subColor;
    ctx.fillText('LIVES: ' + lives, 1.1 * brickMarginX, 50);
}

// function countBrick() {

// }

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function ballMove() {
    ballX = ballX + velocityX;
    ballY = ballY - velocityY;
}

function paddleMove() {
    if (rightPressed && paddleX <= canvas.width - paddleWidth)
        paddleX = paddleX + paddleSpeed;
    if (leftPressed && paddleX >= 0)
        paddleX = paddleX - paddleSpeed;
}

function updateVelocity() {
    velocityX = ballSpeed * (Math.cos(ballAngle));
    velocityY = ballSpeed * (Math.sin(ballAngle));
}

function hitDetection() {
    for (x = 0; x < numCols; x++) {
        for (y = 0; y < numRows; y++) {
            if (brickArray[x][y] === 1 && velocityY > 0 && ((ballX >= (brickX * x) + brickMarginX + (brickPadding / 2) && ballX <= (brickX * x) + brickMarginX + (brickPadding / 2) + brickW) && (ballY >= (brickY * y) + brickMarginY + (brickH / 2) && ballY <= (brickY * y) + brickMarginY + brickH + ballRadius))) {
                velocityY = -velocityY
                brickArray[x][y] = 0;
                score++;
                numBricks--;
            }
            if (brickArray[x][y] === 1 && velocityY < 0 && ((ballX >= (brickX * x) + brickMarginX + (brickPadding / 2) && ballX <= (brickX * x) + brickMarginX + (brickPadding / 2) + brickW) && (ballY >= (brickY * y) + brickMarginY - ballRadius && ballY <= (brickY * y) + brickMarginY + (brickH / 2)))) {
                velocityY = -velocityY
                brickArray[x][y] = 0;
                score++;
                numBricks--;
            }
            if (brickArray[x][y] === 1 && velocityX > 0 && ((ballX >= (brickX * x) + brickMarginX + (brickPadding / 2) - ballRadius && ballX <= (brickX * x) + brickMarginX + (brickPadding / 2) + (brickW / 2)) && (ballY >= (brickY * y) + brickMarginY && ballY <= (brickY * y) + brickMarginY + brickH * 1.5))) {
                velocityX = -velocityX
                brickArray[x][y] = 0;
                score++;
                numBricks--;
            }
            if (brickArray[x][y] === 1 && velocityX < 0 && ((ballX >= (brickX * x) + brickMarginX + (brickW / 2) && ballX <= (brickX * x) + brickMarginX + brickW + (brickPadding / 2) + ballRadius) && (ballY >= (brickY * y) + brickMarginY && ballY <= (brickY * y) + brickMarginY + brickH * 1.5))) {
                velocityX = -velocityX
                brickArray[x][y] = 0;
                score++;
                numBricks--;
            }
        }
    }
}

function bounce() {
    if (ballX <= ballRadius || ballX >= canvas.width - ballRadius) {
        velocityX = -velocityX;
    }
    if (ballY <= ballRadius) {
        velocityY = -velocityY;
    }
    if (((ballY > paddleY - ballRadius && ballY < paddleY + paddleHeight - ballRadius) && (ballX >= paddleX - ballRadius && ballX <= paddleX + paddleWidth + ballRadius)) && (velocityY < 0)) {
        if (velocityX > 0) {
            ballAngle = (Math.PI / 2) * (1 - ((ballX - paddleX) / paddleWidth));
            if (ballAngle < Math.PI / 12) {
                ballAngle = Math.PI / 12;
            }
            if (ballAngle > Math.PI / 12 * 5) {
                ballAngle = Math.PI / 12 * 5
            }
            updateVelocity();
        }
        if (velocityX < 0) {
            ballAngle = ((Math.PI / 2) * (1 - ((ballX - paddleX) / paddleWidth))) + (Math.PI / 2);
            if (ballAngle < Math.PI / 12 * 7) {
                ballAngle = Math.PI / 12 * 7;
            }
            if (ballAngle > Math.PI / 12 * 11) {
                ballAngle = Math.PI / 12 * 11
            }
            updateVelocity();
        }
    }
}

function debugTool() {
    ctx.font = '48px Ariel';
    ctx.fillStyle = subColor;
    ctx.fillText(timer, (brickMarginX + 5), 500);
}

function storeArray() {
    for (x = 0; x < numCols; x++) {
        for (y = 0; y < numRows; y++) {
            brickArray[x][y] = 1;
        }
    }
}

// function menu() {
//
// }

function reset() {
    if (ballY > canvas.height) {
        finalScore = finalScore + score;
        score = 0;
        lives--;
        ballX = canvas.width / 2;
        ballY = paddleY;
        ballAngle = Math.PI / 4;
        // ballSpeed = 6;
        velocityX = ballSpeed * (Math.cos(ballAngle));
        velocityY = ballSpeed * (Math.sin(ballAngle));
        paddleX = (canvas.width - paddleWidth) / 2;
    }
    if (lives === 0) {
        finalScore = finalScore + (100000 / timer);
        window.alert('Game over! Your final score is: ' + Math.round(finalScore));
        finalScore = 0;
        lives = 3
        timer = 0;
        numBricks = numCols * numRows;
        storeArray();
    }
    if (numBricks === 0) {
        finalScore = finalScore + score;
        finalScore = finalScore * lives;
        finalScore = finalScore + (100000 / timer);
        window.alert('You win! Your final score is: ' + Math.round(finalScore));
        finalScore = 0;
        lives = 3
        timer = 0;
        numBricks = numCols * numRows;
        storeArray();
        ballX = canvas.width / 2;
        ballY = paddleY;
        ballAngle = Math.PI / 4;
        // ballSpeed = 6;
        velocityX = ballSpeed * (Math.cos(ballAngle));
        velocityY = ballSpeed * (Math.sin(ballAngle));
        paddleX = (canvas.width - paddleWidth) / 2;
    }
}

function run() {
    clearCanvas();
    timer++;

    hitDetection();
    bounce();
    reset();

    paddleMove();
    ballMove();

    drawBackground();
    drawLives();
    drawShadow();
    drawBall();
    drawPaddle();
    drawBrick();
    // drawScore();
    // debugTool();

    requestAnimationFrame(run);
}

// --------------- CALL FUNCTIONS ---------------
storeArray();
run();

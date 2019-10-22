// --------------- VARIABLES ---------------
var canvas = document.getElementById("canvasId");
var ctx = canvas.getContext("2d");

// game background stuff
var started = false;
var numCols = 8;
var numRows = 5;
var shadowOffset = 3;
var mainColor = '#81c784';
var subColor = '#519657';
var bgColor = '#b2fab4';
var timer = 0;
var lives = 3;
var score = 0;
var finalScore = 0;
var numBricks = numCols * numRows;
var leftPressed = false;
var rightPressed = false;

// brick stuff
var brickPadding = 16;
var brickMarginX = canvas.width / 16;
var brickMarginY = canvas.height / 10;
var brickX = (canvas.width - (brickMarginX * 2)) / numCols;
var brickY = (canvas.height - (brickMarginY * 2)) / (numRows * 2);
var brickW = brickX - brickPadding;
var brickH = brickY - brickPadding;
var brickArray = new Array(numCols);
for (a = 0; a < numCols; a++) {
    brickArray[a] = new Array(numRows);
}

// paddle
var paddleWidth = 140;
var paddleHeight = 16;
var paddleSpeed = 10;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = canvas.height - paddleHeight - 16;

// ball
var ballRadius = 16;
var ballX = canvas.width / 2;
var ballY = paddleY;
var ballSpeed = 6;
var ballAngle = Math.PI / 4;
var velocityX = ballSpeed * (Math.cos(ballAngle));
var velocityY = ballSpeed * (Math.sin(ballAngle));

var musicAlarm = new Audio('music/alarm.mp3');
var musicBounce = new Audio('music/bounce.mp3');
var musicNone = new Audio('music/normal1.mp3');
var musicNtwo = new Audio('music/normal2.mp3');
var musicFone = new Audio('music/faster1.mp3');
var musicFtwo = new Audio('music/faster2.mp3');
var musicFthree = new Audio('music/faster3.mp3');
var musicIone = new Audio('music/intense1.mp3');
var musicInitialized = false;
var musicPlaying = 0;
var credits = document.getElementById('musicCredits');

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

function drawLives() {
    ctx.font = '48px Orbitron';
    ctx.fillStyle = subColor;
    ctx.fillText('LIVES: ' + lives, 1.1 * brickMarginX, 50);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function ballMove() {
    ballX = ballX + velocityX;
    ballY = ballY - velocityY;
}

function paddleMove() {
    if (rightPressed && paddleX <= canvas.width - (paddleWidth / 2))
        paddleX = paddleX + paddleSpeed;
    if (leftPressed && paddleX >= 0 - (paddleWidth / 2))
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
    if ((ballX <= ballRadius && velocityX < 0) || (ballX >= canvas.width - ballRadius && velocityX > 0)) {
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

function increaseSpeed() {
    timer++;
    if(timer >= 600) {
       ballSpeed++;
       paddleSpeed++;
       timer = 0;
       }
       if(ballSpeed === 9){
           mainColor = '#ffe082';
           subColor = '#caae53';
           bgColor = '#ffffb3';
           canvas.style.borderColor = subColor;
           document.body.style.background = mainColor;
       }
       if(ballSpeed === 12){
           mainColor = '#ef9a9a';
           subColor = '#ba6b6c';
           bgColor = '#ffcccb';
           canvas.style.borderColor = subColor;
           document.body.style.background = mainColor;
       }
}

function setColors() {
    mainColor = '#81c784';
    subColor = '#519657';
    bgColor = '#b2fab4';
}

function speedAlert() {
    if (timer < 100 && ballSpeed != 6) {
        ctx.font = '48px Orbitron';
        ctx.fillStyle = subColor;
        ctx.fillText('Speed Increased!', (brickMarginX + 200), 400);
        musicCredits.style.color = subColor;
    }
    if (timer < 100 && ballSpeed === 9) {
        ctx.font = '48px Orbitron';
        ctx.fillStyle = subColor;
        ctx.fillText('Really fast!', (brickMarginX + 280), 450);
        musicCredits.style.color = subColor;
    }
    if (timer < 100 && ballSpeed === 12) {
        ctx.font = '48px Orbitron';
        ctx.fillStyle = subColor;
        ctx.fillText('Super fast!', (brickMarginX + 280), 450);
        musicCredits.style.color = subColor;
    }
}

function debugTool() {
    ctx.font = '48px Ariel';
    ctx.fillStyle = subColor;
    ctx.fillText(ballSpeed, (brickMarginX + 5), 500);
}

function storeArray() {
    for (x = 0; x < numCols; x++) {
        for (y = 0; y < numRows; y++) {
            brickArray[x][y] = 1;
        }
    }
}

function softReset() {
    score = 0;
    timer = 0;
    ballX = canvas.width / 2;
    ballY = paddleY;
    ballAngle = Math.PI / 4;
    ballSpeed = 6;
    velocityX = ballSpeed * (Math.cos(ballAngle));
    velocityY = ballSpeed * (Math.sin(ballAngle));
    paddleSpeed = 10;
    paddleX = (canvas.width - paddleWidth) / 2;
    setColors();
    document.body.style.background = mainColor;
    canvas.style.borderColor = subColor;
    musicCredits.style.color = subColor;
}

function fullReset() {
    if (ballY > canvas.height) {
        finalScore = finalScore + score;
        lives--;
        softReset();
    }
    if (lives === 0) {
        window.alert('Game over! Your final score is: ' + Math.round(finalScore));
        finalScore = 0;
        lives = 3
        numBricks = numCols * numRows;
        storeArray();
        softReset();
    }
    if (numBricks === 0) {
        finalScore = finalScore + score;
        finalScore = finalScore * lives;
        window.alert('You win! Your final score is: ' + Math.round(finalScore));
        finalScore = 0;
        lives = 3
        numBricks = numCols * numRows;
        storeArray();
        softReset();
    }
}

function music() {
    if(ballSpeed < 9 && musicPlaying !== 1){
        var picker = Math.random() * 10;
        if(picker < 5) {
            musicNone.play();
            musicNone.volume = 0.25;
        }
        else {
            musicNtwo.play();
            musicNtwo.volume = 0.25;
        }
        musicInitialized = true;
        musicPlaying = 1;
        musicFone.pause();
        musicFtwo.pause();
        musicFthree.pause();
        musicIone.pause();
    }
    if((ballSpeed >= 9 && ballSpeed < 12) && musicPlaying !== 2) {
        var picker = Math.random() * 10;
        if(picker < 3.3) {
            musicFone.play();
            musicFone.volume = 0.25;
        }
        if (picker > 6.7) {
            musicFtwo.play();
            musicFtwo.volume = 0.25;
        }
        else {
            musicFthree.play();
            musicFthree.volume = 0.25;
        }
        musicPlaying = 2;
        musicNone.pause();
        musicNtwo.pause();
        musicIone.pause();
    }
    if((ballSpeed >= 12) && musicPlaying !== 3) {
        musicIone.play();
        musicIone.volume = 0.25;
        musicPlaying = 3;
        musicFone.pause();
        musicFtwo.pause();
        musicFthree.pause();
    }
}

function run() {
    clearCanvas();
    // recommended to put this in the beginning
    requestAnimationFrame(run);
    music();

    increaseSpeed();
    hitDetection();
    bounce();
    // fullReset is just checking if full reset is needed, not actually fully resetting every loop
    fullReset();

    paddleMove();
    ballMove();

    // draw all the stuff last
    drawBackground();
    drawLives();
    drawShadow();
    speedAlert();
    drawBall();
    drawPaddle();
    drawBrick();
    // debugTool();
}

// --------------- CALL FUNCTIONS ---------------
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

storeArray();
run();

let canvas = document.getElementById('gameboard')
let ctx = canvas.getContext('2d')
canvas.height = 650
canvas.width = 650
let speed = 2
let score = 0


let ball = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    dx: speed,
    dy: -speed + 1,
    radius: 7,
    draw: function () {
        ctx.beginPath()
        ctx.fillStyle = '#2B43E3';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill()
    }
}

let tray = {
    height: 10,
    width: 80,
    x: canvas.width / 2 - 80 / 2,
    y: canvas.height - 70,
    moveLeft() {
        tray.x -= 10
        if (tray.x <= 0) {
            tray.x = 0
        }
    },
    moveRight() {
        tray.x += 10
        if (tray.x + tray.width >= canvas.width) {
            tray.x = canvas.width - tray.width
        }
    },
    draw: function () {
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#2B43E3';
        ctx.closePath();
        ctx.fill();
    }
}

window.addEventListener('keydown', (e) => {
        if (e.keyCode === 37 || e.keyCode === 65) {
            tray.moveLeft()
        }
        if (e.keyCode === 39 || e.keyCode === 68) {
            tray.moveRight()
        }
    }
)

function checkCollision(cir, rect) {
    let Ax = cir.x;
    let Ay = cir.y;

    let rect_left = rect.x;
    let rect_top = rect.y;
    let rect_right = rect.x + rect.width;
    let rect_bottom = rect.y + rect.height;

    if (cir.x < rect_left)
        Ax = rect_left;
    else if (cir.x > rect_right)
        Ax = rect_right;

    if (cir.y < rect_top)
        Ay = rect_top;
    else if (cir.y > rect_bottom)
        Ay = rect_bottom;

    let dx = cir.x - Ax;
    let dy = cir.y - Ay;

    return (dx * dx + dy * dy) <= cir.radius * cir.radius;
}

//bricks
let brickRowCount = 4
let brickColumnCount = 6
let brickWidth = 70
let brickHeight = 20
let brickPadding = 20
let brickOffSetTop = 40
let brickOffSetLeft = 65
let bricks = []

function generateBricks() {
    for (let i = 0; i < brickColumnCount; i++) {
        bricks[i] = []
        for (let j = 0; j < brickRowCount; j++) {
            bricks[i][j] = {x: 0, y: 0, status: 1}
        }
    }
}

function drawBricks() {
    for (let i = 0; i < brickColumnCount; i++) {
        for (let j = 0; j < brickRowCount; j++) {
            if (bricks[i][j].status === 1) {
                let brickX = i * (brickWidth + brickPadding) + brickOffSetLeft
                let brickY = j * (brickHeight + brickPadding) + brickOffSetTop
                bricks[i][j].x = brickX
                bricks[i][j].y = brickY
                ctx.beginPath()
                ctx.rect(brickX, brickY, brickWidth, brickHeight)
                ctx.fillStyle = '#2B43E3'
                ctx.fill()
                ctx.closePath()
            }
        }
    }
}

function brickcollision() {
    for (let i = 0; i < brickColumnCount; i++) {
        for (let j = 0; j < brickRowCount; j++) {
            let b = bricks[i][j]
            if (b.status === 1) {
                if (ball.x >= b.x &&
                    ball.x <= b.x + brickWidth &&
                    ball.y >= b.y &&
                    ball.y <= b.y + brickHeight) {
                    ball.dy *= -1
                    b.status = 0
                    score++
                }
            }
        }
    }
}

let gameLevelUp = true

function levelUp() {
    if (score % 24 === 0 && score != 0) {
        if (ball.y > canvas.height / 2) {
            generateBricks()
        }
        if (gameLevelUp) {
            if (ball.dy > 0) {
                ball.dy += 1
                gameLevelUp = false
            } else if (ball.dy < 0) {
                ball.dy -= 1
                gameLevelUp = false
            }
        }
        if (score % 24 != 0) {
            gameLevelUp = true
        }
    }

}

function drawScore() {
    ctx.font = '15px Arial';
    ctx.fillStyle = '#2B43E3'
    ctx.fillText('Score ' + score, 10, 20)
}

function initiateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    tray.draw();
    drawBricks();
    brickcollision();
    drawScore();
    levelUp();
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1
    }
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1
    }
    if (ball.y + ball.radius > canvas.height) {
        score = 0;
        generateBricks();
        ball.dx = speed;
        ball.dy = -speed + 1;
    }
    if (checkCollision(ball, tray)) {
        ball.dy *= -1
    }
    requestAnimationFrame(initiateGame)
}

generateBricks()
initiateGame()
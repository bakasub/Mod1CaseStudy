let canvas = document.getElementById('gameboard')
let ctx = canvas.getContext('2d')
canvas.height = 650
canvas.width = 650
let speed = 2


let ball = {
    x: canvas.width/2,
    y: canvas.height-80,
    dx: speed,
    dy: -speed + 1,
    radius: 7,
    draw: function (){
        ctx.beginPath()
        ctx.fillStyle = '#2B43E3';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2, true);
        ctx.closePath();
        ctx.fill()
    }
}

let tray = {
    height: 10,
    width: 80,
    x: canvas.width/2 - 80/2,
    moveLeft(){
        tray.x -= 10
    },
    moveRight(){
        tray.x += 10
    },
    draw: function (){
        ctx.beginPath()
        ctx.rect(this.x, canvas.height - 70, this.width,this.height);
        ctx.fillStyle = '#2B43E3';
        ctx.closePath();
        ctx.fill();
    }
}

window.addEventListener('keydown',(e)=>{
    if (e.keyCode == 37){
        tray.moveLeft()
    }
    if (e.keyCode == 39){
        tray.moveRight()
    }
    }
    )

function initiateGame(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ball.draw();
    tray.draw();
    ball.x += ball.dx;
    ball.y += ball.dy;

    if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0){
        ball.dx *= -1
    }
    if (ball.y + ball.radius >canvas.height || ball.y - ball.radius < 0){
        ball.dy *= -1
    }

    requestAnimationFrame(initiateGame)
}
initiateGame()
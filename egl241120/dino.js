const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let score;
let highscore;
let dino;
let gravity;
let obstacles = [];
let gameSpeed;
let keys = {};
let tempSeoul = 0;
let isGameOver = false;

document.addEventListener('keydown', function (evt) {
    keys[evt.code] = true;
});

document.addEventListener('keyup', function (evt) {
    keys[evt.code] = false;
});

class Dino {
    constructor(x, y, w, h, c) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;

        this.dy = 0;
        this.jumpForce = 15;
        this.originalHeight = h;
        this.grounded = false;
        this.jumpTimer = 0;
        this.isJumping = false;
        this.canDoubleJump = false;
    }

    Draw() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    }

    Jump() {
        // 점프와 웅크리기를 동시에 하면 점프 무시
        // 점프 중에 점프 키를 한 번 더 누르면 더블 점프
        if ((keys['ShiftLeft'] || keys['ArrowDown'])) {
            return;
        }
        // etc...
        if (this.grounded && this.jumpTimer == 0) {
            this.jumpTimer = 1;
            this.dy = -this.jumpForce;
            this.isJumping = true;
            this.canDoubleJump = true;
        } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
            this.jumpTimer++;
            this.dy = -this.jumpForce - (this.jumpTimer / 50);
        } else if (this.canDoubleJump && !this.grounded) {
            this.jumpTimer = 1;
            this.dy = -this.jumpForce;
            this.canDoubleJump = false;
        }
    }

    Animate() {
        if (keys['Space'] || keys['ArrowUp']) {
            this.Jump();
        } else {
            this.jumpTimer = 0;
        }

        if (keys['ShiftLeft'] || keys['ArrowDown']) {
            if (this.isJumping && this.dy > 0) {  // 만약 점프 중에 웅크리면 즉시 떨어진다.
                this.dy += 5;
            }
            this.h = this.originalHeight / 2;
        } else {
            this.h = this.originalHeight;
        }
        this.y += this.dy;

        if (this.y + this.h < canvas.height) {
            this.dy += gravity;
            this.grounded = false;
        } else {
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - this.h;
            this.isJumping = false;
            this.canDoubleJump = false;
        }
        this.Draw();
    }
}

class Obstacle {
    constructor(x, y, w, h, c) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;

        this.dx = -gameSpeed;
        this.isBird = false;
    }

    Update() {
        this.x += this.dx;
        this.Draw();
        this.dx = -gameSpeed;
    }

    Draw() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    }
}

function SpawnObstacle() {
    let size = RandomIntInRange(20, 70);
    let type = RandomIntInRange(0, 1);
    let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, '#2484E4');

    if (type == 1) {
        obstacle.y -= dino.originalHeight - 10;
        obstacle.isBird = true;
    }
    obstacles.push(obstacle);
}

function RandomIntInRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function Start() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gameSpeed = 3;
    gravity = 1;
    score = 0;
    highscore = 0;
    if (localStorage.getItem('highscore')) {
        highscore = localStorage.getItem('highscore');
    }
    dino = new Dino(25, canvas.height - 150, 50, 50, '#ff0000');

    requestAnimationFrame(Update);
}

let initialSpawnTimer = 200;
let spwanTimer = initialSpawnTimer;

function init() {
    obstacles = [];
    gameSpeed = 3;
    score = 0;
    spwanTimer = initialSpawnTimer;
    window.localStorage.setItem('highscore', highscore);
}

function Update() {
    if (isGameOver) return;
    requestAnimationFrame(Update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dino.Animate();

    spwanTimer--;
    if (spwanTimer <= 0) {
        SpawnObstacle();
        spwanTimer = initialSpawnTimer - gameSpeed * 8;

        if (spwanTimer < 60) {
            spwanTimer = 60;
        }
    }
    for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        if (o.x + o.w < 0) {
            obstacles.splice(i, 1);
        }
        if (
            dino.x < o.x + o.w &&
            dino.x + dino.w > o.x &&
            dino.y < o.y + o.h &&
            dino.y + dino.h > o.y
        ) {
            // init();
            isGameOver = true;
            alert('Game Over');
            return;
        }

        o.Update();
    }
    gameSpeed += 0.003;
}

Start();

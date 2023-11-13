window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('DOMContentLoaded', onLoad, false)
window.requestAnimFrame =
    window.requestAnimFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    }

let canvas, ctx;
let w, h;
let particles = [];
let xPoint, yPoint;
const PROBABILITY = 0.04;

function resizeCanvas() {
    if (!!canvas) {
        console.log('window.innerWidth', window.innerWidth)
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
}

function onLoad() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.requestAnimFrame(updateWorld)
}

function updateWorld() {
    update();
    paint();
    window.requestAnimationFrame(updateWorld)
}


function update() {
    if (particles.length < 500 && Math.random() < PROBABILITY) {
        createFirework()
    }

    let alive = [];
    for (let i = 0; i < particles.length; i++) {
        let inScreen = particles[i].move();
        if (inScreen) {
            alive.push(particles[i])
        }
    }

    particles = alive;
}


function paint() {
    // 在现有画布上绘制新图形
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `rgba(0, 0, 0, 0.2)`;
    ctx.fillRect(0, 0, w, h);
    // 两个重叠图形的颜色是通过颜色值相加来确定的。
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < particles.length; i++) {
        particles[i].draw(ctx);
    }
}

function createFirework() {
    xPoint = Math.random() * (w - 200) + 100;
    yPoint = Math.random() * (h - 200) + 100;
    let nFire = Math.random() * 50 + 100;
    let c = "rgb(" + (~~(Math.random() * 200 + 55)) + ","
        + (~~(Math.random() * 200 + 55)) + "," + (~~(Math.random() * 200 + 55)) + ")";
    for (let i = 0; i < nFire; i++) {
        let particle = new Particle();
        particle.color = c;
        let vy = Math.sqrt(5 * 5 - particle.vx ** 2);
        if (Math.abs(particle.vy) > vy) {
            particle.vy = particle.vy > 0 ? vy : -vy;
        }
        particles.push(particle);
    }
}

function Particle() {
    this.w = this.h = Math.random() * 4 + 1;
    this.x = xPoint - this.w / 2;
    this.y = yPoint - this.h / 2;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;
    this.alpha = Math.random() * .5 + .5;
    this.color;
}

Particle.prototype = {
    gravity: 0.05,
    move: function () {
        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;
        this.alpha -= 0.01;
        return !(this.x <= -this.w || this.x >= screen.width ||
            this.y >= screen.height ||
            this.alpha <= 0);

    },
    draw: function (c) {
        c.save();
        c.beginPath();
        c.translate(this.x + this.w / 2, this.y + this.h / 2);
        c.arc(0, 0, this.w, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.globalAlpha = this.alpha;
        c.closePath();
        c.fill();
        c.restore();
    }
}
let canvas;
let context;

let rectX = 0;
let rectY = 0;

let secondsPassed = 0;
let oldTimeStamp = 0;
let gameObjects;

window.onload = init;

class GameObject {
    constructor(context, x, y, vx, vy,) {
        this.context = context
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy

        this.isColliding = false
    }
}

class Square extends GameObject {
    constructor(context, x, y, vx, vy,) {
        super(context, x, y, vx, vy,)
        this.width = 50;
        this.height = 50;
    }

    draw() {
        this.context.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        this.context.fillRect(this.x, this.y, this.width, this.height)
    }

    update(secondsPassed) {
        this.x += this.vx * secondsPassed
        this.y += this.vy * secondsPassed
    }

}

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    window.requestAnimationFrame(gameLoop);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function getSecondsPassed(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    return Math.min(secondsPassed, 0.1);
}

function gameLoop(timeStamp) {
    secondsPassed = getSecondsPassed(timeStamp)

    detectCollisions()

    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(secondsPassed);
    }

    clearCanvas()

    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].draw();
    }

    window.requestAnimationFrame(gameLoop);
}


function createWorld() {
    gameObjects = [
        new Square(context, 250, 50, 0, 50),
        new Square(context, 250, 300, 0, -50),
        new Square(context, 150, 0, 50, 50),
        new Square(context, 250, 150, 50, 50),
        new Square(context, 350, 75, -50, 50),
        new Square(context, 300, 300, 50, -50)
    ];
}


// implement collision detection
// create a function in game objects that accesses the global variable

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2,) {
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
        return false;
    }
    return true;
}

function detectCollisions() {
    let obj1;
    let obj2;

    // Reset collision state of all objects
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }

    // Start checking for collisions
    for (let i = 0; i < gameObjects.length; i++) {
        obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++) {
            obj2 = gameObjects[j];

            // Compare object1 with object2
            if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)) {
                obj1.isColliding = true;
                obj2.isColliding = true;
            }
        }
    }
}

init()
createWorld()

import { Square } from './gameObjects.js'

let canvas;
let context;

let secondsPassed = 0;
let timestamp = 0;
let gameObjects;

window.onload = init;



function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    window.requestAnimationFrame(gameLoop);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function getSecondsPassed(timeStamp) {
    secondsPassed = (Date.now() - timestamp) / 1000;
    return timeStamp, Math.min(secondsPassed, 0.1);
}

function gameLoop() {
    timestamp, secondsPassed = getSecondsPassed(timestamp)

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
        new Square(context, 250, 50, 0, 5),
        new Square(context, 250, 300, 0, -5),
        new Square(context, 150, 0, 5, 5),
        new Square(context, 250, 150, 5, 5),
        new Square(context, 350, 75, -5, 5),
        new Square(context, 300, 300, 5, -5)
    ];
}



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

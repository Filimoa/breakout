import { Paddle, Square, getCollisionVector } from './gameObjects.js'
import { clearCanvas } from "./utils.js"

let canvas;
let context;

const canvasWidth = 750;
const canvasHeight = 400;
const LEFT_KEY = "37"
const RIGHT_KEY = "39"

let secondsPassed = 0;
let timestamp = 0;
let gameObjects;
let paddle;

window.onload = init;

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    window.requestAnimationFrame(gameLoop);

    document.onkeydown = checkKey;
}


function getSecondsPassed(pastTimestamp) {
    secondsPassed = (Date.now() - pastTimestamp) / 1000;
    return Date.now(), Math.min(secondsPassed, 0.1);
}

function gameLoop() {
    timestamp, secondsPassed = getSecondsPassed(timestamp)

    gameObjects = detectCollisions(gameObjects)

    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].advance(secondsPassed);
    }

    clearCanvas(canvas, context)

    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].draw();
    }

    paddle.draw()

    window.requestAnimationFrame(gameLoop);
}



function detectCollisions(gameObjects) {
    let obj1;
    let obj2;


    for (let i = 0; i < gameObjects.length; i++) {
        obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++) {
            obj2 = gameObjects[j]
            if (obj1.intersects(gameObjects[j])) {
                let v = getCollisionVector(obj1.x, obj1.y, obj2.x, obj2.y)
                obj1.x = v.x
                obj1.y = v.y

            }
        }
    }

    let obj
    for (let i = 0; i < gameObjects.length; i++) {
        obj = gameObjects[i]
        if (obj.x + obj.width > canvasWidth || obj.x < 0) {
            obj.vx = -obj.vx
        }
        if (obj.y + obj.height > canvasHeight || obj.y < 0) {
            obj.vy = -obj.vy
        }
    }

    return gameObjects


}

function checkKey(e) {
    e = e || window.event;

    // left
    if (e.keyCode == LEFT_KEY) {
        if (paddle.x > 0) { paddle.vx -= 20 }
    }
    // right
    else if (e.keyCode == RIGHT_KEY) {
        if (paddle.x + paddle.width < canvasWidth) { paddle.vx += 20 }
    }

}

// throw new Error(`Muahahha`)
init()


paddle = new Paddle(context, canvasWidth / 2, canvasHeight - 20, 0, 0)

gameObjects = [
    new Square(context, 0, 0, 0, 0),
    new Square(context, 250, 50, 0, 25),
    new Square(context, 250, 300, 0, -25),
    new Square(context, 150, 0, 5, 5),
    new Square(context, 250, 150, 5, 25),
    new Square(context, 350, 75, -5, 25),
    new Square(context, 300, 300, 5, -5),
    paddle
];


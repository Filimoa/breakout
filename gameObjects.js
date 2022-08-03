
function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

class GameObject {
    constructor(context, x, y, vx, vy,) {
        this.context = context
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy

        this.isColliding = false
    }


    advance(dt) {
        this.x += this.vx * dt
        this.y += this.vy * dt
    }
}

export class Paddle extends GameObject {
    constructor(context, x, y, vx, vy, width = 80, height = 20, mass = 10) {
        super(context, x, y, vx, vy,)
        this.width = width;
        this.height = height;
    }

    draw() {
        this.context.fillStyle = 'black';
        this.context.fillRect(this.x, this.y, this.width, this.height)
    }

}


export class Square extends GameObject {
    constructor(context, x, y, vx, vy, width = 50, height = 50, mass = 10) {
        super(context, x, y, vx, vy,)
        this.width = width;
        this.height = height;
    }

    draw() {
        this.context.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        this.context.fillRect(this.x, this.y, this.width, this.height)
    }

    intersects(obj) {
        if (rectIntersect(this.x, this.y, this.width, this.height, obj.x, obj.y, obj.width, obj.height)) {
            return true;
        }
        return false
    }

    distance(obj) {
        // not correct
        return Math.sqrt((obj.x - this.x) * (obj.x - this.x) + (obj.y - this.y) * (obj.y - this.y));
    }

    relativeV(obj) {
        return { x: this.vx - obj.vx, y: this.vy - obj.vy }
    }


}

class Vector {
    // 2d
    constructor(x, y) {
        if (console.assert(isNumber(x) || isNumber(y))) {
            throw new Error(`Null values given x:${x} y:${y}`)
        }
        this.x = x
        this.y = y
    }

    dot(other) {
        return this.x * other.x + this.y * other.y
    }

    multiply(other) {
        if (typeof (other) == "number") {
            return new this.constructor(this.x * other, this.y * other)
        } else {
            return new this.constructor(this.x * other.x, this.y * other.y)
        }
    }

    minus(other) {
        return new this.constructor(this.x - other.x, this.y - other.y)
    }

    normalized() {
        let normFactor = Math.sqrt(this.x ** 2 + this.y ** 2)
        return new this.constructor(this.x / normFactor, this.y / normFactor)
    }
}



export function getCollisionVector(x1, y1, x2, y2) {

    let v1 = new Vector(x1, y1)
    let v2 = new Vector(x2, y2)

    let collisionV = v2.minus(v1).normalized()

    // Find orthogonal vector using [0,1] and Gram-Schmidt
    let yHat = collisionV.multiply(collisionV.dot(new Vector(0, 1)))
    let orthogonalV = new Vector(0, 1).minus(yHat)
    return collisionV
}


function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2,) {
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
        return false;
    }
    return true;
}

console.clear()
let res, v1;
v1 = new Vector(5, -5)
console.assert(v1.dot(v1) == 50)

res = v1.multiply(v1)
console.assert(new Vector(25, 25))

res = v1.multiply(new Vector(0, 0))
console.assert(res.x == 0)

res = v1.multiply(4)
console.assert(new Vector(20, -20))

res = v1.normalized()
console.assert(new Vector(1, -1))

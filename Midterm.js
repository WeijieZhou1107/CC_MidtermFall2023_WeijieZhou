function setup() {
  createCanvas(800, 800);
  smooth(8);
  noCursor();
  mouseDir = createVector();
  ballList = [];
}

function draw() {
background(255);
mouseDir.set(mouseX - pmouseX, mouseY - pmouseY);
if (mouseIsPressed) {
  for (let i = 0; i < 25; i++) {
    let b = new Ball(mouseX, mouseY, random(5, 50));
    ballList.push(b);
  }
}
for (let i = ballList.length - 1; i > -1; i--) {
  let b = ballList[i];
  if (b.dead) {
    ballList.splice(i, 1);
  } else {
    b.update();
  }
}
for (let i = 0; i < ballList.length; i++) {
  let b = ballList[i];
  b.display();
}

}

class Ball {
  constructor(x, y, _diamMax) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.diamMax = _diamMax;
    this.life = 0;
    this.diam = random(5, 50); // Initialize diam
    this.diamT = this.diamMax; // Set diamT to diamMax initially
    let scalar = map(this.diam, 5, 50, 1, 0.25) * random(0.9, 1.1);
    this.vel = createVector(mouseDir.x, mouseDir.y);
    this.vel.rotate(random(-PI * 0.125, PI * 0.125));
    this.vel.mult(scalar);
    this.c = color(random(255), random(128, 255), 255);
    this.lifeSpan = random(60, 480);
    this.friction = map(this.diamMax, 5, 50, 0.99, 0.85);
    this.noiseFOfst = random(-0.1, 0.1);
    this.dead = false; // Initialize dead as false
  }

  update() {
    this.updateLife();
    this.updatePos();
  }

  updatePos() {
    let rtt = noise(
      this.pos.x * 0.005 + this.noiseFOfst + frameCount * 0.005,
      this.pos.y * 0.005 + this.noiseFOfst + frameCount * 0.005
    ) * Math.PI * 4;
    this.acc.set(Math.cos(rtt), Math.sin(rtt));
    this.acc.mult(0.25);
    this.vel.add(this.acc);
    this.vel.mult(this.friction);
    this.pos.add(this.vel);
    this.boundaryCheck();
  }

  updateLife() {
    if (this.life < this.lifeSpan) {
      this.life++;
    } else {
      this.dead = true;
    }
    this.diam = lerp(this.diam, this.diamT, 0.125);
    this.diamT = map(this.life, 0, this.lifeSpan, this.diamMax, 0);
  }

  boundaryCheck() {
    if (
      this.pos.x < -this.diam * 0.5 ||
      this.pos.x > width + this.diam * 0.5 ||
      this.pos.y < -this.diam * 0.5 ||
      this.pos.y > height + this.diam * 0.5
    ) {
      this.dead = true;
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + Math.PI * 0.5);
    noStroke ();
    fill(this.c);
    ellipse(0, 0, this.diam, this.diam);
    pop();
  }
}

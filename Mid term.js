let ballList = [];
let mouseDir;
let img = [];
function setup() {
  createCanvas(720, 720, WEBGL);
  smooth(8);
  noCursor();
  colorMode(HSB);
  imageMode(CENTER);
  img = new Array(6);
  for (let i = 0; i < img.length; i++) {
    img[i] = loadImage(i + ".png");
  }
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
  
  fill("#0000ff");
  textSize(24);
  text("ballList: " + ballList.length, 50, 50);
}


  class Ball{
    constructor(x, y, _diamMax){
      this.pos = createVector(x, y);
      this.vel = createVector();
      this.acc = createVector();
      this.diamMax = _diamMax;
      let scalar = map(this.diam, 5, 50, 1, .25)*random(.9, 1.1);
      if(mouseDir.mag() == 0){
        this.vel = p5.Vector.random2D();
      }else{
        this.vel = createVector(mouseDir.x, mouseDir.y);
        this.vel.rotate(random(-PI*.125, PI*.125));
      }
      this.vel.mult(scalar);
      this.c = color(random(255), random(128, 255), 255);
      this.lifeSpan = round(random(60, 480));
      this.friction = map(this.diamMax, 5, 50, .99, .85);
      this.noiseFOfst = random(-.1, .1);
      this.imgIdx = floor(random(img.length));
    }
    update(){
      this.updateLife();
      this.updatePos();
    }

    updatePos() {
      var rtt = noise(
          pos.x * .005 + noiseFOfst + frameCount * .005,
          pos.y * .005 + noiseFOfst + frameCount * .005) * Math.PI * 4;
      acc.set(Math.cos(rtt), Math.sin(rtt));
      acc.mult(.25);
      vel.add(acc);
      vel.mult(friction);
      pos.add(vel);
      boundaryCheck();
  }
  
    updateLife() {
      if (life < lifeSpan) life++;
      else dead = true;
      diam = lerp(diam, diamT, .125);
      diamT = map(life, 0, lifeSpan, diamMax, 0);
  }
  
    boundaryCheck() {
      if (pos.x < -diam * .5 || pos.x > width + diam * .5 ||
          pos.y < -diam * .5 || pos.y > height + diam * .5) {
          dead = true;
      }
  }
  
    display() {
      pushMatrix();
      translate(pos.x, pos.y);
      rotate(vel.heading() + Math.PI * .5);
      image(img[imgIdx], 0, 0, diam, diam);
      popMatrix();
  }
}//end ball 
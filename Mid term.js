let pos, vel, acc;//Position & Velocity & Acceleration
let diam;//Diameter
let c;//Color 
let count = 1000;

function setup(){

  ArrayList <Ball> ballList;//Declare an arrayList of balls
  PVector mouseDir;
  
  PImage [] img;
  
  void setup(){
    size(720, 720, P3D);
    smooth(8);
    noCursor();
    colorMode(HSB);
    imageMode(CENTER);
    img = new PImage[6];
    for(int i=0; i<img.length; i++){
      img[i] = loadImage(i+".png");
    }
    
    mouseDir = new PVector();
    ballList = new ArrayList<Ball>();
  }
  
  void draw(){
    
    background(255);
    
    mouseDir.set(mouseX-pmouseX, mouseY-pmouseY);
    
    if(mousePressed){
      for(int i=0; i<25; i++){
        Ball b = new Ball(mouseX, mouseY, random(5, 50));
        ballList.add(b);
      }
    }
    
    for(int i=ballList.size()-1; i>-1; i--){//Traverse the arrayList
      Ball b = ballList.get(i);
      if(b.dead){
        ballList.remove(b);
      }else{
        b.update();
      }
    }
    
    for(int i=0; i<ballList.size(); i++){
      Ball b = ballList.get(i);
      b.display();
    }
    
    //Display info
    fill(#0000ff);
    textSize(24);
    text("ballList: "+ballList.size(), 50, 50);
  }


class Ball{
  
    PVector pos, vel, acc;//Position, Velocity, Acceleration
    float diam, diamT, diamMax;//Diameter, Maximum diameter
    color c;//Color
    boolean dead;
    int life, lifeSpan;
    float friction;
    float noiseFOfst;
    int imgIdx;//Image index
    
    //Constructor
    Ball(float x, float y, float _diamMax){
      pos = new PVector(x, y);
      acc = new PVector();
      diamMax = _diamMax;
      float scalar = map(diam, 5, 50, 1, .25)*random(.9, 1.1);
      if(mouseDir.mag() == 0){
        vel = PVector.random2D();
      }else{
        vel = new PVector(mouseDir.x, mouseDir.y);
        vel.rotate(random(-PI*.125, PI*.125));
      }
      vel.mult(scalar);
      c = color(random(255), random(128, 255), 255);//Hue, Saturation, Brightness
      lifeSpan = round(random(60, 480));
      friction = map(diamMax, 5, 50, .99, .85);
      
      noiseFOfst = random(-.1, .1);
      imgIdx = floor(random(img.length));
    }
    
    void update(){
      updateLife();
      updatePos();
    }
    
    void updatePos(){
      float rtt = noise(
        pos.x*.005+noiseFOfst+frameCount*.005,
        pos.y*.005+noiseFOfst+frameCount*.005)*PI*4;
        
      acc.set(cos(rtt), sin(rtt));
      acc.mult(.25);
      vel.add(acc);
      vel.mult(friction);
      pos.add(vel);
      boundaryCheck();
    }
    
    void updateLife(){
      if(life<lifeSpan) life++;
      else dead = true;
      diam = lerp(diam, diamT, .125);
      diamT = map(life, 0, lifeSpan, diamMax, 0); 
    }
    
    void boundaryCheck(){
      if(pos.x < -diam*.5 || pos.x > width+diam*.5 || //Horizontal check
         pos.y < -diam*.5 || pos.y > height+diam*.5){//Vertical check
        dead = true;
      }
    }
    
    void display(){
      //stroke(c);
      //strokeWeight(diam);
      //point(pos.x, pos.y);
      pushMatrix();
      translate(pos.x, pos.y);
      rotate(vel.heading()+PI*.5);
      image(img[imgIdx], 0, 0, diam, diam);
      popMatrix();
    }
  }
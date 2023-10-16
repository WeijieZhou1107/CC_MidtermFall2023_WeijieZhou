let pos, vel, acc;//Position & Velocity & Acceleration
let diam;//Diameter
let c;//Color 
let count = 1000;

function setup(){
  createCanvas (720, 720);
  smooth(8);
  
  //Initialize all arrays;
  pos = new PVector[count];
  vel = new PVector[count];
  acc = new PVector[count];
  diam = new float[count];
  c = new color[count];
  
  for( i=0; i<count; i++ ){
    pos[i] = new PVector(random(width), random(height));
    diam[i] = random(1, 5);
    vel[i] = PVector.random2D();
    scalar = map(diam[i], 1, 5, 5, .2);
    vel[i].mult(scalar);
    acc[i] = new PVector();
    c[i] = color(random(255), random(255), random(255));
  }
}

function draw(){
  
  //Update an array of balls;
  for( i=0; i<count; i++){
    
    if(mousePressed){
      acc[i].set(mouseX-pos[i].x, mouseY-pos[i].y);
      
      d = acc[i].mag();
      //d = constrain(d, 0, 360);
      
      acc[i].normalize();
      acc[i].rotate(map(d, 0, 360, PI*.5, 0));
      acc[i].mult(map(diam[i], 1, 5, .5, .05));  
      
    }else{
      acc[i].set(0, 0);
    }
    
    vel[i].add(acc[i]);
    
    //Boundary check horizontal
    if(pos[i].x<diam[i]*.5){//Boundary Left
      pos[i].x = diam[i]*.5;
      vel[i].x *= -1;
    }else if(pos[i].x>width-diam[i]*.5){//Boundary Right
      pos[i].x = width-diam[i]*.5;
      vel[i].x *= -1;
    }
    //Boundary check vertical
    if(pos[i].y<diam[i]*.5){//Boundary Top
      pos[i].y = diam[i]*.5;
      vel[i].y *= -1;
    }else if(pos[i].y>height-diam[i]*.5){//Boundary Bottom
      pos[i].y = height-diam[i]*.5;
      vel[i].y *= -1;
    }
    
    vel[i].mult(.99);
    
    pos[i].add(vel[i]);//Move (Add velocity to each ball's current position)
  }
  
  //Display an array of balls;
  background(255);
  for( i=0; i<count; i++){
    stroke(c[i]);
    strokeWeight(diam[i]);
    point(pos[i].x, pos[i].y);
  }
}
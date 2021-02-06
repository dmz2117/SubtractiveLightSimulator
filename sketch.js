let srcR=255, srcG=255, srcB=255;
let rflR=255, rflG=255, rflB=255;
let unit, unitCheck;
let redPhotons = [], greenPhotons = [], bluePhotons = [];
let srcDirection = [], rflDirection = [];
let dirCount = 0, delayCount = 0;
let redCount = 0, greenCount = 0, blueCount = 0;
let redPos = 6.5, greenPos = 7.5, bluePos = 8.5;
let mode = "colorPicker";
let videoLive = true;

function setup() {
  capture = createCapture(VIDEO);
  capture.size(320, 240);
  capture.hide();
}

function draw() {
  createCanvas(windowWidth, (windowWidth/16)*9);
  unit = windowWidth/16;
  angleMode(DEGREES);
  background(0);
  
  //  capture window
  if (mode == "videoCapture") {
    push();
    scale(-1, 1);
    image(capture, -windowWidth/2 - unit*2, unit/2, unit*4, unit*3);
    pop();
    push();
    stroke(255);
    strokeWeight(2);
    noFill();
    square((windowWidth/2)-5, (unit*2)-5, 10);
    copyColor = get(windowWidth/2,unit*2);
    if (videoLive) {
      rflR = copyColor[0];
      rflG = copyColor[1];
      rflB = copyColor[2];
    }
    pop();
  }
    
  //  source beams
  push();
    //red
  stroke(srcR,0,0);
  strokeWeight(unit/1.6);
  line(-unit,0,unit*11,unit*9);
    //green
  stroke(0,srcG,0);
  strokeWeight(unit/1.6);
  line(0,0,unit*12,unit*9);
    // blue
  stroke(0,0,srcB);
  strokeWeight(unit/1.6);
  line(unit,0,unit*13,unit*9);
  pop();
  
  //  reflected beams
  redBeamWidth = map (rflR,0,255,0,unit/1.6);
  push();
    //red
  stroke(255,0,0);
  strokeWeight(redBeamWidth);
  line(unit*3,unit*9,unit*15,0);
    //green
  greenBeamWidth = map (rflG,0,255,0,unit/1.6);
  stroke(0,255,0);
  strokeWeight(greenBeamWidth);
  line(unit*4,unit*9,unit*16,0);
    //blue
  blueBeamWidth = map (rflB,0,255,0,unit/1.6);
  stroke(0,0,255);
  strokeWeight(blueBeamWidth);
  line(unit*5,unit*9,unit*17,0);
  pop();
  
  //  light direction
  push();
  for (i=0; i < dirCount; i++) {
    srcDirection[i].display();
    srcDirection[i].move();
    rflDirection[i].display();
    rflDirection[i].move();
  }
  if (delayCount == 0 && dirCount < 5) {
    srcDirection[dirCount] = new Direction("src");
    rflDirection[dirCount] = new Direction("rfl");
    dirCount++;
  }
  if (delayCount == 59) {
    delayCount = 0;
  } else {
    delayCount++;
  }
  pop();
  
  //  light source
  push();
  fill(srcR,srcG,srcB);
  circle (0,0,unit*4);
  pop();
  
  //  surface
  push();
  fill(rflR,rflG,rflB);
  rect(0,unit*6,windowWidth,unit*3);
  pop();
  
  //  eye
  circle (windowWidth,0,unit*2);
  push();
  translate(unit*15.5,unit/2);
  rotate(-45);
  fill(rflR,rflG,rflB);
  ellipse(0,0,unit/2,unit);
  fill("black");
  ellipse(0,0,unit/4,unit/2);
  pop();
  
  //  absorption
  push();
    // red
  redAbsorption = int((srcR - rflR) / 2);
  greenAbsorption = int((srcG - rflG) / 2);
  blueAbsorption = int((srcB - rflB) / 2);
  fill(255,0,0);
  for (i=0; i < redCount; i++) {
    redPhotons[i].display();
    redPhotons[i].move();
  }
  if (redCount < redAbsorption) {
    redPhotons[redCount] = new Photon(redPos);
    redCount++;
  }
  if (redCount > redAbsorption) {
    redCount = redAbsorption;
  }
    //green
  fill(0,255,0);
  for (i=0; i < greenCount; i++) {
    greenPhotons[i].display();
    greenPhotons[i].move();
  }
  if (greenCount < greenAbsorption) {
    greenPhotons[greenCount] = new Photon(greenPos);
    greenCount++;
  }
  if (greenCount > greenAbsorption) {
    greenCount = greenAbsorption;
  }
      //blue
  fill(0,0,255);
  for (i=0; i < blueCount; i++) {
    bluePhotons[i].display();
    bluePhotons[i].move();
  }
  if (blueCount < blueAbsorption) {
    bluePhotons[blueCount] = new Photon(bluePos);
    blueCount++;
  }
  if (blueCount > blueAbsorption) {
    blueCount = blueAbsorption;
  }
  pop();
  
  //  colour selector
  if (mode == "colorPicker") {
    push();
    textSize(unit/4);
    textAlign(CENTER, BOTTOM);
    text("Surface Colour", unit*3, unit*6.4);
    fill(255,255,255);
    square(unit,unit*6.5,unit);
    fill(255,0,0);
    square(unit*2,unit*6.5,unit);
    fill(0,255,0);
    square(unit*3,unit*6.5,unit);
    fill(0,0,255);
    square(unit*4,unit*6.5,unit);
    fill(0,0,0);
    square(unit,unit*7.5,unit);
    fill(0,255,255);
    square(unit*2,unit*7.5,unit);
    fill(255,0,255);
    square(unit*3,unit*7.5,unit);
    fill(255,255,0);
    square(unit*4,unit*7.5,unit);
    fill(150,150,150);
    rect(unit*11,unit*7,unit*4,unit);
    fill(0,0,0);
    textAlign(CENTER,CENTER)
    text("Capture a Colour with Video", unit*13, unit*7.5);
    pop();
  }
  
  //  capture controls
  if (mode == "videoCapture") {
    push();
    textSize(unit/4);
    fill(150,150,150);
    rect(unit*1,unit*6.5,unit*4,unit);
    rect(unit*1,unit*7.5,unit*4,unit);
    rect(unit*11,unit*7,unit*4,unit);
    fill(0,0,0);
    textAlign(CENTER,CENTER)
    text("Select a Colour Manually", unit*13, unit*7.5);
    if (videoLive) {
      text("Capture Colour", unit*3, unit*7);
      fill(120,120,120);
      text("Go Live", unit*3, unit*8);
    } else {
      text("Go Live", unit*3, unit*8);
      fill(120,120,120);
      text("Capture Colour", unit*3, unit*7);
    }
    pop();
  }
  
  //  reset for resize
  if (unitCheck != unit) {
    redCount = 0;
    greenCount = 0;
    blueCount = 0;
  }
  
  unitCheck = unit;
}

function Photon(pos) {
  this.x = random(unit*pos,unit*(pos+1));
  this.y = unit*6;
  this.diameter = random(unit/20,unit/15);
  this.speed = random(unit/120,unit/80);

  this.move = function(){

    // Move or reset photons
    if(this.y > unit*7)
    {
      this.x = random(unit*pos,unit*(pos+1));
      this.y=unit*6;
      this.diameter = random(unit/20,unit/15);
    } else {
      this.y += this.speed;
    }
  }

  this.display = function(){
    noStroke();
    circle(this.x, this.y, this.diameter);
    if(this.diameter > 0) {
      this.diameter -= 0.05;
    }
  }
}

function Direction(dir) {
  this.position = 0;
  
  this.move = function(){
    if (this.position > 298) {
      this.position = 0;
    } else {
      this.position++;
    }
  }
  
  this.display = function(){
    push();
    if (dir == "src") {
      this.x = map(this.position, 0, 299, 0, unit*12);
      this.y = map(this.position, 0, 299, 0, unit*9);
    } else if (dir == "rfl") {
      this.x = map(this.position, 0, 299, unit*4, unit*16);
      this.y = map(this.position, 0, 299, unit*9, 0);
    }
    if (dir == "rfl" & rflR == 0 && rflG == 0 && rflB == 0) {
      stroke(255,255,255,0);
    } else {
      stroke(255,255,255,80);
    }
    strokeWeight(unit/6);
    translate(this.x,this.y);
    if (dir == "src") {
      rotate(36.87);
    } else if (dir = "rfl") {
      rotate(-36.87);
    }
    noFill();
    beginShape();
    vertex(-unit*0.6,-unit*0.6);
    vertex(0,0);
    vertex(-unit*0.6,unit*0.6);
    endShape();
    pop();
  }
}

function touchEnded() {
  if (mode == "colorPicker") {
    if (mouseY > unit*6.5 && mouseY < unit*7.5) {
      if (mouseX > unit && mouseX < unit*2) {
        rflR = 255; rflG = 255; rflB = 255;
      }
      if (mouseX > unit*2 && mouseX < unit*3) {
        rflR = 255; rflG = 0; rflB = 0;
      }
      if (mouseX > unit*3 && mouseX < unit*4) {
        rflR = 0; rflG = 255; rflB = 0;
      }
      if (mouseX > unit*4 && mouseX < unit*5) {
        rflR = 0; rflG = 0; rflB = 255;
      }
    }
    if (mouseY > unit*7.5 && mouseY < unit*8.5) {
      if (mouseX > unit && mouseX < unit*2) {
        rflR = 0; rflG = 0; rflB = 0;
      }
      if (mouseX > unit*2 && mouseX < unit*3) {
        rflR = 0; rflG = 255; rflB = 255;
      }
      if (mouseX > unit*3 && mouseX < unit*4) {
        rflR = 255; rflG = 0; rflB = 255;
      }
      if (mouseX > unit*4 && mouseX < unit*5) {
        rflR = 255; rflG = 255; rflB = 0;
      }
    }
    if (mouseX > unit*11 && mouseX < unit*15 && mouseY > unit*7 && mouseY < unit*8) {
      mode = "videoCapture";
      videoLive = true;
    }
  } else if (mode == "videoCapture") {
    if (mouseX > unit && mouseX < unit*5 && mouseY > unit*6.5 && mouseY < unit*7.5) {
      videoLive = false;
    } else if (mouseX > unit && mouseX < unit*5 && mouseY > unit*7.5 && mouseY < unit*8.5) {
      videoLive = true;
    } else if (mouseX > unit*11 && mouseX < unit*15 && mouseY > unit*7 && mouseY < unit*8) {
      mode = "colorPicker";
    }
  }
}
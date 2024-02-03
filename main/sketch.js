let bubbles = [];
let check = 0;
let spawn = 0;
let alive = 0;
let filt

let o = []
let densX 
let densY
let size
let x
let y 
let fs = 0
let i = 0

let movers = []
let maxDens = 6
let buf1, buf2
let rev
let tMin = 50, tMax = 500
let trig = false, state = false
let s1 = "suoni/vetro_2.mp3" /*"suoni/vetro_1.mp3"*/
let s2 = /*"suoni/oboe_2.mp3" */"suoni/oboe_1.mp3"
let img2

let s = [], c = [], d = 12, p1, p2, bufsStar = [], col = 4, row = 4
let b1 = "suoni/star_1.ogg" 
let b2 = "suoni/star_2.ogg"
let b3 = "suoni/star_3.ogg"
let pos = []
let img1
let p = 0

let wic

function setup(){
  createCanvas(displayWidth, displayHeight)
  background(0)

  Tone.start();

  filt = new Tone.Filter(2500, "lowpass", -12).toDestination() 
  img1 = loadImage("sfondi/sfondo_2.png")
  img2 = loadImage("sfondi/sfondo_3.png")
  bufs = [new Tone.ToneAudioBuffer(s1), new Tone.ToneAudioBuffer(s2)]
  bufsStar = [new Tone.ToneAudioBuffer(b1), new Tone.ToneAudioBuffer(b2), new Tone.ToneAudioBuffer(b3)]
  rev  = new Tone.Reverb().toDestination(); 
  rev.decay = 4;                                
  rev.wet   = 1; 
  smooth()
}

function draw() {
  noCursor()
  switch (wic){
    case 0:
      bubbleGame();
      break;
    case 1:
      pluck()
      break;
    case 2:
      force()
      break;
    case 3:
      galaxy()
      break;
  }    
}


function mousePressed(){
  fullscreen(true)
  switch (wic){
    case 0:
      for (let i = bubbles.length - 1; i >= 0; i--){
        if(bubbles[i].over(mouseX, mouseY)){
          bubbles[i].stop();
          bubbles.splice(i, 1);
          check++;  
        }
      }
    break;
  }
}

function mouseReleased(){
  switch (wic){
    case 0:
      let b = new Bubble();
      bubbles.push(b);
      b.start();
      spawn++;
      break;
    case 1:
      break;
    case 2:
      break;
  } 
}
function mouseDragged(){
  for(let m of movers){
    if(m.mouseOver == true){
      m.newPos(2)
    }
  }
}
let t = 0
function mouseClicked(){
  switch(wic){
    case 2:
      if(t == 0){
        let m = new Mover(mouseX, mouseY, bufs[0], bufs[1])
        movers.push(m)
      }
      t = 1
      for(let mover of movers){
        if(mover.mouseOver(mouseX, mouseY) == false){
          setTimeout(() => {mover.newPos(1)}, random(tMin, tMax)) 
        } else {
          mover.newPos(2)
          if(movers.length <= maxDens){
            let m = new Mover(mouseX, mouseY, bufs[0], bufs[1])
            movers.push(m)
          }
        }
      }
      break;
  }
}

function keyPressed(){

  if(key == 1){
    wic = 0
    for(let ob of o){
      ob.stop()
    }
    o = []
    for(let m of movers){
      m.stop()
    }
    movers = []
    trig = false
    for(let ss of s){
      ss.stop()
    }
    s = []
    c = []
  } 
  if(key == 2){
    wic = 1
    i = 0
    for(let b of bubbles){
      b.stop()
    }
    bubbles = []
    check = 0
    spawn = 0
    alive = 0
    for(let m of movers){
      m.stop()
    }
    movers = []
    trig = false
    for(let ss of s){
      ss.stop()
    }
    s = []
    c = []
  } 
  if(key == 3){
    wic = 2
    t = 0
    for(let b of bubbles){
      b.stop()
    }
    bubbles = []
    check = 0;
    spawn = 0;
    alive = 0;
    for(let ob of o){
      ob.stop()
    }
    o = []
    for(let ss of s){
      ss.stop()
    }
    s = []
    c = []
  }
  if(key == 4){
    wic = 3
    p = 0
    for(let ob of o){
      ob.stop()
    }
    o = []
    for(let m of movers){
      m.stop()
    }
    movers = []
    trig = false
    for(let b of bubbles){
      b.stop()
    }
    bubbles = []
    check = 0;
    spawn = 0;
    alive = 0;
  }

  switch (wic){
    case 0:
      if(keyCode == 32){
        for(let i = bubbles.length - 1; i >= 0; i --){
          bubbles[i].stop();
          bubbles.splice(i, 1);
        }
        bubbles = []
        check = 0;
        spawn = 0;
        alive = 0;
      }
      break;
    case 1:
      break;
    case 2:
      if(keyCode == 32){
        for(let i = movers.length-1; i >= 0; i--){
          movers[i].stop()
        }
        movers = []
      }
      break;
  }
}

function bubbleGame(){

  cursor()
  background(0, 80);
  fill(255);
  textSize(24)
  stroke(0.1)
  text("spawn = " + spawn, 10, 20);
  text("check = " + check, 10, 50);
  text("alive = " + alive, 10, 80)
  for (let bubble of bubbles){
    if(bubble.over(mouseX, mouseY)){
      bubble.changeColor(255);
    } else {
      bubble.changeColor(0);
    }
    bubble.move();
    bubble.show();
  }
  alive = bubbles.length

}

function pluck(){
  
  densX = floor(random(2, 7))
  densY = floor(random(2, 7))
  size = 32 - (densX + densY)
  x = width / (densX + 1)
  y = height / (densY + 1)  
  if(i == 0){

    for (let i = 0; i < densX; i++) {
      for (let j = 0; j < densY; j++) {
        if (random(100) >= 50) {
          let ob = new OggettoSonoro(random([1, 2]), (i + 1) * x, (j + 1) * y, size)
          o.push(ob);
        }
      }
    }

  }

  i = 1

  noCursor()
  background(0)
  stroke(255)
  strokeWeight(0.1)
  for(let i = 0; i < densY; i ++){
    line(0, y*(i+1), width, y*(i+1))
  }
  for(let i = 0; i < densX; i ++){
    line(x*(i+1), 0, x*(i+1), height)
  }
  strokeWeight(0.5)
  line(mouseX, 0, mouseX, height)
  line(0, mouseY, width, mouseY)
  for(let ob of o){
    ob.show()
    ob.play(mouseX, mouseY)
    ob.blink(0, 255)
  }

}

function force(){
  background(0)
  image(img2, 0, 0, width, height)
  tint(255, 50)
  stroke(255, 75)
  strokeWeight(10)
  point(mouseX, mouseY)

  if(t == 1 && movers.length == 0){
    t = 0
  }

  for(let mover of movers){
    mover.move()
    mover.bounce()
    mover.mouseOver(mouseX, mouseY)
    mover.appearance(50, 100, 200)
    mover.show()
    for(let mv of movers){
      if(mover != mv){
        mover.drawLine(mv)
        state = mover.shapeOver(mv)
      }
    }
  }
  if(state!=trig){
    trig = state
    if(trig){
      for(let i = 0; i < 1; i++){
        setTimeout(() => {
            let x = new Glitch(random(0.05, 0.5))
            x.play()
        }, random(0.1, 1)*1000)
      }
    }
  }

}

function galaxy(){

  if(p==0){
    background(0)
    noCursor()
    smooth()
    for(let i = 0; i < row; i ++){
      let x = ((width / row) + (width / row) * i) - (width / row)/2
      for(let j = 0; j < col; j++){
        let r = random(width / (row*4), width / (row*3))
        let y = ((height / col) + (height / col) * j) - (height / col)/2
        pos.push([x, y])
        let cc = new Curve(x, y, r, random(3, 7))
        c.push(cc)
      }
    }
  
    for(let i = 0; i < d; i++){
      let tar = random(pos)
      let ss = new Star(tar[0], tar[1], 100)
      s.push(ss)
    }
  
    p1 = new Pen(0.1, 0.75)
    p2 = new Pen(0.005, 0)
  }

  p = 1
  background(0, 50)
  image(img1, 0, 0, width, height)
  tint(255, 25)

  p1.flow(mouseX, mouseY, 1)
  p2.flow(mouseX, mouseY, 0)

  for (let cc of c) {
    cc.show()
    let ss = random(s)
    if(cc.checkCollision(p1.x, p1.y)){
      ss.updatePos()
    }
  }

  for (let ss of s) {
    ss.pow(p1.x, p1.y)
    ss.move()
    ss.play()
    ss.mod = pow(p2.weight, 1.5)
    ss.show()
  }

}
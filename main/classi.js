class Mover {

    constructor(x, y, b1, b2) {

        // quadrato
        this.min = 80
        this.max = 200
        this.r = random(this.min, this.max)
        this.pos = createVector(x, y)
        this.vel = createVector(0, 0)
        this.acc = createVector(0, 0)
        this.target = createVector(0, 0)
        this.arrivato = true
        this.mu = map(this.r, this.min, this.max, 0.2, 0.4)
        this.velMax = map(this.r, this.min, this.max, 0.9, 0.5)
        this.b = 50
        this.ofR = random(1000)
        this.ofG = random(1000)
        this.ofB = random(1000)
        this.amt = map(this.r, this.min, this.max, 0.08, 0.0001)
        this.col = color(0, 0, 0, this.b)

        // figure interne
        this.densX = random([2, 4, 6])
        this.densY = random([2, 4, 6])
        this.ofX = this.r * 2 / this.densX
        this.ofY = this.r * 2 / this.densY
        this.posP = []
        this.probP = []
        this.pointProb()

        // overlap con altre figure
        this.over = false

        // audio
        this.buf1 = b1
        this.buf2 = b2
        this.xF = new Tone.CrossFade().connect(rev)
        this.xF.toDestination()
        this.pl1 = new Tone.Player(this.buf1).connect(this.xF.a)
        this.pl2 = new Tone.Player(this.buf2).connect(this.xF.b)
        setTimeout(() => { this.pl1.start() }, 10)
        setTimeout(() => { this.pl2.start() }, 10)
        this.pl1.fadeIn = 0.02
        this.pl2.fadeIn = 0.02
        this.pl1.loop = true
        this.pl2.loop = true
        this.size1 = map(this.r, this.min, this.max, 0.2, random(0.1, 2))
        this.size2 = map(this.r, this.min, this.max, 0.2, random(0.1, 2))
        this.start1 = map(this.pos.x, 0, width, 0, this.buf1.duration - 2.5)
        this.end1 = this.start1 + this.size1
        this.start2 = map(this.pos.x, 0, width, 0, this.buf2.duration - 2.5)
        this.end2 = this.start2 + this.size2
        this.pl1.loopStart = constrain(this.start1, 0, this.buf1.duration)
        this.pl1.loopEnd = constrain(this.end1, 0, this.buf1.duration)
        this.pl2.loopStart = constrain(this.start2, 0, this.buf2.duration)
        this.pl2.loopEnd = constrain(this.end2, 0, this.buf2.duration)
        this.rate = map(this.r, this.min, this.max, 1.5, 0.15)
        this.pl1.playbackRate = this.rate
        this.pl2.playbackRate = this.rate
        this.vol = map(this.r, this.min, this.max, -6, -18)
        this.pl1.volume.rampTo(this.vol, 0.02)
        this.pl2.volume.rampTo(this.vol, 0.02)

    }

    pointProb() {
        for (let i = 0; i < this.densX; i++) {
            for (let j = 0; j < this.densY; j++) {
                if (random(100) > 50) {
                    this.probP.push(1)
                } else {
                    this.probP.push(0)
                }
            }
        }
    }

    pointPos(posX, posY) {
        for (let i = 0; i < this.densX; i++) {
            let xP = ((this.ofX * (i + 1)) + posX) - (this.r + this.ofX / 2)
            for (let j = 0; j < this.densY; j++) {
                let yP = ((this.ofY * (j + 1)) + posY) - (this.r + this.ofY / 2)
                if (this.probP[j + (i * this.densY)] == 1) {
                    this.posP.push([xP, yP])
                }
            }
        }
    }

    move() {

        if (!this.arrivato) {                                     // se la palla non è arrivata la target

            this.dist = p5.Vector.dist(this.pos, this.target)   // calcola la distanza tra la posizione attuale
            // e quella a cui deve arrivare
            if (this.dist > 0.1) { // se è maggiore di una certa soglia, allora...

                this.dir = p5.Vector.sub(this.target, this.pos) // calcola la direzione di movimento
                this.dir.normalize()                            // normalizzala
                this.dir.mult(this.velMax)                      // clippala per la velocità massima

                this.acc = this.dir                             // l'accelerazione è uguale alla direzione

                this.attr = this.vel.copy().mult(-1)            // forza di frizione opposta alla velocità
                this.attr.normalize()
                this.attr.mult(this.mu)                         // riscalato per il coefficiente di attrito
                this.acc.add(this.attr)
                this.acc.div(this.mu * 4)

            } else { // quando l'oggetto si trova nella suona nuova posizione
                // spegne il motore
                this.acc.mult(0)
                this.vel.mult(0)
                this.arrivato = true
            }
            // il motore
            this.vel.add(this.acc)
            this.pos.add(this.vel)

        }

        this.start1 = map(this.pos.x, 0, width, 0, this.buf1.duration - 2.5)
        this.end1 = this.start1 + this.size1
        this.start2 = map(this.pos.x, 0, width, 0, this.buf2.duration - 2.5)
        this.end2 = this.start2 + this.size2

        this.pl1.loopStart = constrain(this.start1, 0, this.buf1.duration)
        this.pl1.loopEnd = constrain(this.end1, 0, this.buf1.duration)
        this.pl2.loopStart = constrain(this.start2, 0, this.buf2.duration)
        this.pl2.loopEnd = constrain(this.end2, 0, this.buf2.duration)

        this.xF.fade.value = constrain(map(this.pos.y, this.r, height - this.r, 0, 1), 0, 1)

        this.vel2 = this.vel.copy()
        this.pl1.playbackRate = constrain(abs(Math.pow(this.rate + (this.vel2.normalize().x * this.vel2.normalize().y), 2)), 0.25, 10)
        this.pl2.playbackRate = constrain(abs(Math.pow(this.rate + (this.vel2.normalize().x * this.vel2.normalize().y), 2)), 0.25, 10)

    }

    newPos(v) {
        // nuova posizione da raggiungere
        if (v == 1) {// posizione random
            this.target = createVector(random(width), random(height))
        } else if (v == 2) { // posizione del mouse
            this.target = createVector(mouseX, mouseY)
        }
        // non è arrivato, di conseguenza muoviti!
        this.arrivato = false
    }

    bounce() {
        if (this.pos.y >= height - this.r) {
            this.pos.y = height - this.r
            this.vel.y *= -1
        } else if (this.pos.y <= this.r) {
            this.pos.y = this.r
            this.vel.y *= -1
        }
        if (this.pos.x >= width - this.r) {
            this.pos.x = width - this.r
            this.vel.x *= -1
        } else if (this.pos.x <= this.r) {
            this.pos.x = this.r
            this.vel.x *= -1
        }
    }

    show(r, g, b) {
        strokeWeight(2)
        stroke(this.col, this.b)
        fill(this.col)
        rectMode(CENTER)
        rect(this.pos.x, this.pos.y, this.r * 2)
        this.pointPos(this.pos.x, this.pos.y)
        strokeWeight(1)
        if (this.posP.length >= 2) {
            beginShape(TRIANGLES)
            noFill()
            for (let i = 0; i < this.posP.length; i++) {
                vertex(this.posP[i][0], this.posP[i][1])
            }
            endShape(CLOSE)
        } else {
            for (let i = 0; i < this.posP.length; i++) {
                point(this.posP[i][0], this.posP[i][1])
            }
        }

        this.posP = []

    }

    mouseOver(x, y) {
        this.d2 = dist(this.pos.x, this.pos.y, x, y)
        if (this.d2 < this.r) {
            this.b = 50
            return true
        } else {
            this.b = 100
            return false
        }
    }

    shapeOver(other) {
        this.d1 = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
        if (this.d1 < this.r + other.r) {
            return true
        } else {
            return false
        }
    }

    appearance(r, g, b) {

        this.red = (noise(this.ofR) / 2) + 0.3
        this.grn = (noise(this.ofG) / 2) + 0.3
        this.blu = (noise(this.ofB) / 2) + 0.3

        this.col = color(r * this.red, g * this.grn, b * this.blu, this.b)

        this.ofR += this.amt
        this.ofG += this.amt
        this.ofB += this.amt

    }

    stop() {

        this.pl1.stop("+0")
        this.pl2.stop("+0")
        this.pl1.disconnect()
        this.pl2.disconnect()
        this.xF.disconnect()

    }

    drawLine(obj) {
        stroke(255, 50)
        strokeWeight(0.3)
        line(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y)
    }



}

class Glitch {

    constructor(dur) {
        this.stop = dur
        this.env = new Tone.AmplitudeEnvelope({
            attack: 0.02,
            decay: 0,
            sustain: 1,
            release: this.stop
        }).connect(rev)
        this.env.toDestination()
        this.synth = new Tone.AMOscillator(random(5000, 8000), random(["sine", "square", "sawtooth"]), "square").connect(this.env).start()
        this.harm = random(0.001, 0.01)
        this.synth.harmonicity.setValueAtTime(this.harm, "+0")
    }

    play() {
        this.env.triggerAttackRelease(this.stop, "+0", random(0.1, 0.2))

        setTimeout(() => {
            this.synth.stop("+0")
            this.synth.disconnect()
            this.env.disconnect()
        }, this.stop * 1000)

    }

    stop() {
        this.synth.stop("+0")
        this.synth.disconnect()
        this.env.disconnect()
    }

}

class OggettoSonoro {

    constructor(t, x, y, r) {
        this.x = x
        this.y = y
        this.r = r
        this.t = t
        this.c = 0
        this.r2 = createVector(r * 2)
        this.cond = false

        this.time = random(["2n", "4n", "8n", "16n"])
        if (t == 1) {
            this.fdb = random(0.6, 0.95)
        } else {
            this.fdb = random(0.1, 0.3)
        }
        this.del = new Tone.FeedbackDelay(this.time, this.fdb).toDestination()
        this.synth = new Tone.PluckSynth().toDestination()
        this.synth.connect(this.del)
        this.del.connect(rev)
        if (t == 1) {
            this.synth.attackNoise = 0.1
            this.synth.dampening = 300
            this.synth.resonance = 0.96
            this.synth.release = 2
        } else {
            this.synth.attackNoise = 2
            this.synth.dampening = 500
            this.synth.resonance = 0.8
            this.synth.release = 2
        }
        this.freq = random(["C3", "E4", "G3", "B4", "C5", "E5", "G4", "B5", "F2", "A4", "Bb5", "D5", "F3", "A3", "Bb3", "D4"])

    }

    show() {
        stroke(255)
        strokeWeight(2)
        if (this.t == 1) {
            fill(this.c, 150)
            ellipse(this.x, this.y, this.r * 2)
            fill(255 - this.c, 150)
            rectMode(CENTER)
            rect(this.x, this.y, this.r / 2)
        } else if (this.t == 2) {
            fill(this.c, 150)
            rectMode(CENTER)
            rect(this.x, this.y, this.r * 2, this.r * 2)
            fill(255 - this.c, 150)
            ellipse(this.x, this.y, this.r / 2)
        }
    }

    checkCollision(x, y) {
        if ((y >= (this.y - this.r) && y <= (this.y + this.r)) || (x >= (this.x - this.r) && x <= (this.x + this.r))) {
            return true
        } else {
            return false
        }
    }

    blink(on, off) {
        if (this.state) {
            this.c = 100
        } else {
            this.c = 0
        }
    }

    play(x, y) {

        this.state = this.checkCollision(x, y)
        if (this.state !== this.cond) {
            this.cond = this.state
            if (this.cond == true) {
                this.c = 150
                this.rit = random(0.001, 0.01)
                this.synth.triggerAttack(this.freq, str("+" + this.rit))
            }
        } else {
            this.c = 0
        }

    }

    stop() {
        this.synth.disconnect()
        this.fdb = 0
        // this.del.wet(0)
        this.del.disconnect()
        //this.del.dispose()
    }

}

class Bubble {
    
    constructor() {

        this.r = random(5, 80);
        this.a = random(20, 100);
        this.c = 255;
        this.b = map(this.r, 5, 80, 0.5, 3);
        this.ofX = random(10000);
        this.ofY = random(10000);
        this.s = map(this.r, 5, 80, 0.008, 0.0001);

        this.oct = int(random(-2, 2))
        this.freq = random([41, 60, 62, 65, 67, 69, 70, 72, 89]);
        this.freq = Tone.Frequency(this.freq + (this.oct * 12), "midi").toFrequency()
        this.amp = map(this.r, 5, 80, 0.001, 0.2);
        this.release = random(2, 10)
        this.type = random([0, 1]);
        this.wave = ["sine", "square"]

        this.panner = new Tone.Panner().connect(filt)
        this.panner.connect(rev)
        this.env = new Tone.AmplitudeEnvelope({
            attack: 0.01,
            decay: 0.2,
            sustain: 0.25,
            release: this.release
        }).connect(this.panner);
        this.env.attackCurve = "exponential"
        this.env.decayCurve = "linear"

        this.synth = new Tone.Oscillator(this.freq, this.wave[this.type]).connect(this.env);
        this.synth.start();

    }

    move() {
        this.x = map(noise(this.ofX), 0, 1, 0, width);
        this.y = map(noise(this.ofY), 0, 1, 0, height);
        this.ofX += this.s;
        this.ofY += this.s;
        this.panner.pan.rampTo(map(this.x, 0, width, -1, 1), 0.02)
        this.vol = -abs(map(this.y, height / 2, height, 0, -24))
        this.synth.volume.rampTo(this.vol, 0.02)
    }

    show() {
        fill(this.c, this.a);
        stroke(200);
        strokeWeight(this.b);
        rectMode(CENTER)
        if (this.type == 0) {
            ellipse(this.x, this.y, this.r * 2);
        } else {
            rect(this.x, this.y, this.r * 2)
        }
    }

    over(px, py) {
        let d = dist(px, py, this.x, this.y);
        if (d < this.r) {
            return true;
        } else {
            return false;
        }
    }

    changeColor(bright) {
        this.c = bright;
    }

    start() {
        this.env.triggerAttack("+0", this.amp)
    }

    stop() {
        this.env.triggerRelease()
        this.synth.stop("+" + str(this.release))
        setTimeout(() => { this.panner.disconnect() }, this.release * 1000)

    }
}
class Star {

    n = []
    vel = []
    acc = []
    target = []
    mu = []
    velMax = []
    arrivato = []

    constructor(x, y, r) {

        this.alpha = 0
        this.randRange = random(r / 2, r)
        this.ancor = createVector(x, y)
        this.raggio = r
        this.mod = 0
        this.nX = random(1000)
        this.nY = random(1000)
        this.speed = random(0.01, 0.1)
        this.rx = 0
        this.ry = 0
        this.dens = random(5, 12)
        this.densInt = random(3, 6)
        this.modRx = 0
        this.modRy = 0

        this.aX = random(1000)
        this.aY = random(1000)
        this.aSpeed = 0.0001
        this.aRange = 1

        this.cond = false
        this.col = false

        this.gate = 0

        this.pl = new Tone.Player(random(bufs)).toDestination()
        this.pl.connect(rev)
        this.pl.fadeIn = 0.02
        this.pl.fadeOut = random(4, 12)
        this.pl.loop = false

        for (let i = 0; i < this.densInt; i++) {

            this.n.push(createVector(random(-this.raggio, this.raggio) / 3, random(-this.raggio, this.raggio) / 3))
            this.acc.push(createVector(0, 0))
            this.vel.push(createVector(0, 0))
            this.target.push(createVector(0, 0))
            this.velMax.push(random(0.7, 1))
            this.mu.push(random(0.2, 0.6))
            this.arrivato.push(true)

        }

        for (let i = 0; i < this.densInt; i++) {
            this.velMax[i] = random(0.6, 0.95)
            this.mu[i] = random(0.2, 0.6)
        }

    }

    show() {

        this.rx = map(noise(this.nX), 0, 1, -1, 1) * this.mod
        this.ry = map(noise(this.nY), 0, 1, -1, 1) * this.mod
        this.nX += this.speed
        this.nY += this.speed

        strokeWeight(1)
        stroke(200, 150 * this.alpha)
        beginShape(LINES)
        for (let i = 0; i < this.dens; i++) {
            strokeWeight(1)
            vertex(this.ancor.x, this.ancor.y)
            let x = sin(i)
            let y = cos(i)
            strokeWeight(1)
            vertex(this.ancor.x + (x * ((this.raggio + this.modRx) / 2) + this.rx), this.ancor.y + (y * ((this.raggio + this.modRy) / 2) + this.ry))
            strokeWeight(8)
            point(this.ancor.x + (x * ((this.raggio + this.modRx) / 2) + this.rx), this.ancor.y + (y * ((this.raggio + this.modRy) / 2) + this.ry))
            strokeWeight(1)
        }
        endShape()

        stroke(255, 100 * this.alpha)
        for (let j = 0; j < this.densInt; j++) {
            beginShape(LINES)
            for (let i = 0; i < this.dens; i++) {
                strokeWeight(0.25)
                vertex(this.ancor.x + this.n[j].x, this.ancor.y + this.n[j].y)
                strokeWeight(4)
                point(this.ancor.x + this.n[j].x, this.ancor.y + this.n[j].y)
                let x = sin(i)
                let y = cos(i)
                strokeWeight(0.25)
                vertex(
                    this.ancor.x + (x * ((this.raggio + this.modRx) / 2) + this.rx),
                    this.ancor.y + (y * ((this.raggio + this.modRy) / 2) + this.ry))
            }
            endShape()
        }

    }

    move() {

        for (let i = 0; i < this.densInt; i++) {

            if (!this.arrivato[i]) {

                let d = p5.Vector.dist(this.n[i], this.target[i])

                if (d > 0.05) {

                    let dir = p5.Vector.sub(this.target[i], this.n[i])
                    dir.normalize()
                    dir.mult(0.4)

                    this.acc[i] = dir

                    let attr = this.vel[i].copy()
                    attr.mult(-1)
                    attr.normalize()
                    attr.mult(this.mu[i])
                    this.acc[i].add(attr)
                    this.acc[i].div(this.mu[i])
                    this.acc[i].mult(0.1)

                } else {
                    this.acc[i].mult(0)
                    this.vel[i].mult(0)
                    if (this.gate == 1) {
                        this.target[i].mult(0)
                        this.target[i] = createVector(random(-this.raggio, this.raggio) / 3, random(-this.raggio, this.raggio) / 3)
                        this.arrivato[i] = false
                        this.velMax[i] = random(0.6, 0.95)
                        this.mu[i] = random(0.1, 0.4)
                    } else {
                        this.arrivato[i] = true
                    }
                }

                this.vel[i].add(this.acc[i])
                this.n[i].add(this.vel[i])

            }

        }

    }

    updatePos() {
        let tar = random(pos)
        this.ancor.x = tar[0]
        this.ancor.y = tar[1]
    }

    pow(x, y) {

        let d = dist(x, y, this.ancor.x, this.ancor.y)
        if (d < this.raggio / 2) {
            this.alpha = 1
            this.gate = 1
            this.col = true
            for (let i = 0; i < this.dens; i++) {
                this.arrivato[i] = false
                this.speed = random(0.001, 0.05)
                this.modRx = (1 + this.rx) * this.randRange
                this.modRy = (1 + this.ry) * this.randRange
            }
        } else {
            this.randRange = random(this.raggio / 2, this.raggio)
            this.gate = 0
            this.col = false
            if (this.modRx >= 1) {
                this.modRx -= 1
            }
            if (this.modRy >= 1) {
                this.modRy -= 1
            }
            if (this.alpha > 0) {
                this.alpha -= 0.005
            }
        }

    }

    play() {
        this.rate = random([0.5, 0.75, 1, 1.5, 1.33, 2, 2.5, 3])
        this.state = this.col
        if (this.state != this.cond) {
            this.cond = this.state
            if (this.cond == true) {
                this.pl.buffer = random(bufsStar)
                this.pl.playbackRate = this.rate
                this.pl.volume.rampTo(random(-12, -3), 0.02)
                this.pl.start("+0")
                setTimeout(() => { this.pl.stop() }, random(5000, 16000))
            }
        }
    }
    stop() {
        this.pl.stop("+0")
        this.pl.disconnect()
    }

}

class Curve {

    constructor(x, y, r, d) {

        this.ancor = createVector(x, y)
        this.densInt = d
        this.intPos = []
        this.range = r
        this.incY = random(1000)
        this.incX = random(1000)
        this.vel = random(0.001, 0.01)
        this.coll = false

        for (let i = 0; i < this.densInt; i++) {

            let x2 = random(this.ancor.x - this.range / 2, this.ancor.x + this.range / 2)
            let y2 = random(this.ancor.y - this.range / 2, this.ancor.y + this.range / 2)
            let x3 = random(this.ancor.x - this.range / 2, this.ancor.x + this.range / 2)
            let y3 = random(this.ancor.y - this.range / 2, this.ancor.y + this.range / 2)

            this.intPos.push([x2, y2, x3, y3])

        }

    }

    show() {

        fill(0, 50)
        stroke(255, 150)
        strokeWeight(0.5)

        beginShape()

        let nx = map(noise(this.incX), 0, 1, -1, 1) * this.range
        let ny = map(noise(this.incY), 0, 1, -1, 1) * this.range

        vertex(this.ancor.x + nx, this.ancor.y + ny)

        for (let j = 0; j < this.densInt; j++) {
            bezierVertex(this.ancor.x + nx, this.ancor.y + ny,
                this.intPos[j][0], this.intPos[j][1],
                this.intPos[j][2], this.intPos[j][3],
            )
        }

        endShape(CLOSE)

        this.incX += this.vel
        this.incY += this.vel

    }

    over(x, y) {
        let d = dist(x, y, this.ancor.x, this.ancor.y)
        if (d < this.range / 2) {
            return true
        } else {
            return false
        }
    }

    checkCollision(x, y) {
        this.state = this.over(x, y)
        if (this.state !== this.coll) {
            this.coll = this.state
            if (this.coll == true) {
                return true
            } else {
                return false
            }
        }
    }

}

class Pen {

    constructor(s, b) {
        this.x = 0
        this.y = 0
        this.e = s
        this.px = 0
        this.py = 0
        this.b = b
        this.g = 0
    }

    flow(mx, my, g) {
        this.x += (mx - this.x) * this.e
        this.y += (my - this.y) * this.e
        this.g = g

        this.weight = dist(this.x, this.y, this.px, this.py)

        if (g == 1) {
            stroke(255)
            strokeWeight(this.b + this.weight)
            line(this.x, this.y, this.px, this.py)
        }

        this.px = this.x
        this.py = this.y
    }


}
function Player(gameAreaWidth, gameAreaHeight, bulletSet) {
  this.width = Math.floor(gameAreaWidth / 15);
  this.height = Math.floor(this.width / 2);

  this.hpos = 50;
  this.vpos = gameAreaHeight / 2;

  const center = [this.hpos + (this.width / 2), this.vpos + (this.height / 2)];

  this.speed = Math.round(this.width / 20);
  this.vsp = 0;
  this.hsp = 0;

  const colorInterval = 5;
  let colorOffset = 0;

  const shootInterval = 30;

  this.pause = false;

  this.move = function() {
    if (! (this.pause)) {
      // Up and down movement with the 'w' and 's' keys.
      if (! (keyIsDown(87) && keyIsDown(83))) {
        if (keyIsDown(87) && this.vpos > 5) {
          this.vsp = -this.speed;
        }
        else if (keyIsDown(83) && this.vpos < gameAreaHeight -this.height -5) {
          this.vsp = this.speed;
        }
      }
      this.vpos += this.vsp;
      this.vsp = 0;

      // Left and right movement with the 'a' and 'd' keys. 
      if ( ! (keyIsDown(65) && keyIsDown(68))) {
        if (keyIsDown(65) && this.hpos > 5) {
          this.hsp = -this.speed;
        }
        else if (keyIsDown(68) && this.hpos < gameAreaWidth - this.width - 5) {
          this.hsp = this.speed;
        }
      }
      this.hpos += this.hsp;
      this.hsp = 0;
    }

    center[0] = this.hpos + (this.width / 2);
    center[1] = this.vpos + (this.height / 2);
  }

  this.display = function() {
    ellipseMode(CORNER);
    strokeWeight(2)

    if (frameCount % colorInterval === 0 && this.pause === false) {
      if (colorOffset === 255) {
        colorOffset = 0;
      }
      else {
        colorOffset = 255;
      }
    }
    stroke(0 + colorOffset);
    fill(255 - colorOffset);
    ellipse(this.hpos, this.vpos, this.width, this.height);
    strokeWeight(1);
    triangle(
      this.hpos, this.vpos + (this.height / 2), 
      this.hpos + (this.width / 2), this.vpos, 
      this.hpos + (this.width / 2), this.vpos + this.height
    );
    triangle(
      this.hpos + (this.width / 2), this.vpos, 
      this.hpos + (this.width / 2), this.vpos + this.height,
      this.hpos + this.width, this.vpos + (this.height / 2)
    )
    for(let i = 0 ; i < 5 ; i++) {
      line(this.hpos + this.width, this.vpos + (this.height / 2), this.hpos + (this.width / 2), this.vpos + ((this.height / 5)* i));
      line(this.hpos, this.vpos + (this.height / 2), this.hpos + (this.width / 2), this.vpos + ((this.height / 5)* i));
    }
  }

  this.shoot = function() {
    if(frameCount % shootInterval === 0 && (! (this.pause))) {
      bulletSet.createBullet(this.hpos + this.width - 5, this.vpos + (this.height / 3));
      playerShootsSound.play(); 
    }
  }
}
function Player(gameAreaWidth, gameAreaHeight) {
  this.width = Math.floor(gameAreaWidth / 15);
  this.height = Math.floor(this.width / 2);

  this.hpos = 50;
  this.vpos = gameAreaHeight / 2;

  const center = [this.hpos + (this.width / 2), this.vpos + (this.height / 2)];

  this.speed = Math.round(this.width / 10);
  this.vsp = 0;
  this.hsp = 0;

  const colorInterval = 5;
  let colorOffset = 0;

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

    // We update the coordinates of the attack rect.
    this.attackRect.x = this.hpos + this.width;
    this.attackRect.y = this.vpos;
  }

  this.display = function() {
    ellipseMode(CORNER);
    strokeWeight(2)

    if (frameCount % colorInterval === 0) {
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



  // ATTACKING ////////////////////////////////////////////////////////////////////////////////////////
  // The player can attack for a certain duration of time
  this.attacking = false;
  const attackTime = 5;
  let attackTimer = 0;

  // After attacking, there is a cooldown period.
  this.attackCoolDown = false;
  const attackCoolDownTime = 20;
  let attackCoolDownTimer = 0;

  // Here we define the area that contains the player's attack. 
  this.attackRect = {
    x : this.hpos + this.width,
    y : this.vpos,
    width: this.width * 2,
    height: this.height
  }

  this.attack = function() {

    // Attack Timing ////////////////////////////////////////////////////////////////
    // Cool Down
    if (this.attackCoolDown) {
      if (attackCoolDownTimer <= attackCoolDownTime) {
        attackCoolDownTimer += 1;
      }
      else {
        this.attackCoolDown = false;
        attackCoolDownTimer = 0;
      }
    }
    // Attacking: the player can attack by pressing spacebar. We trigger a sound effect. 
    else if (this.attacking === false && this.pause === false && keyIsDown(32)) {
      this.attacking = true;
      playerAttacksSound.play();
    }
    else if (this.attacking) {
      if (attackTimer <= attackTime) {
        attackTimer += 1;
      }
      else {
        this.attacking = false;
        attackTimer = 0;
        this.attackCoolDown = true;
      }
    }

    // Attack Display ////////////////////////////////////////////////////////////////
    if (this.attacking) {
      let attackEllipseX = this.attackRect.x + this.attackRect.width;
      let attackEllipseY = this.attackRect.y;
      let attackEllipseWidth = this.attackRect.height;
      let attackEllipseHeight = this.attackRect.height;
      ellipseMode(CORNER);
      strokeWeight(3);

      for (let i = 0 ; i < 5 ; i++ ) {
        attackEllipseHeight = this.attackRect.height - ((this.attackRect.height / 7) * i);
        attackEllipseX = attackEllipseX - (this.attackRect.width / 5);
        attackEllipseY = this.attackRect.y + ((this.attackRect.height / 14) * i);
        attackEllipseWidth = (this.attackRect.width / 5);
        if (attackEllipseX >= this.attackRect.x) { 
          ellipse(attackEllipseX, attackEllipseY, attackEllipseWidth, attackEllipseHeight);
        }
      }
    }
  }
}
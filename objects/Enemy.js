function Enemy(position, size, speed, movementType, angleChange=0, waveHeight=0) {
  this.x = position[0];
  this.y = position[1];
  this.rect = {
    width: size * 2,
    height: size * 2,
    x: this.x - (size / 2),
    y: this.y - (size / 2)
  }
  this.speed = speed;
  let angle = 0;
  this.pause = false;

  // Front Circle
  const fcSections = 6;
  const fcPulseInterval = 10;
  let brightSection = 5;

  // Tail
  const tailLength = size;
  const tailPositions = [];
  const segmentDistance = 5;
  for (let i = 0 ; i < tailLength ; i++) {
    tailPositions[i] = [this.x, this.y];
  }
  const tailPulseInterval = 6 - speed;
  let brightSegment = 1;

  // Hit by Bullet
  this.hit = false;
  const numOfSegmentParticles = 100;
  const segmentParticleCoordinates = [];
  this.disintegrationCounter = 0;

  // SoundEffects
  let entranceSoundPlayed = false;
  
  this.display = function() {

    ellipseMode(RADIUS);
    strokeWeight(0);
    fill(255);

    // ENTRANCE SOUND EFFECT /////////////////////////////////////////////////////////////////
    // When the enemy passes into view, we play the "enemy enters" sound. 
    if (this.x < gameArea.width && entranceSoundPlayed === false) {
      enemyEntersSound.play();
      entranceSoundPlayed = true;
    }

    // HIT BY BULLET //////////////////////////////////////////////////////////////////////////
    // If the enemy is hit, we start the distintegration process and start counting on the
    // 'disintegrationCounter' variable. 
    // We play the 'enemyHitSound' sound effect.
    // We set up a set of coordinates for the particles created by the "hit".
    if (this.hit) {
      if (this.disintegrationCounter === 0) {

        enemyHitSound0.play();
        enemyHitSound1.play();

        for (let i = 0 ; i < numOfSegmentParticles ; i++) {
          segmentParticleCoordinates[i] = [
            this.rect.x + (Math.random() * (size * 4)),
            (this.rect.y - size) + (Math.random() * (size * 4))            
          ]
        }
        this.disintegrationCounter += 1;
      }
      else {
        this.disintegrationCounter += 1;
      }
    }

    // EXPLOSION /////////////////////////////////////////////////////////////////////////////////////////////////
    // If an enemy touches the player or reaches the left of the game area...

    if (this.x <= 0 && explosion === false) {
      pauseEverything();
      explosion = true;
    }

    if (explosion) {
      
    }

    // TAIL ANIMATIONS //////////////////////////////////////////////////////////////////////////////////////////
    // We use an interval to determine which part of the tail is "bright".
    if (frameCount % tailPulseInterval === 0 && this.pause === false) {
      brightSegment += 1;
      if (brightSegment > tailLength - 1) {
        brightSegment = 1;
      }
    }

    // We position the tail based on the past positions of the front circle, which are stored in the array
    // 'tailPositions'. We also use the vertical directions, 'vdir' to determine whether an enemy is moving
    // up or down.
    for (let i = tailLength - 1 ; i > 0 ; i--) {
      tailPositions[i][0] = tailPositions[i - 1][0] + ((segmentDistance * speed) + Math.floor(Math.random() * 3));

      tailPositions[i][1] = tailPositions[i - 1][1];

      if (i === brightSegment) {
        fill(255);
      }
      else {
        fill(Math.floor(255 / (i + 1)));
      }

      // If the enemy has been hit and disintegrating, we don't draw every segment. 
      if (this.disintegrationCounter < i * (255 / size)) {
        ellipse(tailPositions[i][0], tailPositions[i][1], size - i, size - i);
      }
    }

    // Here we update the very first index in the array to be the current position of the front circle.
    tailPositions[0] = [this.x, this.y];


    // FRONT CIRCLE ANIMATIONS /////////////////////////////////////////////////////////////////////////////

    // If the enemy has not been hit...
    if (this.hit === false) {

      // The enemies front circle pulses at a set interval.
      if (frameCount % fcPulseInterval === 0 && this.pause === false) {
        brightSection -= 1;
        if (brightSection < 0) {
          brightSection = 5;
        }
      }
  
      for(let i = 0 ; i < fcSections ; i++) {
  
        if (i === brightSection) {
          fill(255);
        }
        else {
          fill(0 + (i * 10));
        }
  
        ellipse(this.x - (i * (size / fcSections)), this.y + (Math.floor(Math.random() * 3)), size - ((size / fcSections) * i), size - ((size / fcSections) * i));
  
      }
    }
    // If the enemy has been hit...
    else {
      stroke(255 - this.disintegrationCounter);
      strokeWeight(3);
      for (let i = 0 ; i < numOfSegmentParticles ; i++) {
        point(
          segmentParticleCoordinates[i][0] + this.disintegrationCounter + (Math.random() * 3), 
          segmentParticleCoordinates[i][1]);
      }
    }
  }

  // MOVEMENT ////////////////////////////////////////////////////////////////////////////////
  // We have the movement types of 'line' and 'wave'.

  this.move = function() {
    if (this.pause === false) {
      if (movementType === "line") {
        this.x += -this.speed;
      }
      else if (movementType === "wave") {
        this.x -= this.speed;
        this.y += sin(angle) * waveHeight;
        angle += angleChange;
      }


      // We need to update the 'rect' property as well, which is used for enemy/bullet collision detection.
      this.rect.x = this.x - size;
      this.rect.y = this.y - size;

    }
  }
}

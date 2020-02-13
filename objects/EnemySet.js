function  EnemySet() {
  // We keep track of each enemy created in this array.
  this.enemies = [];

  // Pausing stops all movement and animations.
  this.pause = false;

  // Collision with Player or with Player Attack ////////////////////////////////////////////////////

  this.checkIfEnemiesCollide = function(player) {

    // Are there enemies?
    if (this.enemies.length > 0) {

      let enemy;
      for (const enemyIndex in this.enemies) {
        enemy = this.enemies[enemyIndex];
        
        // Check to see if the enemy has been hit. 
        if (enemy.hit === false) {
          // Collision with player.
          if (collideRectRect(
            player.hpos, player.vpos, player.width, player.height,
            enemy.rect.x, enemy.rect.y, enemy.rect.width, enemy.rect.height) && explosion === false) 
          {
            pauseEverything();
            explosion = true;
            enemy.exploding = true;
            enemyExplodesSound.play();
          }

          // Is the enemy colliding with the player's attack?
          if (player.attacking) {
            if (
              collideRectRect(
                enemy.rect.x, enemy.rect.y, enemy.rect.width, enemy.rect.height, 
                player.attackRect.x, player.attackRect.y, player.attackRect.width, player.attackRect.height
              )
            ) {
              enemy.hit = true;
              enemy.pause = true;
            }
          }
        }
        // Here we remove the enemy from the array tracking all enemies. 
        else if (enemy.disintegrationCounter === 255) {
          this.enemies.splice(enemyIndex, 1);
        }
      }
    }
  }

  // Generate Enemies ////////////////////////////////////////////////////////////////////////////////

  // Positioning //////////////////////////////////////////////////////////
  // Vertical Range
  const verticalCenter = gameArea.height / 2;
  const numOfVerticalRanges = Math.floor((gameArea.height - 100) / 100);
  const vRanges = [];
  for (let i = 0 ; i < numOfVerticalRanges ; i++) {
    vRanges[i] = [50 + (i * 50), gameArea.height - 50 - (50 * i)];
  }

  // Horizontal Range
  const hpos = [
    gameArea.width - (gameArea.width / 3),
    gameArea.width - (gameArea.width / 5),
    gameArea.width,
    gameArea.width + (gameArea.width / 5),
    gameArea.width + (gameArea.width / 3)
  ]

  // Speeds
  const hspeedOffset = Math.floor((gameArea.width - minWidth) / 200); 

  const hspeed = [];

  for (let i = 0 ; i < 15 ; i++ ) {
    hspeed[i] = i + 1 + hspeedOffset;
  }


  // Offsets
  // Any offset we use will be reset  to zero at the beginning of a new phase, but can be used to 
  // add variety to stages of a single phase. 
  let offset0 = 0;

  // Timing ///////////////////////////////////////////////////////////////////////////////
  // The process of generating enemies takes place in a series of phases, which are in turn,
  // broken into a series of stages. For a given phase, each stage has an equivalent length, 
  // measured in seconds. The 'phase' variable keeps track of which phase we are in,
  // while the 'stage' variable keeps track of which stage of that phase we are in. 
  // The array 'phaseStructure' consists of a series of 2-member sub-arrays. Each sub-array
  // represents a phase. The first number in a sub-array represents the length, in seconds,
  // of each stage in that phase. The second number, the number of stages in that phase. 
  //  
  let phase = 0;
  const finalPhase = 16;
  let stage = 0;
  let stageStart = true;
  let frameCounter = 0;
  let seconds = 0;
  const phaseStructure = [
    [ 3, 1 ], // 0, rest phase
    [ 3, 3 ], // 1
    [ 3, 3 ], // 2
    [ 3, 1 ], // 3, rest phase
    [ 5, 1 ], // 4
    [ 4, 3 ], // 5
    [ 1, 10 ], // 6
    [ 3, 1 ], // 7, rest phase
    [ 3, 10 ], // 8
    [ 5, 1 ], // 9, rest phase
    [ 10, 1 ], // 10
    [ 5, 6 ], // 11
    [ 2, 6 ], // 12
    [ 5, 3 ], // 13
    [ 10, 1 ], // 14
    [ 4, 5 ] // 15
  ];


  this.generateEnemies = function() {

    // Timing, Stages and Phases /////////////////////////////////////////////////////////////
    // We check to see if we have reached the final phase. If not...
    if (phase !== finalPhase && this.pause === false) {

      // Update Time, Stage and Phase
      frameCounter += 1;
      seconds = Math.floor(frameCounter / 60);
      if(seconds === phaseStructure[phase][0]) {

        frameCounter = 0;
        seconds = 0;

        if (stage === phaseStructure[phase][1] - 1) {
          offset0 = 0; // Any offsets we use will be reset at the beginning of a new phase. 
          offset1 = 0;
          stage = 0;
          phase += 1;
          stageStart = true; // We want to trigger a reaction exactly when a stage has just started.
        }
        else {
          stage += 1;
          stageStart = true; // We want to trigger a reaction exactly when a stage has just started. 
        }
      }
    }

    if (stageStart) {
      if (phase === 1) {
        const vpos = randRange(vRanges[0][0], vRanges[0][1]);
        this.enemies.push(
          new Enemy( [hpos[2], vpos], 50, hspeed[2], "line")
        )
      }
      else if (phase === 2) {
        const vposOffset = randRange(100, 300);
        this.enemies.push(new Enemy([hpos[2], verticalCenter - vposOffset], 50, hspeed[1], "line"));
        this.enemies.push(new Enemy([hpos[2], verticalCenter + vposOffset], 50, hspeed[1], "line"));
      }
      else if (phase === 4) {
        this.enemies.push(new Enemy([hpos[2], verticalCenter], 200, hspeed[1], "line"))
      }
      else if (phase === 5) {
        const vposOffset = randRange(100, gameArea.height / 2);
        this.enemies.push(new Enemy([hpos[2], verticalCenter - vposOffset], 40, hspeed[1], "line"));
        this.enemies.push(new Enemy([hpos[2], verticalCenter + vposOffset], 40, hspeed[1], "line"));
        this.enemies.push(new Enemy([hpos[2], verticalCenter], 30, hspeed[4], "line"))       
      }
      else if (phase === 6) {
        const vpos = randRange(50, gameArea.height - 50);
        this.enemies.push( new Enemy([hpos[randRange(1, 4)], vpos], 40, hspeed[randRange(1,4)], "line"));
      }
      else if (phase === 8) {
        offset0 += 5;
        this.enemies.push(new Enemy([hpos[1], verticalCenter - (offset0 * 10)], 50, hspeed[randRange(0,2)], "wave", 0.1, 5 + offset0));
      }
      else if (phase === 10) {
        for (let i = 0 ; i < 9 ; i++) {
          const vpos = randRange(150 , gameArea.height - 150);
          const size = randRange(20, 40);
          this.enemies.push(new Enemy([hpos[randRange(3, 5)], vpos], size, hspeed[randRange(1, 4)], "line" ));
        }
      }
      else if (phase === 11) {
        const vpos = randRange(50, gameArea.height - 50);
        this.enemies.push(new Enemy([hpos[3], vpos], 30, hspeed[11], "wave", 0.05, 1));
      }
      else if (phase === 12) {
        this.enemies.push(new Enemy([hpos[2], 0], 30, hspeed[0], "double wave", 0.01, 1, 0.05, randRange(7, 15)));
        this.enemies.push(new Enemy([hpos[2], gameArea.height], 30, hspeed[0], "double wave", -0.01, 1, -0.05, randRange(7, 15)));
      }
      else if (phase === 13) {
        this.enemies.push(new Enemy([hpos[2], 0], 30, hspeed[1], "double wave", 0.01, 2, 0.05, 3));
        this.enemies.push(new Enemy([hpos[2], gameArea.height], 30, hspeed[1], "double wave", -0.01, 2, -0.05, 3));
        this.enemies.push(new Enemy([hpos[4], randRange(50, gameArea.height - 50)], 30, hspeed[4], "line"));
      }
      else if (phase === 14) {
        for (let i = 0 ; i < 12 ; i++ ) {
          this.enemies.push(
            new Enemy(
              [hpos[randRange(2, 5)], randRange(gameArea.height / 3, gameArea.height - gameArea.height / 3)],
              randRange(10, 20),
              hspeed[randRange(0, 3)],
              "line"
            )
          );
        }
      }
      else if (phase === 15) {
        for(let i = 0 ; i < 5 ; i++) {
          const vpos = randRange(50, gameArea.height - 50);
          if (vpos > verticalCenter) dir = -1;
          else dir = 1;
          this.enemies.push(
            new Enemy(
              [hpos[randRange(2, 4)], vpos],
              randRange(20, 30),
              hspeed[0],
              "wave",
              0.1 * dir,
              randRange(10, 15)
            )
          )
        }
        this.enemies.push(new Enemy([hpos[4], randRange(50, gameArea.height - 50)], 20, hspeed[4], "line"))
      }
      else if (phase === 16) {
        const timeOffset = randRange(30, 60);

        if (frameCount % (60 + timeOffset)  === 0 && this.pause === false) {
          const option = randRange(0, 3);
          if (option === 0) {
            this.enemies.push(
              new Enemy(
                [hpos[2], randRange(50, gameArea.height - 50)], 
                randRange(10, 50), 
                hspeed[randRange(4, 6)], 
                "line"
              )
            );
          }
          else if (option === 1) {
            const vpos = randRange(50, gameArea.height - 50);
            if (vpos > verticalCenter) dir = -1;
            else dir = 1;
            this.enemies.push(
              new Enemy(
                [hpos[2], vpos],
                randRange(10, 50),
                hspeed[randRange(1, 4)],
                "wave",
                randRange(1, 10) * 0.01 * dir,
                randRange(2, 5)
              )
            )
          }
          else if (option === 2) {
            const vpos = randRange(50, gameArea.height - 50);
            if (vpos > verticalCenter) dir = -1;
            else dir = 1;   
            this.enemies.push(
              new Enemy(
                [hpos[2], vpos],
                randRange(20, 30),
                hspeed[randRange(0, 4)],
                "double wave",
                randRange(5, 10) * 0.01 * dir,
                randRange(1, 5),
                randRange(5, 10) * 0.01 * dir,
                randRange(1, 5)
              )
            )         
          }
        }
      }
    }

    // This is very important! We need to indicate that the stage is now past it's start, so
    // we don't trigger stage behaviour every frame. 
    if(phase !== finalPhase) stageStart = false;   
  }
}
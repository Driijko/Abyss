// cd Desktop/Code/2020/'04 Abyss'

// GLOBAL VARIABLES

// Window size and minimum display
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
const minWidth = 800;
const minHeight = 600;

// Get rid of scroll bars
document.documentElement.style.overflow = "hidden";

// Mode and Objects
// let mode = "screen check";
let mode = "game test";
// let mode = "game test fullscreen";
let gameArea;
let titleScreen;
let survivalClock;
let player;
let bulletSet;
let enemy;

// VARIABLES
// Opening Prompt
let yesButtonFill;
let noButtonFill;

// Game
let survivalTime = 0;
let explosion = false;

// Assets //////////////////////////////////////////////////////////////////////////////////////////
// Images
const arrowImages = [];

// Sounds
let titleScreenMusic;
let playerShootsSound;
let enemyEntersSound;
let enemyHitSound0;
let enemyHitSound1;

function preload() {

  // Arrow Images
  arrowImages[0] = loadImage("./assets/images/arrowUp.png");
  arrowImages[1] = loadImage("./assets/images/arrowRight.png");
  arrowImages[2] = loadImage("./assets/images/arrowDown.png");
  arrowImages[3] = loadImage("./assets/images/arrowLeft.png");

  // Title Screen Music
  titleScreenMusic = loadSound("./assets/sounds/music/Title Screen Music.mp3");

  // Sound effects /////////////////////////////////////////////////////////////////////
  // Player
  playerShootsSound = loadSound("./assets/sounds/soundEffects/playerShoots0.wav");
  playerShootsSound.setVolume(0.2);

  // Enemy ////////////////////////////////////////////////////////////////////////////
  enemyEntersSound = loadSound("./assets/sounds/soundEffects/enemyEnters.wav");
  enemyHitSound0 = loadSound("./assets/sounds/soundEffects/enemyHit1.wav");
  enemyHitSound1 = loadSound("./assets/sounds/soundEffects/enemyHit5.wav");
}


// Setup ////////////////////////////////////////////////////////////////////////////////////////////
function setup() {

  if (mode === "game test") {
    createCanvas(windowWidth, windowHeight);
    gameArea = new GameArea(windowWidth, windowHeight);
    survivalClock = new SurvivalClock(gameArea.width, gameArea.height);
    bulletSet = new BulletSet(gameArea.width);
    player = new Player(gameArea.width, gameArea.height, bulletSet);
    // enemy = new Enemy([500, 400], 10, 1, "wave", 0.05, 3);
    enemySet = new EnemySet();
    mode = "game";
  }
  else if (mode === "game test fullscreen") {
    createCanvas(screen.width, screen.height);
  }
  else {
    createCanvas(windowWidth, windowHeight);
    background(0);
    fill(255);
    textFont("Dosis");
    textSize(20);
  
    // Screen is too small.
    if (screen.width < minWidth || screen.height < minHeight) {
      text(`Sorry, this game requires at least a ${minWidth} x ${minHeight} pixel display.`, 50, 50, windowWidth - 100, windowHeight);
      text(`Your current device's screen: ${screen.width} x ${screen.height} display.`, 50, 200, windowWidth - 100, windowHeight);
    }
    else {
      mode = "opening prompt";
    }
  }
}

function draw() {

  if (mode !== "screen check" && explosion === false) background(0);
 
  // OPENING PROMPT ////////////////////////////////////////////////////////////////////////////////////////
  if (mode === "opening prompt") {
    // Window is too small?
    if (windowWidth < minWidth || windowHeight < minHeight) {
      // Instructions
      textAlign(CENTER, TOP);
      textSize(20);
      fill(255);
      text(`Sorry, this game requires at least an ${minWidth} x ${minHeight} pixel display.`, 50, 50, windowWidth - 100, windowHeight);
      text(`Your current window: ${window.innerWidth} x ${window.innerHeight}.`, 50, 150, windowWidth - 100, windowHeight);
      text("Please resize your window to an appropriate display and REFRESH THE PAGE.", 50, 250, windowWidth - 50, windowHeight);
      text("Alternatively, enable fullscreen.", 50, 350, windowWidth - 50, windowHeight); 

      // Full Screen Button
      textSize(25); 
      textAlign(CENTER, CENTER);
      const fsbcoordinates0 = [center(windowWidth, 300), 450, 300, 50];
      stroke(255);
      strokeWeight(3);
      fill(0);
      rect(fsbcoordinates0[0], fsbcoordinates0[1], fsbcoordinates0[2], fsbcoordinates0[3]);  

      if (collidePointRect(mouseX, mouseY, fsbcoordinates0[0], fsbcoordinates0[1], fsbcoordinates0[2], fsbcoordinates0[3])) {
        fill(255);
        cursor("pointer");
        // Full screen enabled and transistion to game setup and then title screen.
        if (mouseIsPressed) {
          mode = "game setup";
          cursor("default");
          transistionToFullScreen();
        }
      }
      else {
        fill(100);
        cursor("default");
      }
      strokeWeight(0); 
      text("ENABLE FULLSCREEN", fsbcoordinates0[0], fsbcoordinates0[1], fsbcoordinates0[2], fsbcoordinates0[3]);
    }
    // Full screen prompt.
    else {
      textAlign(CENTER, CENTER);
      textSize(40);

      // Prompt.
      fill(255);
      text("ENABLE FULLSCREEN?", center(windowWidth, 300), center(windowHeight, 100) - 40, 300, 100 );
      
      // Yes and No Buttons.
      stroke(255);
      strokeWeight(2);
      fill(0);
      yesBoxCoords = [center(windowWidth, 100) - 60, center(windowHeight, 50) + 40, 100, 50];
      noBoxCoords = [center(windowWidth, 100) + 60, center(windowHeight, 50) + 40, 100, 50];
      rect(yesBoxCoords[0], yesBoxCoords[1], yesBoxCoords[2], yesBoxCoords[3]);
      rect(noBoxCoords[0],noBoxCoords[1],noBoxCoords[2],noBoxCoords[3] );

      // Click yes for full screen.
      if (collidePointRect(mouseX, mouseY, yesBoxCoords[0], yesBoxCoords[1], yesBoxCoords[2], yesBoxCoords[3])) {
        yesButtonFill = 255;
        noButtonFill = 0;
        cursor("pointer");
        // Full screen enabled and transistion to game setup and then title screen.
        if (mouseIsPressed) {
          mode = "game setup";
          cursor("default");
          transistionToFullScreen();
        }
      }
      // Click no for regular window view. 
      else if (collidePointRect(mouseX, mouseY,noBoxCoords[0],noBoxCoords[1],noBoxCoords[2],noBoxCoords[3])) {
        noButtonFill = 255;
        yesButtonFill = 0;
        cursor("pointer");
        // Transistion to game setup and then title screen.
        if (mouseIsPressed) {
          mode = "game setup";
          cursor("default");
        }
      }
      else {
        yesButtonFill = 0;
        noButtonFill = 0;
      }
      fill(yesButtonFill);
      text("YES", yesBoxCoords[0], yesBoxCoords[1], yesBoxCoords[2], yesBoxCoords[3]);
      fill(noButtonFill);
      text("NO", noBoxCoords[0],noBoxCoords[1],noBoxCoords[2],noBoxCoords[3] );
    }      
  }
  else if (mode === "game setup") {
    gameArea = new GameArea(windowWidth, windowHeight);
    titleScreen = new TitleScreen(gameArea.width, gameArea.height, arrowImages);
    survivalClock = new SurvivalClock(gameArea.width, gameArea.height);
    bulletSet = new BulletSet(gameArea.width);
    player = new Player(gameArea.width, gameArea.height, bulletSet);
    titleScreenMusic.play();
    mode = "title screen";
  }
  else if (mode === "title screen") {
    gameArea.display();
    translate(gameArea.corner[0], gameArea.corner[1]);
    titleScreen.display();
    if(keyCode === ENTER) {
      mode = "game";
    }

  }
  else if (mode === "game test fullscreen") {
    if (keyCode === ENTER) {
      gameArea = new GameArea(screen.width, screen.height);
      survivalClock = new SurvivalClock(gameArea.width, gameArea.height);
      bulletSet = new BulletSet(gameArea.width);
      player = new Player(gameArea.width, gameArea.height, bulletSet);
      mode = "game";
      transistionToFullScreen();
    }
  }
  else if (mode === "game") {
    // Set up the game area and move the coordinate grid to it's top left corner.
    if (explosion === false) gameArea.display();
    translate(gameArea.corner[0], gameArea.corner[1]);

    survivalClock.display();
    
    player.move();
    player.display();
    player.shoot();

    for (const bullet in bulletSet.bullets) {
      bulletSet.bullets[bullet].move();
      bulletSet.bullets[bullet].display();
    }
    bulletSet.destroyOutOfBoundsBullet();

    enemySet.generateEnemies();
    enemySet.checkIfEnemiesAreHitByBullets(bulletSet);

    for (const enemy in enemySet.enemies) {
      enemySet.enemies[enemy].move();
      enemySet.enemies[enemy].display();
    }



    // Pause Testing
    // if (keyIsDown(ENTER)) {
    //   player.pause = true;
    //   enemySet.pause = true;
    //   for (const enemy in enemySet.enemies) {
    //     enemySet.enemies[enemy].pause = true;
    //   }
    //   for (const bullet in bulletSet.bullets) {
    //     bulletSet.bullets[bullet].pause = true;
    //   }
    // }
  }
}

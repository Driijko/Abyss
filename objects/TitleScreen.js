function TitleScreen(gameAreaWidth, gameAreaHeight, arrowImages) {
  
  this.display = function() {

    textFont("Dosis");
    fill(255);
    strokeWeight(0);

    // Title
    textSize(gameAreaHeight / 6);
    textAlign(CENTER)
    text("Abyss", 0, gameAreaHeight / 4, gameAreaWidth);

    // Instructions
    const gameCenter = gameAreaWidth/2;
    const smallTextSize = gameAreaHeight / 30;
    textSize(smallTextSize);
    const letters = ["w", "d", "s", "a"];

    for (const index in letters) {
      push();
        translate(gameCenter, (gameAreaHeight / 2.3) + ((smallTextSize * 2) * index));
        text(`${letters[index]}`, -30, 0);
        image(arrowImages[index], 0, -(smallTextSize / 2));
      pop();
    }

    text("Press the space bar to attack", gameCenter - 200, gameAreaHeight - (gameAreaHeight / 3), 400, 200);

    text("Press    ENTER    to begin", gameCenter - 200, gameAreaHeight - (gameAreaHeight / 4), 400, 200);
  }
}
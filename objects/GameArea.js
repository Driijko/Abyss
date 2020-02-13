function GameArea(windowWidth, windowHeight) {

  // The game area ratio is 4:3. 
  if ((windowWidth / 4) >= (windowHeight / 3)) {
    this.height = windowHeight;
    this.width = (this.height / 3) * 4;
  }
  else {
    this.width = windowWidth;
    this.height = (this.width / 4) * 3;
  }

  this.corner = [center(windowWidth, this.width), center(windowHeight, this.height)];

  this.display = function() {
    stroke(255);
    strokeWeight(2);
    fill(0);
    rect(this.corner[0], this.corner[1], this.width, this.height);
  }
}
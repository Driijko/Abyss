function Bullet(x, y) {
  this.width = 20;
  this.height = this.width / 2;
  this.x = x;
  this.y = y;
  this.speed = 8;
  this.pause = false;

  const colorInterval = 10;
  const colors = [0, 255];

  this.move = function() {
    if ( ! (this.pause)) {
      this.x += this.speed;
    }
  }

  this.display = function() {
    if (!(this.pause)) {
      if (frameCount % colorInterval === 0) {
        if (colors[0] === 0) {
          colors[0] = 255;
          colors[1] = 0;
        }
        else if (colors[0] === 255) {
          colors[0] = 0;
          colors[1] = 255;
        }
      }
    }
    fill(colors[0]);
    strokeWeight(3);
    stroke(colors[1]);
    ellipseMode(CORNER);
    ellipse(this.x, this.y, this.width, this.height);
  }
}
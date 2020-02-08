function GameArea(windowWidth, windowHeight) {

  const smallerDimension = windowWidth >= windowHeight ? "height" : "width";
  if (smallerDimension === "height") {
    this.height = windowHeight;
    const heightIncrease = (windowHeight - minHeight) / minHeight;
    this.width = Math.round(minWidth + (minWidth * heightIncrease));
  }
  else {
    this.width = windowWidth;
    const widthIncrease = (windowWidth - minWidth) / minWidth;
    this.height = Math.round(minHeight + (minHeight * widthIncrease));
  }

  this.corner = [center(windowWidth, this.width), center(windowHeight, this.height)];

  this.display = function() {
    stroke(255);
    strokeWeight(2);
    fill(0);
    rect(this.corner[0], this.corner[1], this.width, this.height);
  }
}
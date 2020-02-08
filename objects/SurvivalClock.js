function SurvivalClock(windowWidth, windowHeight) {

  this.width = Math.floor(windowWidth / 10);
  this.height = Math.floor(windowHeight / 18);

   const timeOffset = millis();

  this.display = function() {
    stroke(255);
    strokeWeight(2);
    fill(0);
    rect(0, windowHeight - this.height, this.width, this.height);

    textAlign(CENTER, CENTER);
    textFont("Dosis");
    textSize(Math.floor(this.width/4));
    strokeWeight(0);
    fill(255);
    const seconds = Math.floor((millis() - timeOffset) / 1000);
    const minutes = Math.floor(seconds / 60);
    const leftOverSeconds = seconds % 60;
    const beforeTenMinutes = minutes < 10;
    const beforeTenSeconds = leftOverSeconds < 10;
    const timeString = `${beforeTenMinutes ? "0" : ""}${minutes} : ${beforeTenSeconds ? "0" : ""}${leftOverSeconds}`; 
    text(`${timeString}`, 0, windowHeight - this.height, this.width, this.height);
  }
}
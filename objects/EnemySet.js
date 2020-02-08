function EnemySet() {

  // Testing
  // let test = false;
  // if (test === false) {
  //   console.log(enemy.rect);
  //   test = true;
  // }


  // We keep track of each enemy created in this array.
  this.enemies = [];

  // Pausing stops all movement and animations.
  this.pause = false;

  // GENERATE ENEMIES ////////////////////////////////////////////////////////////////////////////////////////////
  // We generate enemies at a set interval. We keep track of how many times we've generated enemies using 
  // the 'enemyGenerateIntervalCounter' variable. Once this counter reaches a number in the 'difficultyLevels'
  // array, we increase the number of enemies, shrink their size, increase their speed, and give them more erratic
  // movements.
  const enemyGenerateInterval = 60 * 5;
  let enemyGenerateIntervalCounter = 0;
  const difficultyLevels = [1]

  this.generateEnemies = function() {
    if (frameCount % enemyGenerateInterval === 0 && this.pause === false) {
      if (enemyGenerateIntervalCounter < difficultyLevels[0]) {
        this.enemies.push(new Enemy([900, 400], 40, 1, "line"));
      }
      enemyGenerateIntervalCounter += 1;
    }
  }


  // ENEMIES HIT BY BULLETS //////////////////////////////////////////////////////////////////////////////////
  // We check to see if there are any actual enemies or bullets. 
  // If so we iterate through each enemy and check if it has not been hit. 
  // If it hasn't, we iterater through each bullet and check for a collision. 
  // Note the use of the property 'rect' from the enemy object, which keeps track of the 
  // enemy's position interpreted as a rectangle. 
  // If there is a collision, we change the enemy's 'hit' and 'pause' properties to 'true'. 
  // If an enemy has already been hit, we check to see if it's "disintegration" process has ended.
  // If it has, we remove it from the 'enemies' array. 
  this.checkIfEnemiesAreHitByBullets = function(bulletSet) {
    if (this.enemies.length > 0  && bulletSet.bullets.length > 0) {

      let enemy;
      let bullet;
      for (const enemyIndex in this.enemies) {
        enemy = this.enemies[enemyIndex];
        if (enemy.hit === false) {
          for (const bulletIndex in bulletSet.bullets) {
            bullet = bulletSet.bullets[bulletIndex];
            if (collideRectRect(enemy.rect.x, enemy.rect.y, enemy.rect.width, enemy.rect.height, bullet.x, bullet.y, bullet.width, bullet.height)) {
              enemy.hit = true;
              enemy.pause = true;
            }
          }
        }
        else if (enemy.disintegrationCounter === 255) {
          this.enemies.splice(enemyIndex, 1);
        }
      }
    }
  }
}

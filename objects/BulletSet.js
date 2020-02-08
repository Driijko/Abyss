function BulletSet(gameAreaWidth) {
  this.bullets = [];

  this.createBullet = function(x, y) {
    this.bullets.unshift(new Bullet(x, y));
  }

  this.destroyOutOfBoundsBullet = function() {
    if (this.bullets.length > 0) {
      if( this.bullets[this.bullets.length - 1].x > gameAreaWidth) {
        this.bullets.pop();
      }
    }
  }
}
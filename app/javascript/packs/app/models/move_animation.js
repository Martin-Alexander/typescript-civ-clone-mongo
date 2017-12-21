function MoveAnimation(animationData, callback) {
  this.animationData = animationData;
  this.fromSquare = animationData.path[animationData.index];
  this.toSquare = animationData.path[animationData.index + 1];
  this.counter = 0;
  this.color = animationData.color;
  this.callback = callback;
  this.animationController = animationData.animationController;

  if (this.fromSquare.x > this.toSquare.x && this.fromSquare.y == this.toSquare.y) {
    this.xDirection = -1; this.yDirection = -1;
  } else if (this.fromSquare.x < this.toSquare.x && this.fromSquare.y == this.toSquare.y) {
    this.xDirection = 1; this.yDirection = 1;
  } else if (this.fromSquare.y > this.toSquare.y && this.fromSquare.x == this.toSquare.x) {
    this.xDirection = 1; this.yDirection = -1;
  } else if (this.fromSquare.y < this.toSquare.y && this.fromSquare.x == this.toSquare.x) {
    this.xDirection = -1; this.yDirection = 1;
  } else if (this.fromSquare.y > this.toSquare.y && this.fromSquare.x > this.toSquare.x) {
    this.xDirection = 0; this.yDirection = -2;
  } else if (this.fromSquare.y > this.toSquare.y && this.fromSquare.x < this.toSquare.x) {
    this.xDirection = 2; this.yDirection = 0;
  } else if (this.fromSquare.y < this.toSquare.y && this.fromSquare.x > this.toSquare.x) {
    this.xDirection = -2; this.yDirection = 0;
  } else if (this.fromSquare.y < this.toSquare.y && this.fromSquare.x < this.toSquare.x) {
    this.xDirection = 0; this.yDirection = 2;
  }
}

MoveAnimation.prototype.draw = function(canvas, context, UI) {
  context.save();
  context.translate(
    (this.fromSquare.x - this.fromSquare.y) * (UI.tileWidth / 2) + (canvas.width / 2) + UI.offset.x, 
    ((this.fromSquare.y + this.fromSquare.x) * UI.tileHeight / 2) + UI.offset.y + ((canvas.height - 15 * UI.tileHeight) / 2)
  );
  context.translate(this.counter * this.xDirection, (this.counter * this.yDirection) / 2);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(UI.tileWidth / 2, UI.tileHeight / 2);
  context.lineTo(0, UI.tileHeight);
  context.lineTo(-UI.tileWidth / 2, UI.tileHeight / 2);
  context.closePath();
  context.fillStyle = this.color;
  context.fill();
  context.restore();
  this.counter += UI.tileHeight / 2;
  if (this.counter < UI.tileHeight) { 
    return true;
  } else {
    this.animationController.loadNextPieceMoveAnimation(this.animationData, this.callback);
    return false;
  }
};

export { MoveAnimation };
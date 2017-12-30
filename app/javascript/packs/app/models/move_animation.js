function MoveAnimation(animationData, callback) {
  this.animationData = animationData;
  this.callback = callback;
  this.fromSquare = animationData.path[animationData.index];
  this.toSquare = animationData.path[animationData.index + 1];
  this.counter = 0;
  this.unit = animationData.unit;
  this.animationController = animationData.animationController;
  this.done = false;

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
  this.unit.render(context, UI);
  context.restore();
  this.counter += UI.tileHeight / 3;
  if (this.counter >= UI.tileHeight) { 
    this.animationController.loadNextPieceMoveAnimation(this.animationData, this.callback);
    this.done = true;
  }
};

export { MoveAnimation };
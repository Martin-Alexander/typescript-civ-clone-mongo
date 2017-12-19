function MoveAnimation(fromSquare, toSquare, color, callback) {
  if (fromSquare.x > toSquare.x && fromSquare.y == toSquare.y) {
    this.xDirection = -1; this.yDirection = -1;
  } else if (fromSquare.x < toSquare.x && fromSquare.y == toSquare.y) {
    this.xDirection = 1; this.yDirection = 1;
  } else if (fromSquare.y > toSquare.y && fromSquare.x == toSquare.x) {
    this.xDirection = 1; this.yDirection = -1;
  } else if (fromSquare.y < toSquare.y && fromSquare.x == toSquare.x) {
    this.xDirection = -1; this.yDirection = 1;
  } else if (fromSquare.y > toSquare.y && fromSquare.x > toSquare.x) {
    this.xDirection = 0; this.yDirection = -2;
  } else if (fromSquare.y > toSquare.y && fromSquare.x < toSquare.x) {
    this.xDirection = 2; this.yDirection = 0;
  } else if (fromSquare.y < toSquare.y && fromSquare.x > toSquare.x) {
    this.xDirection = -2; this.yDirection = 0;
  } else if (fromSquare.y < toSquare.y && fromSquare.x < toSquare.x) {
    this.xDirection = 0; this.yDirection = 2;
  }
  this.fromSquare = fromSquare;
  this.toSquare = toSquare;
  this.counter = 0;
  this.color = color;
  this.callback = callback;
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
  this.counter += UI.tileHeight / 10;
  if (this.counter < UI.tileHeight) { 
    return true;
  } else {
    this.callback();
    return false;
  }
};

export { MoveAnimation };
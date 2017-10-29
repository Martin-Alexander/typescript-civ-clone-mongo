function Renderer(gameData) {
  this.gameData = gameData;
  this.tileHeight = 30;
  this.tileWidth = 60;
  this.playerLookup = {
    0: "grey",
    1: "red",
    2: "blue",
    3: "green"
  }
}

Renderer.prototype.createCanvas = function(parentElement) {
  this.canvas = document.createElement("canvas");
  this.context = this.canvas.getContext("2d")
  parentElement.insertAdjacentElement("beforebegin", this.canvas);
  this.setCanvasSize();
  window.addEventListener("resize", () => { this.setCanvasSize(); });
}

Renderer.prototype.setCanvasSize = function() {
  this.canvas.height = window.innerHeight;
  this.canvas.width = window.innerWidth;
}

Renderer.prototype.renderBoard = function() {
  this.clearCanvas();
  this.gameData.squares.forEach((square) => {
    this.drawSquare(square.x, square.y, this.playerLookup[square.player]);
  });
}

Renderer.prototype.drawSquare = function(x, y, color) {
  this.context.save();
  this.context.translate((x - y) * (this.tileWidth / 2) + (this.canvas.width / 2), (y + x) * this.tileHeight / 2);
  this.context.beginPath();
  this.context.moveTo(0, 0);
  this.context.lineTo(this.tileWidth / 2, this.tileHeight / 2);
  this.context.lineTo(0, this.tileHeight);
  this.context.lineTo(-this.tileWidth / 2, this.tileHeight / 2);
  this.context.closePath();
  this.context.fillStyle = color;
  this.context.fill();
  this.context.restore();     
}

Renderer.prototype.clearCanvas = function() {
  this.context.save();
  this.context.setTransform(1, 0, 0, 1, 0, 0);
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.context.restore();
}

export { Renderer }
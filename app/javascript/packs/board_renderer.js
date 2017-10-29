function Renderer(gameData) {
  this.gameData = gameData;
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

export { Renderer }
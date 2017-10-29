function Renderer(gameData) {
  this.gameData = gameData;
}

Renderer.prototype.createCanvas = function(parentElement) {
  this.canvas = document.createElement("canvas");
  parentElement.insertAdjacentElement("beforebegin", this.canvas);
  window.addEventListener("resize", (event) => {
    this.setCanvasSize();
  });
}

Renderer.prototype.setCanvasSize = function() {
  this.canvas.height = window.innerHeight;
  this.canvas.width = window.innerWidth;
}

export { Renderer }
function Renderer(gameData) {
  this.gameData = gameData;
}

Renderer.prototype.createCanvas = function(parentElement) {
  const canvas = document.createElement("canvas");
  parentElement.insertAdjacentElement("beforebegin", canvas);
}

export { Renderer }
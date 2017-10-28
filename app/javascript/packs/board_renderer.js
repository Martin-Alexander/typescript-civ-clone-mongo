const Renderer = (gameData) => {
  this.gameData = gameData;
}

Renderer.prototype.createCanvas = (parentElement) => {
  const canvas = document.createElement("canvas");
  parentElement.insertAdjacentElement("beforebegin", canvas);
}

export { Renderer }
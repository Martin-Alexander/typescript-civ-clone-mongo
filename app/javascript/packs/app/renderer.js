function Renderer(UI, gameData, parentElement) {
  this.UI = UI;
  this.gameData = gameData;
  this.parentElement = parentElement;
  this.canvas;
  this.context;
  this.animations = [];
}

Renderer.prototype.run = function() {
  [this.canvas, this.context] = initializeCanvasContext(this.parentElement);

  const canvas = this.canvas;
  const context = this.context;
  const UI = this.UI;
  const self = this;
  let counter = 0;

  window.setInterval(function() {
    drawAllSquares(self);
    drawAllAnimations(self);
  }, 10);
};

Renderer.prototype.addAnimation = function(animation) {
  this.animations.push(animation);
};

function drawAllAnimations(self) {
  self.animations.forEach((animation, index) => {
    if (!animation.draw(self.canvas, self.context, self.UI)) {
      self.animations.splice(index, 1);
    }
  });
}

function initializeCanvasContext(parentElement) {
  const canvas = document.createElement("canvas");
  parentElement.insertAdjacentElement("beforebegin", canvas);
  manageCanvasSize(canvas);
  return [canvas, canvas.getContext("2d")];
}

function manageCanvasSize(canvas) {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  });
}

function drawAllSquares(self) {
  clearCanvas(self);
  self.gameData.squares.forEach((square) => {
    drawSquare(self, square);
  });
}

function drawSquare(self, square) {
  const canvas = self.canvas;
  const context = self.context;
  const UI = self.UI;

  context.save();
  context.translate(
    (square.x - square.y) * (UI.tileWidth / 2) + (canvas.width / 2) + UI.offset.x, 
    ((square.y + square.x) * UI.tileHeight / 2) + UI.offset.y + ((canvas.height - 15 * UI.tileHeight) / 2)
  );
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(UI.tileWidth / 2, UI.tileHeight / 2);
  context.lineTo(0, UI.tileHeight);
  context.lineTo(-UI.tileWidth / 2, UI.tileHeight / 2);
  context.closePath();
  if (isInProccessOfMoveAnimation(square, self.animations)) {
    context.fillStyle = "black";
  } else {
    context.fillStyle = square.color();
  }
  context.fill();
  context.restore();     
}

function isInProccessOfMoveAnimation(square, animations) {
  let result = false;
  animations.forEach((animation) => {
    if (animation.toSquare.x == square.x && animation.toSquare.y == square.y) {
      result = true;
    }
  });
  return result;
}

function clearCanvas(self) {
  self.context.save();
  self.context.setTransform(1, 0, 0, 1, 0, 0);
  self.context.fillStyle = "rgba(255, 255, 255, 0.5)";
  self.context.fillRect(0, 0, self.canvas.width, self.canvas.height);
  self.context.restore();  
}

export { Renderer };
function Renderer(UI, gameData, parentElement) {
  this.UI = UI;
  this.gameData = gameData;
  this.parentElement = parentElement;
  this.canvas;
  this.context;
  this.animations = [];
}

Renderer.prototype.run = function() {
  [this.canvas, this.context] = this.initializeCanvasContext();

  const self = this;

  window.setInterval(function() {
    self.drawAllSquares();
    self.drawAllAnimations();
    self.drawPathLine();
  }, 30);
};

Renderer.prototype.addAnimation = function(animation) {
  this.animations.push(animation);
};

Renderer.prototype.drawAllAnimations = function() {
  this.animations.forEach(animation => animation.draw(this.canvas, this.context, this.UI));
  this.animations = this.animations.filter(animation => !animation.done);
}

Renderer.prototype.initializeCanvasContext = function() {
  const canvas = document.createElement("canvas");
  this.parentElement.insertAdjacentElement("beforebegin", canvas);
  this.manageCanvasSize(canvas);
  return [canvas, canvas.getContext("2d")];
}

Renderer.prototype.manageCanvasSize = function(canvas) {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  });
}

Renderer.prototype.drawAllSquares = function() {
  this.clearCanvas();
  this.gameData.squares.forEach((square) => {
    this.drawSquare(square);
  });
}

Renderer.prototype.drawSquare = function(square) {
  const canvas = this.canvas;
  const context = this.context;
  const UI = this.UI;

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
  context.fillStyle = square.color(UI.selection.square);
  context.fill();
  context.restore();     
}

Renderer.prototype.drawPathLine = function() {
  const canvas = this.canvas;
  const context = this.context;
  const UI = this.UI;

  if (UI.currentPath && UI.currentPath.length > 1) { 

    context.save();
    context.translate(
      (UI.currentPath[0].x - UI.currentPath[0].y) * (UI.tileWidth / 2) + (canvas.width / 2) + UI.offset.x, 
      ((UI.currentPath[0].y + UI.currentPath[0].x) * UI.tileHeight / 2) + UI.offset.y + ((canvas.height - 15 * UI.tileHeight) / 2)
    );
    context.translate(0, UI.tileHeight / 2);
    context.beginPath();
    context.moveTo(0, 0);
    const cumulativeTranslationOffset = { x: 0, y: 0 };

    for (let i = 0; i < UI.currentPath.length - 1; i++) {
      const tranlation = this.pathLineCoordinates(UI.currentPath[i], UI.currentPath[i + 1]);
      cumulativeTranslationOffset.x += UI.tileWidth * tranlation.x;
      cumulativeTranslationOffset.y += UI.tileHeight * tranlation.y;
      context.lineTo(cumulativeTranslationOffset.x, cumulativeTranslationOffset.y);
    }

    context.strokeStyle = "white";
    context.stroke();
    context.restore();
  }
}

Renderer.prototype.pathLineCoordinates = function(a, b) {
  const xTranslation = b.x - a.x;
  const yTranslation = b.y - a.y;

  const key = xTranslation.toString() + yTranslation.toString();

  const lookUp = {
    "-1-1": { x: 0,    y: -1   },
    "0-1":  { x: 0.5,  y: -0.5 },
    "1-1":  { x: 1,    y: 0    },
    "10":   { x: 0.5,  y: 0.5  },
    "11":   { x: 0,    y: 1    },
    "01":   { x: -0.5, y: 0.5  },
    "-11":  { x: -1,   y: 0    },
    "-10":  { x: -0.5, y: -0.5 }
  }

  return lookUp[key];
}

Renderer.prototype.clearCanvas = function() {
  this.context.save();
  this.context.setTransform(1, 0, 0, 1, 0, 0);
  this.context.fillStyle = "rgba(255, 255, 255, 1)";
  this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  this.context.restore();  
}

export { Renderer };
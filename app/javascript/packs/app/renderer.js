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
    drawPathLine(self);
  }, 60);
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
  context.fillStyle = square.color(self.UI.selection.square);
  context.fill();
  context.restore();     
}

function drawPathLine(self) {
  const canvas = self.canvas;
  const context = self.context;
  const UI = self.UI;

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
      const tranlation = pathLineCoordinates(UI.currentPath[i], UI.currentPath[i + 1]);
      cumulativeTranslationOffset.x += UI.tileWidth * tranlation.x;
      cumulativeTranslationOffset.y += UI.tileHeight * tranlation.y;
      context.lineTo(cumulativeTranslationOffset.x, cumulativeTranslationOffset.y);
    }
    
    context.strokeStyle = "white";
    context.stroke();
    context.restore();
  }
}

function pathLineCoordinates(a, b) {
  const xTranslation = b.x - a.x;
  const yTranslation = b.y - a.y;

  const key = xTranslation.toString() + yTranslation.toString();

  const lookUp = {
    "-1-1": { x: 0,    y: -1 },
    "0-1":  { x: 0.5,  y: -0.5    },
    "1-1":  { x: 1,    y: 0  },
    "10":   { x: 0.5,  y: 0.5    },
    "11":   { x: 0,    y: 1  },
    "01":   { x: -0.5, y: 0.5    },
    "-11":  { x: -1,   y: 0  },
    "-10":  { x: -0.5, y: -0.5    }
  }

  return lookUp[key];
}

function clearCanvas(self) {
  self.context.save();
  self.context.setTransform(1, 0, 0, 1, 0, 0);
  self.context.fillStyle = "rgba(255, 255, 255, 1)";
  self.context.fillRect(0, 0, self.canvas.width, self.canvas.height);
  self.context.restore();  
}

// function isInProccessOfMoveAnimation(square, animations) {
//   let result = false;
//   animations.forEach((animation) => {
//     if (animation.toSquare.x == square.x && animation.toSquare.y == square.y) {
//       result = true;
//     }
//   });
//   return result;
// }


export { Renderer };
function Renderer(UI, gameData, parentElement) {
  this.UI = UI;
  this.gameData = gameData;
  this.parentElement = parentElement;
  this.canvas;
  this.context;
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
    
    if (self.movement) {
      const fromSquare = self.movement[0];
      const toSquare = self.movement[1];
      
      let counterX, counterY;

      if (fromSquare.x > toSquare.x && fromSquare.y == toSquare.y) {
        counterX = -1; counterY = -1;
      } else if (fromSquare.x < toSquare.x && fromSquare.y == toSquare.y) {
        counterX = 1; counterY = 1;
      } else if (fromSquare.y > toSquare.y && fromSquare.x == toSquare.x) {
        counterX = 1; counterY = -1;
      } else if (fromSquare.y < toSquare.y && fromSquare.x == toSquare.x) {
        counterX = -1; counterY = 1;
      } else if (fromSquare.y > toSquare.y && fromSquare.x > toSquare.x) {
        counterX = 0; counterY = -2;
      } else if (fromSquare.y > toSquare.y && fromSquare.x < toSquare.x) {
        counterX = 2; counterY = 0;
      } else if (fromSquare.y < toSquare.y && fromSquare.x > toSquare.x) {
        counterX = -2; counterY = 0;
      } else if (fromSquare.y < toSquare.y && fromSquare.x < toSquare.x) {
        counterX = 0; counterY = 2;
      }

      context.save();
      context.translate(
        (fromSquare.x - fromSquare.y) * (UI.tileWidth / 2) + (canvas.width / 2) + UI.offset.x, 
        ((fromSquare.y + fromSquare.x) * UI.tileHeight / 2) + UI.offset.y + ((canvas.height - 15 * UI.tileHeight) / 2)
      );
      context.translate(counter * counterX, (counter * counterY) / 2);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(UI.tileWidth / 2, UI.tileHeight / 2);
      context.lineTo(0, UI.tileHeight);
      context.lineTo(-UI.tileWidth / 2, UI.tileHeight / 2);
      context.closePath();
      context.fillStyle = toSquare.color();
      context.fill();
      context.restore();
      counter += UI.tileHeight / 20;
      
      if (counter > UI.tileHeight) { 
        self.movement = null;
        counter = 0;
      }
    }
  }, 10);
};

Renderer.prototype.movieToosyRoosyPoosy = function(fromSquare, toSquare) {
  this.movement = [fromSquare, toSquare];
};

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
  context.fillStyle = square.color();
  context.fill();
  context.restore();     
}

function clearCanvas(self) {
  self.context.save();
  self.context.setTransform(1, 0, 0, 1, 0, 0);
  self.context.fillStyle = "rgba(255, 255, 255, 0.5)";
  self.context.fillRect(0, 0, self.canvas.width, self.canvas.height);
  self.context.restore();  
}

export { Renderer };
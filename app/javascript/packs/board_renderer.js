import { UI } from "./ui_state";

var gameData, canvas, context;

function renderBoard(_gameData, parentElement) {
  gameData = _gameData;
  [canvas, context] = initializeCanvasContext(parentElement);
  window.setInterval(function() {
    drawAllSquares();
  }, 10);
}

function initializeCanvasContext(parentElement) {
  canvas = document.createElement("canvas");
  parentElement.insertAdjacentElement("beforebegin", canvas);
  manageCanvasSize();
  return [canvas, canvas.getContext("2d")];
}

function manageCanvasSize() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  });
}

function drawAllSquares() {
  clearCanvas();
  gameData.squares.forEach((square) => {
    drawSquare(square);
  });
}

function drawSquare(square) {
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

function clearCanvas() {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = "rgba(255, 255, 255, 0.5)";
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.restore();  
}

export { renderBoard };
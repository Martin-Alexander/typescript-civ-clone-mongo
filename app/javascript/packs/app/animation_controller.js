import { Square } from "./models/square";
import { MoveAnimation } from "./models/move_animation";

function AnimationController(renderer) {
  this.renderer = renderer;
}

AnimationController.prototype.pieceMove = function(data, callback) {
  const fromSquare = new Square(JSON.parse(data.new_squares[0]));
  const toSquare = new Square(JSON.parse(data.new_squares[1]));
  const fromSquareCoords = { x: fromSquare.x, y: fromSquare.y };
  const toSquareCoords = { x: toSquare.x, y: toSquare.y };
  const color = toSquare.color();
  this.renderer.addAnimation(new MoveAnimation(fromSquareCoords, toSquareCoords, color, callback));
}

export { AnimationController };

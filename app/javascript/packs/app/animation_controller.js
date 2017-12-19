import { Square } from "./models/square";
import { MoveAnimation } from "./models/move_animation";

function AnimationController(renderer) {
  this.renderer = renderer;
}

AnimationController.prototype.pieceMove = function(data) {
  const fromSquare = new Square(JSON.parse(data.new_squares[0]));
  const toSquare = new Square(JSON.parse(data.new_squares[1]));
  this.renderer.addAnimation(new MoveAnimation(fromSquare, toSquare));
}

export { AnimationController };

import { Square } from "./models/square";
import { MoveAnimation } from "./models/move_animation";

function AnimationController(renderer) {
  this.renderer = renderer;
}

AnimationController.prototype.pieceMove = function(data, callback) {
  if (data.path.length < 2) { return false; }

  const fromSquare = new Square(data.new_squares[0]);
  const toSquare = new Square(data.new_squares[1]);

  const animationData = {
    color: toSquare.color(),
    path: data.path,
    index: 0,
    animationController: this
  }

  this.renderer.addAnimation(new MoveAnimation(animationData, callback));
}

AnimationController.prototype.loadNextPieceMoveAnimation = function(animationData, callback) {
  if (animationData.index < animationData.path.length - 2) {
    animationData.index += 1;
    this.renderer.addAnimation(new MoveAnimation(animationData, callback));
  } else {
    callback();
  }
}

export { AnimationController };

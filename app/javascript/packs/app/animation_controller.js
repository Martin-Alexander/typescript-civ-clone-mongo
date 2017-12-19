function AnimationController(renderer) {
  this.renderer = renderer;
}

AnimationController.prototype.pieceMove = function(data) {
  console.log("run piece move animation");
}

export { AnimationController };

  // const fromSquare = new Square(JSON.parse(data.result[0]));
  // const toSquare = new Square(JSON.parse(data.result[1]));
  // renderer.addAnimation(new MoveAnimation(fromSquare, toSquare));
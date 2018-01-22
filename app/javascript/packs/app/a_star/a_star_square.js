import { AStarBoard } from "./a_star_board";

function AStarSquare(square) {
  this.x = square.x;
  this.y = square.y;
  this.moveCost = this.calculateMoveCost(square);
  this.pathVia = null;
  this.currentPathCost = infinity();
}

AStarSquare.prototype.estimatedTotalCost = function(destinationSquare) {
  return this.currentPathCost + AStarBoard.manhattanDistance(this, destinationSquare);
}

AStarSquare.prototype.equalTo = function(otherSquare) {
  return this.x === otherSquare.x && this.y === otherSquare.y;
}

AStarSquare.prototype.calculateMoveCost = function(square) {
  if (square.units.length > 0 || square.terrain == "mountains" || square.terrain == "water") {
    return infinity();
  } else {
    return 1;
  }
}

function infinity() {
  return 9007199254740992;
}

export { AStarSquare };
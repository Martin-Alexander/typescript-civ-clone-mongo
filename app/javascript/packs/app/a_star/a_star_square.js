function AStarSquare(gameSquare, gameData) {
  this.gameData = gameData;
  this.gameSquare = gameSquare;
  this.x = gameSquare.x;
  this.y = gameSquare.y;
  this.pathVia = null;
  this.currentPathCost = infinity();
}

AStarSquare.prototype.estimatedTotalCost = function(destinationSquare) {
  return this.currentPathCost + this.distanceToSquare(destinationSquare);
}

AStarSquare.prototype.equalTo = function(otherSquare) {
  return this.x === otherSquare.x && this.y === otherSquare.y;
}

AStarSquare.prototype.moveCost = function(fromSquare) {  
  if (this.gameSquare.units.length > 0 ||
      this.gameSquare.terrain == "mountains" ||
      this.gameSquare.terrain == "water"
    ) {
    return infinity();
  } else {
    return Rules.rulesJSON.terrain[this.gameSquare.terrain].move_cost;
  }
}

AStarSquare.prototype.distanceToSquare = function(square) {
  return Math.abs(this.x - square.x) + Math.abs(this.y - square.y);
}

const infinity = () => 9007199254740992;

export { AStarSquare };

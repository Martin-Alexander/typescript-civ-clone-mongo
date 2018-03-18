function AStarSquare(gameSquare) {
  this.gameSquare      = this.findGameSquare(gameSquare);
  // this.gameSquare      = gameSquare;
  this.x               = gameSquare.x;
  this.y               = gameSquare.y;
  this.pathVia         = null;
  this.moveToCost      = null;
  this.currentPathCost = AStarSquare.infinity();
}

AStarSquare.prototype.estimatedTotalCost = function(destinationSquare) {
  // For the huristic to be acurate we must be as optimistic as possible about move costs
  // and so here we are assuming that the path to our destination is entirely roads
  return this.currentPathCost + (this.distanceToSquare(destinationSquare) * Rules.rulesJSON.move_cost_of_roads);
}

AStarSquare.prototype.estimatedTotalHopCost = function(destinationSquare) {
  return this.currentPathCost + (this.distanceToSquare(destinationSquare) / 4);
}

AStarSquare.prototype.findGameSquare = function(inputSquare) {
  let square = inputSquare;

  while (square.constructor.name === "AStarSquare") {
    square = square.gameSquare;
  }

  return square;
}


AStarSquare.prototype.equalTo = function(otherSquare) {
  return this.x === otherSquare.x && this.y === otherSquare.y;
}

AStarSquare.prototype.moveCost = function(unit, fromSquare) {
  if (fromSquare.equalTo(this)) {
    return unit.moves;
  } else if (this.gameSquare.units.length > 0 ||
      this.gameSquare.terrain == "mountains" ||
      this.gameSquare.terrain == "water"
    ) {
    return AStarSquare.infinity();
  } else if (this.gameSquare.hasCompletedStructure("road") && this.findGameSquare(fromSquare).hasCompletedStructure("road")) {
    return Rules.rulesJSON.move_cost_of_roads;
  } else {
    return Rules.rulesJSON.terrain[this.gameSquare.terrain].move_cost;
  }
}

AStarSquare.prototype.distanceToSquare = function(square) {
  return Math.abs(this.x - square.x) + Math.abs(this.y - square.y);
}

AStarSquare.prototype.isUnreachable = function() {
  return(
    this.gameSquare.terrain === "mountains" ||
    this.gameSquare.terrain === "water" ||
    this.gameSquare.units.length !== 0
  );
}

AStarSquare.infinity = () => 9007199254740992;

export { AStarSquare };

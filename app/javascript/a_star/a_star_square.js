function AStarSquare(gameSquare) {
  this.gameSquare      = this.findGameSquare(gameSquare);
  this.x               = gameSquare.x;
  this.y               = gameSquare.y;
  this.pathVia         = null;
  this.moveToCost      = null;
  this.currentPathCost = AStarSquare.infinity();
}

// The method that AStarCollection uses to make the AStar sort
AStarSquare.prototype.estimatedTotalCost = function(destinationSquare) {
  // For the huristic to be acurate we must be as optimistic as possible about move costs
  // and so here we are assuming that the path to our destination is entirely roads
  return this.currentPathCost + (this.distanceToSquare(destinationSquare) * Rules.rulesJSON.move_cost_of_roads);
}

// AStarSquare.prototype.estimatedTotalHopCost = function(destinationSquare) {
//   return this.currentPathCost + (this.distanceToSquare(destinationSquare) / 4);
// }

// Recursive function that finds the ultimate gameSquare that a AStarSquare is suposed to point to
// I'm a bad programmer, I know...
AStarSquare.prototype.findGameSquare = function(square) {
  if (square.constructor.name === "AStarSquare") {
    return this.findGameSquare(square.gameSquare);
  } else {
    return square;
  }
}

// Returns whether or not a given square has the same coordinates
// Workds with any object that has an `x` and `y` property
AStarSquare.prototype.equalTo = function(otherSquare) {
  return this.x === otherSquare.x && this.y === otherSquare.y;
}

// Computes and returns the move cost of a given unit moving from a given to square to this square
AStarSquare.prototype.moveCost = function(unit, fromSquare) {
  // "Moving" to same square you're on costs all your movement points
  if (fromSquare.equalTo(this)) {
    return unit.moves;

  // You cannot move to an unreachable square
  } else if (this.isUnreachable()) {
    return AStarSquare.infinity();

  // Is connected to the from square by a road
  } else if (this.isConnectedToByARoad(fromSquare)) {
    return Rules.rulesJSON.move_cost_of_roads;

  } else {
    return Rules.rulesJSON.terrain[this.gameSquare.terrain].move_cost;
  }
}

// Calculates the Euclidian distance between two squares
AStarSquare.prototype.distanceToSquare = function(square) {
  return Math.abs(this.x - square.x) + Math.abs(this.y - square.y);
}

// Returns whether or not the given square is unreachable
// Returns false negatives
AStarSquare.prototype.isUnreachable = function() {
  return(
    this.gameSquare.terrain === "mountains" ||
    this.gameSquare.terrain === "water" ||
    this.gameSquare.units.length !== 0
  );
}

// Returns whether or no two square are connected by a road
AStarSquare.prototype.isConnectedToByARoad = function(otherSquare) {
  return this.gameSquare.hasCompletedStructure("road") && this.findGameSquare(otherSquare).hasCompletedStructure("road")
}

AStarSquare.infinity = () => 9007199254740992;

export { AStarSquare };

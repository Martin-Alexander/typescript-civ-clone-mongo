function AStarSquareCollection(seedArray) {
  const array = seedArray ? seedArray : [];
  array.__proto__ = AStarSquareCollection.prototype;

  array.size = Math.sqrt(array.length) - 1;

  return array;
}

AStarSquareCollection.prototype = new Array;

AStarSquareCollection.prototype.includes = function(AStarSquareObject) {
  for(let i = 0; i < this.length; i++) {
    if (AStarSquareObject.equalTo(this[i])) return true;
  }

  return false;
}

AStarSquareCollection.prototype.huristicSort = function(endSquare) {
  this.sort((a, b) => {
    const difference = a.estimatedTotalCost(endSquare) - b.estimatedTotalCost(endSquare);
    if (difference > 0) {
      return 1;
    } else if (difference < 0) {
      return -1;
    } else {
      return 0;
    }
  });
}

AStarSquareCollection.prototype.hopHuristicSort = function(endSquare) {
  this.sort((a, b) => {
    const difference = a.estimatedTotalHopCost(endSquare) - b.estimatedTotalHopCost(endSquare);
    if (difference > 0) {
      return 1;
    } else if (difference < 0) {
      return -1;
    } else {
      return 0;
    }
  });
}


AStarSquareCollection.prototype.pureHuristicSort = function(endSquare) {
  this.sort((a, b) => {
    const difference = a.distanceToSquare(endSquare) - b.distanceToSquare(endSquare);
    if (difference > 0) {
      return 1;
    } else if (difference < 0) {
      return -1;
    } else {
      return 0;
    }
  });
}

AStarSquareCollection.prototype.findSquare = function(x, y) {
  return this[y * (this.size + 1) + x];
}

AStarSquareCollection.prototype.addSquare = function(square) {
  this.push(square);
}

AStarSquareCollection.prototype.getNewCurrentSquare = function() {
  const newCurrentSquare = this[0];
  this.splice(0, 1);

  return newCurrentSquare;
}

AStarSquareCollection.prototype.stillHasSquaresLeft = function() {
  return this.length > 0;
}

AStarSquareCollection.prototype.doesNotInclude = function(square) {
  return !this.includes(square);
}

export { AStarSquareCollection };

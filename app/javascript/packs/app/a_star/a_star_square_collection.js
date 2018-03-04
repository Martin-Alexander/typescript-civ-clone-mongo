function AStarSquareCollection() {
  const array = [];
  array.push.apply(array, arguments);
  array.__proto__ = AStarSquareCollection.prototype;
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
    const difference = a.estimatedTotalCost(endSquare) - b.estimatedTotalCost(endSquare)
    if (difference > 0) {
      return 1;
    } else if (difference < 0) {
      return -1;
    } else {
      return 0;
    }
  });
}

export { AStarSquareCollection };

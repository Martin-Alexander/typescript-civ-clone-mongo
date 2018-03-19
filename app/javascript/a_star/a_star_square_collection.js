// Represents a collection of AStarSquares
function AStarSquareCollection(seedArray) {
  const array = seedArray ? seedArray : [];
  array.__proto__ = AStarSquareCollection.prototype;
  
  array.size = Math.sqrt(array.length) - 1;
  
  return array;
}

// For Delegating all array methods to the array of AStarSquares contained within it
AStarSquareCollection.prototype = new Array;

// Similar to Ruby's Array#include? method
AStarSquareCollection.prototype.includes = function(AStarSquareObject) {
  for(let i = 0; i < this.length; i++) {
    if (AStarSquareObject.equalTo(this[i])) return true;
  }

  return false;
}

// Sorts AStarSquares based on the AStar huristic of euclidian distance and current path cost
AStarSquareCollection.prototype.huristicSort = function(endSquare) {
  this._baseSort(endSquare, (a, b) => {
    return a.estimatedTotalCost(endSquare) - b.estimatedTotalCost(endSquare);
  });
}

// // Sorts AStarSquares based soley on thier current path cost
// AStarSquareCollection.prototype.moveCostSort = function() {
//   this._baseSort(endSquare, (a, b) => {
//     return a.currentPathCost - b.currentPathCost;
//   });
// }


// AStarSquareCollection.prototype.hopHuristicSort = function(endSquare) {
//   this._baseSort(endSquare, (a, b) => {
//     return a.estimatedTotalHopCost(endSquare) - b.estimatedTotalHopCost(endSquare);
//   });
// }

// AStarSquareCollection.prototype.pureHuristicSort = function(endSquare) {
//   this._baseSort(endSquare, (a, b) => {
//     return a.distanceToSquare(endSquare) - b.distanceToSquare(endSquare);
//   });  
// }

// Sorts AStarSquares by a given difference function
AStarSquareCollection.prototype._baseSort = function(endSquare, differenceFunction) {
  this.sort((a, b) => {
    const difference = differenceFunction(a, b);
    if (difference > 0) {
      return 1;
    } else if (difference < 0) {
      return -1;
    } else {
      return 0;
    }
  });
}

// AStarSquareCollection.prototype.turnMoveHuristicSort = function(endSquare) {
//   this.sort((a, b) => {
//     const difference = a.estimatedTotalCost(endSquare) - b.estimatedTotalCost(endSquare);
//     if (difference > 0) {
//       return 1;
//     } else if (difference < 0) {
//       return -1;
//     } else if (difference == 0) {
//       const moveCostDifference = a.moveToCost - b.moveToCost;
//       if (moveCostDifference > 0) {
//         return 1;
//       } else if (moveCostDifference < 0) {
//         return -1;
//       } else {
//         return 0;
//       }
//       return 0;
//     }
//   });
// }

// Performs a lookup based on AStarSquare coordinates
// Should only be used when a AStarSquareCollection is representing an entire board
AStarSquareCollection.prototype.findSquare = function(x, y) {
  return this[y * (this.size + 1) + x];
}

// Adds a square to the collection
AStarSquareCollection.prototype.addSquare = function(square) {
  this.push(square);
}

// Returns the first square in the collection and removes it
AStarSquareCollection.prototype.getNewCurrentSquare = function() {
  const newCurrentSquare = this[0];
  this.splice(0, 1);

  return newCurrentSquare;
}

// Returns whether or not the collection is emply
AStarSquareCollection.prototype.stillHasSquaresLeft = function() {
  return this.length > 0;
}

// The inverserve of AStarSquareCollection.prototype.includes
AStarSquareCollection.prototype.doesNotInclude = function(square) {
  return !this.includes(square);
}

export { AStarSquareCollection };

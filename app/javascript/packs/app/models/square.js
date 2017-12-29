function Square(rawSquareObject) {
  Object.keys(rawSquareObject).forEach((property) => {
    if (property == "infantry") {
      this.units = rawSquareObject[property];
    } else if (property == "_id") {
      this.id = rawSquareObject[property]["$oid"];
    } else {
      this[property] = rawSquareObject[property];
    }
  });
}

Square.prototype.color = function(selectionSquare) {
  if (this == selectionSquare) {
    return "white";
  } else if (this.units.length > 0) {
    return playerColorLookup[this.units[this.units.length - 1].player_number];
  }
  return "black";
};

Square.prototype.equalTo = function(otherSquare) {
  return this.x === otherSquare.x && this.y === otherSquare.y;
}

Square.prototype.getCoordinates = function() {
  return { x: this.x, y: this.y };
}

const playerColorLookup = {
  1: "blue",
  2: "red",
  3: "yellow",
  4: "green"
};

export { Square };
function Unit(rawUnitData) {
  Object.keys(rawUnitData).forEach((property) => {
    if (property == "_id") {
      this.id = rawUnitData[property]["$oid"];
    } else {
      this[property] = rawUnitData[property];
    }
  });
}

Unit.prototype.playerColor = function() {
  const unitPlayerColorLookup = {
    1: "red",
    2: "blue",
    3: "pink",
    4: "purple",
    5: "orange"
  };

  return unitPlayerColorLookup[this.player_number];
}

Unit.prototype.typeColor = function() {
  const unitTypeColorLookup = {
    worker: "#47220c",
    infantry: "#020366",
    tank: "#053d05",
    ship: "#5b5b5b"
  };

  return unitTypeColorLookup[this.type];
}

Unit.prototype.render = function(context, UI) {
  context.beginPath();
  context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 4, UI.tileHeight / 4, 0, Math.PI * 1.25, Math.PI * 0.25);
  context.fillStyle = this.playerColor();
  context.fill();
  context.beginPath();
  context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 4, UI.tileHeight / 4, 0, Math.PI * 0.25, Math.PI * 1.25);
  context.fillStyle = this.typeColor();
  context.fill();
}

export { Unit };
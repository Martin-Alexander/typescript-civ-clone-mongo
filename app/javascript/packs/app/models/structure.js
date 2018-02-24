function Structure(rawStructureObject) {
  Object.keys(rawStructureObject).forEach((property) => {
  if (property == "_id") {
      this.id = rawStructureObject[property]["$oid"];
    } else {
      this[property] = rawStructureObject[property];
    }
  });
}

Structure.prototype.typeColor = function() {
  const structureTypeColorLookup = {
    road: "#bf743f",
    fortress: "#3a3a3a",
    farm: "#627221",
    city: "#80a09f"
  }

  return structureTypeColorLookup[this.type];
}

Structure.prototype.playerColor = function() {
  const structurePlayerColorLookup = {
    1: "red",
    2: "blue",
    3: "pink",
    4: "purple",
    5: "orange"
  };

  return structurePlayerColorLookup[this.player_number];
}

// This is all going away when artwork is done, so I'm not going to bother making it look nice
Structure.prototype.render = function(context, UI) {
  if (this.type === "city") {
    context.beginPath();
    context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, Math.PI * 1.25, Math.PI * 0.25);
    context.fillStyle = this.typeColor();
    context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, Math.PI * 0.25, Math.PI * 1.25);
    context.fillStyle = this.typeColor();
    context.fill();
  } else {
    context.beginPath();
    context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, Math.PI * 1.25, Math.PI * 0.25);
    context.fillStyle = this.typeColor();
    context.fill();
    context.beginPath();
    context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, Math.PI * 0.25, Math.PI * 1.25);
    context.fillStyle = this.playerColor();
    context.fill();
  }
}

// This is all going away when artwork is done, so I'm not going to bother making it look nice
Structure.prototype.renderLabel = function(square, canvas, context, UI) {
  if (this.type === "city") {
    context.save();
    context.translate(
      (square.x - square.y) * (UI.tileWidth / 2) + (canvas.width / 2) + UI.offset.x, 
      ((square.y + square.x) * UI.tileHeight / 2) + UI.offset.y + ((canvas.height - 15 * UI.tileHeight) / 2)
    );
    context.font = `${(UI.tileHeight / 2)}px sans-serif`;
    context.fillStyle = this.playerColor();
    context.allignText = "center";
    context.fillText(`${this.size}`, -(UI.tileHeight / 9), UI.tileHeight);
    context.restore();
  }
}

export { Structure };
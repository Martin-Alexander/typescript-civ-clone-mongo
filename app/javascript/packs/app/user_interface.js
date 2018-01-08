function UserInterface() {
  this.tileHeight = 40;
  this.tileWidth = 80;
  this.offset = { x: 0, y: 0 };
  this.tileMousePosition = {};
  this.selection = {
    square: null,
    unit: null,
    structure: null
  };
  this.currentPath = null;
  this.size = null;
  this.ongoingTurnTransition = false;
  this.ready = false;
}

UserInterface.prototype.clearAllSelection = function() {
  this.selection = {
    square: null,
    unit: null,
    structure: null
  };
}

export { UserInterface };
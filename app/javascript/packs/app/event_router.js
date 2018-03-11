function EventRouter(UI, inputController, canvas) {
  this.UI = UI;
  this.inputController = inputController;
  this.canvas = canvas;
  this.mouse = {
    right: { down: false },
    left: { down: false },
    positionOnLastDown: null,
    rawPosition: null,
    rawIsoPosition: null,
    centerRelativePosition: null,
    preDragDistance: 0
  };

  this.initializeEventListeners();
};

EventRouter.prototype.preventBrowserMenu = function() {
  document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
    return false; 
  });
}

EventRouter.prototype.disableTextSelection = function() {
  function disableselect(event) { return false };
  document.onselectstart = disableselect;
  document.onmousedown = disableselect;
}

EventRouter.prototype.initializeMouseDownEvent = function() {
  const self = this;

  window.addEventListener("mousedown", function(event) {
    if (self.outOfBounds() || !self.directMapClick(event)) { return false; }
  
    switch (event.button) {
      case 0: // left
        self.mouse.left.down = true;
        self.mouse.positionOnLastDown = {
          x: self.mouse.rawPosition.x,
          y: self.mouse.rawPosition.y
        };
        break;
      case 2: // right
        self.inputController.pathFindBegin();
        self.mouse.right.down = true;
        break;
    }
  });
}

EventRouter.prototype.initializeMouseUpEvent = function() {
  const self = this;

  window.addEventListener("mouseup", function(event) {
    if (self.outOfBounds()) { return false; }

    switch (event.button) {
      case 0: // left
        if (self.mouse.preDragDistance < 10 && self.directMapClick(event)) {
          self.inputController.selectSquare();
        }
        self.mouse.preDragDistance = 0;
        self.mouse.left.down = false; 
        break;
      case 1: // wheel click
        self.inputController.infoClick();
        break
      case 2: // right
        self.inputController.moveUnit();
        self.mouse.right.down = false;
        break;
    }
  });
}

EventRouter.prototype.initializeMouseMoveEvent = function() {
  const self = this;

  window.addEventListener("mousemove", function(event) {
    if (self.mouse.left.down) {
      const dragDistance = {
        x: (self.mouse.rawPosition.x - event.clientX),
        y: (self.mouse.rawPosition.y - event.clientY)
      };

      if (self.mouse.preDragDistance > 2) {
        self.UI.offset.x -= dragDistance.x;
        self.UI.offset.y -= dragDistance.y;
      } else {
        self.mouse.preDragDistance += Math.abs(dragDistance.x + dragDistance.y);
      }
    }
  
    const oldtileMousePosition = self.UI.tileMousePosition;
    self.setMousePosition(event);
        
    if (self.outOfBounds() || !self.directMapClick(event)) { return false; }
  
    if (self.mouse.right.down && !haveSameCoords(oldtileMousePosition, self.UI.tileMousePosition)) {
      self.inputController.pathUpdate();
    }
  });
}

EventRouter.prototype.initializeWheelScrollEvent = function() {
  const self = this;

  window.addEventListener("wheel", function(event) {
    // if (this.outOfBounds() || !this.directMapClick(event)) { return false; }
    if (!self.directMapClick(event)) { return false; }
    
    const zoomSpeed = 1.1;
    if (event.deltaY < 0 && self.UI.tileHeight < 100) {
      self.UI.tileHeight *= zoomSpeed;
      self.UI.tileWidth *= zoomSpeed;
      self.UI.offset.x = (self.UI.offset.x * zoomSpeed) - 
        (self.mouse.centerRelativePosition.x / 10);
      self.UI.offset.y = (self.UI.offset.y * zoomSpeed) - 
        (self.mouse.centerRelativePosition.y / 10);
    } else if (event.deltaY > 0 && self.UI.tileHeight > 15) {
      self.UI.tileHeight /= zoomSpeed;
      self.UI.tileWidth /= zoomSpeed;
      self.UI.offset.x = (self.UI.offset.x / zoomSpeed) + 
        (self.mouse.centerRelativePosition.x / 11);
      self.UI.offset.y = (self.UI.offset.y / zoomSpeed) + 
        (self.mouse.centerRelativePosition.y / 11);
    }
  });
}

EventRouter.prototype.initializeKeyUpEvent = function() {
  const self = this;

  window.addEventListener("keyup", function(event) {
    switch (event.keyCode) {
      case 13: // Enter
        self.inputController.nextTurn();
        break;
      case 70: // f
        self.inputController.giveOrder("fortify");
        break;
    }
  });
}

EventRouter.prototype.initializeEventListeners = function() {
  // this.preventBrowserMenu();
  this.disableTextSelection();
  this.initializeMouseDownEvent();
  this.initializeMouseUpEvent();
  this.initializeMouseMoveEvent();
  this.initializeWheelScrollEvent();
  this.initializeKeyUpEvent();
}

EventRouter.prototype.setMousePosition = function(event) {
  this.mouse.rawPosition = { 
    x: event.clientX, 
    y: event.clientY 
  };

  this.mouse.centerRelativePosition = {
    x: (this.mouse.rawPosition.x - (window.innerWidth / 2)),
    y: (this.mouse.rawPosition.y - (window.innerHeight / 2))
  };

  const offsetCoords = {
    x: this.mouse.rawPosition.x - this.UI.offset.x,
    y: this.mouse.rawPosition.y - this.UI.offset.y - (
      (window.innerHeight - 15 * this.UI.tileHeight) / 2
    )
  };

  this.mouse.rawIsoPosition = { 
    x: ((offsetCoords.x - window.innerWidth / 2) + 2 * offsetCoords.y) / 2,
    y: (2 * offsetCoords.y - (offsetCoords.x - window.innerWidth / 2)) / 2 
  };

  if (!this.outOfBounds()) {
    this.inputController.setTileMousePosition({
      x: Math.floor(this.mouse.rawIsoPosition.x / this.UI.tileHeight),
      y: Math.floor(this.mouse.rawIsoPosition.y / this.UI.tileHeight)
    });
  }
}

EventRouter.prototype.outOfBounds = function() {
  return this.mouse.rawIsoPosition.x / this.UI.tileHeight < 0 ||
  this.mouse.rawIsoPosition.y / this.UI.tileHeight < 0 ||
  this.mouse.rawIsoPosition.x / this.UI.tileHeight > this.UI.size + 1||
  this.mouse.rawIsoPosition.y / this.UI.tileHeight > this.UI.size + 1;
}

EventRouter.prototype.directMapClick = function(event) {
  return event.target.id === "react-user-interface";
}

function haveSameCoords(a, b) {
  return a.x === b.x && a.y === b.y;
}

export { EventRouter };
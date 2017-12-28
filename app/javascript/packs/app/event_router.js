function EventRouter(UI, inputController) {
  this.UI = UI;
  this.inputController = inputController;
  this.mouse = {
    right: { down: false },
    left: { down: false },
    positionOnLastDown: null,
    rawPosition: null,
    rawIsoPosition: null,
    centerRelativePosition: null,
    preDragDistance: 0
  };

  this.initializeEventListener();
};

EventRouter.prototype.initializeEventListener = function() {
  const self = this;
  const mouse = self.mouse;
  const UI = self.UI;
  const inputController = self.inputController;

  document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
    return false; 
  });

  // Disabling all text selection
  function disableselect(e) {return false};
  document.onselectstart = disableselect;
  document.onmousedown = disableselect;

  window.addEventListener("mousedown", function(event) {
    if (self.outOfBounds()) { return false; }

    switch (event.button) {
      case 0: // left
        mouse.left.down = true;
        mouse.positionOnLastDown = {
          x: mouse.rawPosition.x,
          y: mouse.rawPosition.y
        };
        break;
      case 2: // right
        inputController.pathFindBegin();
        mouse.right.down = true;
        break;
    }
  });

  window.addEventListener("mouseup", function(event) {
    if (self.outOfBounds()) { return false; }

    switch (event.button) {
      case 0: // left
        if (mouse.preDragDistance < 10) {
          inputController.selectSquare();
        }
        mouse.preDragDistance = 0;
        mouse.left.down = false; 
        break;
      case 2: // right
        inputController.moveUnit();
        mouse.right.down = false;
        break;
    }
  });

  window.addEventListener("mousemove", function(event) {
    if (mouse.left.down) {
      const dragDistance = {
        x: (mouse.rawPosition.x - event.clientX),
        y: (mouse.rawPosition.y - event.clientY)
      };
      if (mouse.preDragDistance > 5) {
        UI.offset.x -= dragDistance.x;
        UI.offset.y -= dragDistance.y;
      } else {
        mouse.preDragDistance += Math.abs(dragDistance.x + dragDistance.y);
      }
    }

    const oldtileMousePosition = UI.tileMousePosition;
    self.setMousePosition(event);
        
    if (self.outOfBounds()) { return false; }

    if (mouse.right.down && !haveSameCoords(oldtileMousePosition, UI.tileMousePosition)) {
      inputController.pathUpdate();
    }
  });

  window.addEventListener("wheel", function(event) {
    if (self.outOfBounds()) { return false; }

    const zoomSpeed = 1.1;
    if (event.deltaY < 0) {
      UI.tileHeight *= zoomSpeed;
      UI.tileWidth *= zoomSpeed;
      UI.offset.x = (UI.offset.x * zoomSpeed) - (mouse.centerRelativePosition.x / 10);
      UI.offset.y = (UI.offset.y * zoomSpeed) - (mouse.centerRelativePosition.y / 10);
    } else {
      UI.tileHeight /= zoomSpeed;
      UI.tileWidth /= zoomSpeed;
      UI.offset.x = (UI.offset.x / zoomSpeed) + (mouse.centerRelativePosition.x / 11);
      UI.offset.y = (UI.offset.y / zoomSpeed) + (mouse.centerRelativePosition.y / 11);
    }
  });

  window.addEventListener("keyup", function(event) {
    switch (event.keyCode) {
      case 13: // Enter
        inputController.nextTurn();
    }
  });
}

EventRouter.prototype.setMousePosition = function(event) {
  const mouse = this.mouse;
  const UI = this.UI;

  mouse.rawPosition = { 
    x: event.clientX, 
    y: event.clientY 
  };

  mouse.centerRelativePosition = {
    x: (mouse.rawPosition.x - (window.innerWidth / 2)),
    y: (mouse.rawPosition.y - (window.innerHeight / 2))
  };

  const offsetCoords = {
    x: mouse.rawPosition.x - UI.offset.x,
    y: mouse.rawPosition.y - UI.offset.y - ((window.innerHeight - 15 * UI.tileHeight) / 2)
  };

  mouse.rawIsoPosition = { 
    x: ((offsetCoords.x - window.innerWidth / 2) + 2 * offsetCoords.y) / 2 ,
    y: (2 * offsetCoords.y - (offsetCoords.x - window.innerWidth / 2)) / 2 
  };

  UI.tileMousePosition = {
    x: Math.floor(mouse.rawIsoPosition.x / UI.tileHeight),
    y: Math.floor(mouse.rawIsoPosition.y / UI.tileHeight)
  };
}

EventRouter.prototype.outOfBounds = function() {
  return this.mouse.rawIsoPosition.x / this.UI.tileHeight < 0 ||
  this.mouse.rawIsoPosition.y / this.UI.tileHeight < 0 ||
  this.mouse.rawIsoPosition.x / this.UI.tileHeight > this.UI.size + 1||
  this.mouse.rawIsoPosition.y / this.UI.tileHeight > this.UI.size + 1;
}

function haveSameCoords(a, b) {
  return a.x === b.x && a.y === b.y;
}

export { EventRouter };
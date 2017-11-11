function EventRouter(UI, inputController) {
  this.UI = UI;
  this.inputController = inputController;
  this.mouse = {
    down: false,
    positionOnLastDown: null,
    rawPosition: null,
    rawIsoPosition: null,
    centerRelativePosition: null,
    preDragDistance: 0
  };

  const self = this;
  initializeEventListener(self);
}

function initializeEventListener(self) {
  const mouse = self.mouse;
  const UI = self.UI;
  const inputController = self.inputController;

  window.addEventListener("mousedown", function() { 
    mouse.down = true; 
    mouse.positionOnLastDown = {
      x: mouse.rawPosition.x,
      y: mouse.rawPosition.y
    };
  });

  window.addEventListener("mouseup", function() { 
    if (mouse.preDragDistance < 10) {
      inputController.click();
    }
    mouse.preDragDistance = 0;
    mouse.down = false; 
  });

  window.addEventListener("mousemove", function(event) {
    if (mouse.down) {
      const dragDistance = {
        x: (mouse.rawPosition.x - event.clientX),
        y: (mouse.rawPosition.y - event.clientY)
      };
      if (mouse.preDragDistance > 10) {
        UI.offset.x -= dragDistance.x;
        UI.offset.y -= dragDistance.y;
      } else {
        mouse.preDragDistance += Math.abs(dragDistance.x + dragDistance.y);
      }
    }
    setMousePosition(self);
  });

  window.addEventListener("wheel", function(event) {
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
}

function setMousePosition(self) {
  const mouse = self.mouse;
  const UI = self.UI;

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

function haveSameCoords(a, b) {
  return a.x === b.x && a.y === b.y;
}

export { EventRouter };
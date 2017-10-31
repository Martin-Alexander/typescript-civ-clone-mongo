import { UI } from "./ui_state";
import { inputController } from "./input_controller";

const mouse = {
  down: false,
  positionOnLastDown: null,
  rawPosition: null,
  rawIsoPosition: null,
  centerRelativePosition: null
};

window.addEventListener("mousedown", function() { 
  mouse.down = true; 
  mouse.positionOnLastDown = {
    x: mouse.rawPosition.x,
    y: mouse.rawPosition.y
  };
});

window.addEventListener("mouseup", function() { 
  mouse.down = false; 
  if (haveSameCoords(mouse.rawPosition, mouse.positionOnLastDown)) {
    inputController.click();
  }
});

window.addEventListener("mousemove", function(event) {
  if (mouse.down) {
    UI.offset.x -= (mouse.rawPosition.x - event.clientX);
    UI.offset.y -= (mouse.rawPosition.y - event.clientY);
  }
  setMousePosition(event);
});

window.addEventListener("wheel", function(event) {
  const zoomSpeed = 1.05
  if (event.deltaY < 0) {
    UI.tileHeight *= zoomSpeed;
    UI.tileWidth *= zoomSpeed;
    UI.offset.x = (UI.offset.x * zoomSpeed) - (mouse.centerRelativePosition.x / 20);
    UI.offset.y = (UI.offset.y * zoomSpeed) - (mouse.centerRelativePosition.y / 20);
  } else {
    UI.tileHeight /= zoomSpeed;
    UI.tileWidth /= zoomSpeed;
    UI.offset.x = (UI.offset.x / zoomSpeed) + (mouse.centerRelativePosition.x / 21);
    UI.offset.y = (UI.offset.y / zoomSpeed) + (mouse.centerRelativePosition.y / 21);
  }
});

function setMousePosition(event) {
  mouse.rawPosition = { 
    x: event.clientX, 
    y: event.clientY 
  };

  mouse.centerRelativePosition = {
    x: (mouse.rawPosition.x - (window.innerWidth / 2)),
    y: (mouse.rawPosition.y - (window.innerHeight / 2))

  }

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

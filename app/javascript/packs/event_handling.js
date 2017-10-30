import { UI } from "./ui_state";
import { inputController } from "./input_controller";

const mouse = {
  down: false,
  positionOnLastDown: null,
  rawPosition: null,
  rawIsoPosition: null
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

function setMousePosition(event) {
  mouse.rawPosition = { 
    x: event.clientX, 
    y: event.clientY 
  };

  const offsetCoords = {
    x: mouse.rawPosition.x - UI.offset.x,
    y: mouse.rawPosition.y - UI.offset.y
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
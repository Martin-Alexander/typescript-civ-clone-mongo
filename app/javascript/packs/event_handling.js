import { UI } from "./ui_state";

// Internal state: Is the left mouse button down or up
var mousedown = false;
window.addEventListener("mousedown", function() { mousedown = true; });
window.addEventListener("mouseup", function() { mousedown = false; });

// Internal state: raw mouse coordinates
var rawMousePosition, rawIsoMousePosition;

window.addEventListener("mousemove", function(event) {
  if (mousedown) {
    UI.offset.x -= (rawMousePosition.x - event.clientX);
    UI.offset.y -= (rawMousePosition.y - event.clientY);
  }
  setMousePosition(event);
});

function setMousePosition(event) {
  rawMousePosition = { 
    x: event.clientX, 
    y: event.clientY 
  };

  const offsetCoords = {
    x: rawMousePosition.x - UI.offset.x,
    y: rawMousePosition.y - UI.offset.y
  };

  rawIsoMousePosition = { 
    x: ((offsetCoords.x - window.innerWidth / 2) + 2 * offsetCoords.y) / 2 ,
    y: (2 * offsetCoords.y - (offsetCoords.x - window.innerWidth / 2)) / 2
  };
  
  UI.tileMousePosition = {
    x: Math.floor(rawIsoMousePosition.x / UI.tileHeight),
    y: Math.floor(rawIsoMousePosition.y / UI.tileHeight)
  };
}

// Currently for debugging purposes
window.addEventListener("click", function() {
  console.log(UI.tileMousePosition);
});
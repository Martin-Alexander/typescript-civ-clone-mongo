import { UI } from "./ui_state"

window.addEventListener("mousemove", function(event) {
  if (mousedown) {
    UI.offset.x -= (UI.mousePosition.x - event.clientX) / UI.scale;
    UI.offset.y -= (UI.mousePosition.y - event.clientY) / UI.scale;
  }
  convertToTileISO({ x: event.clientX, y: event.clientY }, UI.offset, UI.mouseTile);
  UI.mousePosition = { x: event.clientX, y: event.clientY };
});

window.mousedown = false;

window.addEventListener("click", function(event) {
  console.log(UI.mouseTile);
});


window.addEventListener("mousedown", function(event) {
  mousedown = true;
});

window.addEventListener("mouseup", function(event) {
  mousedown = false;
});

function convertToTileISO(rawMouseCoords, buffer) {
  const offsetCoords = {
    x: rawMouseCoords.x - UI.offset.x,
    y: rawMouseCoords.y - UI.offset.y
  }

  const isoCoords = { 
    x: ((offsetCoords.x - window.innerWidth / 2) + 2 * offsetCoords.y) / 2 ,
    y: (2 * offsetCoords.y - (offsetCoords.x - window.innerWidth / 2)) / 2
  };
  
  const tileBoundCoords = {
    x: Math.floor(isoCoords.x / UI.tileHeight),
    y: Math.floor(isoCoords.y / UI.tileHeight)
  }

  UI.mouseTile = tileBoundCoords;
}
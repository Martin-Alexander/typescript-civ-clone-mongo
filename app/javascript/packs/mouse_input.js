// Fix window.mouseTile. Maybe from buffer argument on like 8. I dunno...

window.addEventListener("mousemove", function(event) {
  if (mousedown) {
    offset.x -= (mousePosition.x - event.clientX) / scale;
    offset.y -= (mousePosition.y - event.clientY) / scale;
  }
  convertToTileISO({ x: event.clientX, y: event.clientY }, offset, window.mouseTile);
  mousePosition = { x: event.clientX, y: event.clientY };
});

window.mousePosition = {};
window.mousedown = false;

window.addEventListener("click", function(event) {
  console.log(mouseTile);
});


window.addEventListener("mousedown", function(event) {
  mousedown = true;
});

window.addEventListener("mouseup", function(event) {
  mousedown = false;
});

// window.addEventListener("wheel", function(event) {
//   if (event.deltaY > 0) {
//     scale = scale / 1.1;
//   } else {
//     scale = scale * 1.1;
//   }
// });

function convertToTileISO(rawMouseCoords, offset, buffer) {
  const offsetCoords = {
    x: rawMouseCoords.x - offset.x,
    y: rawMouseCoords.y - offset.y
  }

  const isoCoords = { 
    x: ((offsetCoords.x - window.innerWidth / 2) + 2 * offsetCoords.y) / 2 ,
    y: (2 * offsetCoords.y - (offsetCoords.x - window.innerWidth / 2)) / 2
  };
  
  const tileBoundCoords = {
    x: Math.floor(isoCoords.x / tileHeight),
    y: Math.floor(isoCoords.y / tileHeight)
  }

  window.mouseTile = tileBoundCoords;
}
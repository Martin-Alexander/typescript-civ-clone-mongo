// Fix window.mouseTile. Maybe from buffer argument on like 8. I dunno...

window.addEventListener("mousemove", function(event) {
  convertToTileISO({ x: event.clientX, y: event.clientY }, { xOffset: 0, yOffSet: 0 }, window.mouseTile);
  console.log(window.mouseTile);
});

function convertToTileISO(rawMouseCoords, offset, buffer) {
  // Convert to ISO
  // Apply offset
  // Bind to tile
  // Store tile in buffer
  window.mouseTile = rawMouseCoords;
}
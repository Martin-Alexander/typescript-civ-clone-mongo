import { GameData } from "./game_data"
import { Renderer } from "./board_renderer"
import { mouseInput } from "./mouse_input"

window.tileHeight = 40;
window.tileWidth = 80;
window.offset = { x: 0, y: 0 }
window.scale = 1;
window.mouseTile = {};

window.gameData = new GameData(rawGameData);

window.renderer = new Renderer(gameData);
renderer.createCanvas(document.getElementById("canvas-container"));


window.setInterval(function() {
  renderer.renderBoard();
}, 60);

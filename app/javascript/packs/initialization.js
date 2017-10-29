import { GameData } from "./game_data"
import { Renderer } from "./board_renderer"
import { mouseInput } from "./mouse_input"

window.gameData = new GameData(rawGameData);

window.renderer = new Renderer(gameData);
renderer.createCanvas(document.getElementById("canvas-container"));

window.mouseTile = {};

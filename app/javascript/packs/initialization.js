import { GameData } from "./game_data"
import { Renderer } from "./board_renderer"

window.gameData = new GameData(rawGameData);

window.renderer = new Renderer(gameData);
renderer.createCanvas(document.getElementById("canvas-container"));

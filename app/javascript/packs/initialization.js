import { GameData } from "./game_data"
import { Renderer } from "./board_renderer"

const gameData = new GameData(rawGameData);

const renderer = new Renderer(gameData);
renderer.createCanvas(document.getElementById("canvas-container"));
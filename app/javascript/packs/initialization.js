import { GameData } from "./game_data"
import { renderBoard } from "./board_renderer"
import { mouseInput } from "./mouse_input"

const gameData = new GameData(rawGameData);

renderBoard(gameData, document.getElementById("canvas-container"));
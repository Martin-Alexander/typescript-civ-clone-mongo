import { gameData } from "./game_data";
import { renderBoard } from "./board_renderer";
import "./event_handling";

renderBoard(gameData, document.getElementById("canvas-container"));
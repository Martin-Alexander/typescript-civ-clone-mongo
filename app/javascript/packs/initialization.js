import "./game_data";
import "./event_handling";
import { renderBoard } from "./board_renderer";

renderBoard(gameData, document.getElementById("canvas-container"));
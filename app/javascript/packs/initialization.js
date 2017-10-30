import { GameData } from "./game_data";
import { renderBoard } from "./board_renderer";
import "./event_handling";

/* global rawGameData */

const gameData = new GameData(rawGameData);

renderBoard(gameData, document.getElementById("canvas-container"));
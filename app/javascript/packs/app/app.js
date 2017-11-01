import { EventRouter } from "./event_router";
import { UserInterface } from "./user_interface";
import { InputController } from "./input_controller";
import { Renderer } from "./renderer";
import { GameData } from "./game_data";
import { NetworkController } from "./network_controller";

/* global rawGameData */

const parentElement = document.getElementById("canvas-container");

const UI = new UserInterface();
const gameData = new GameData(rawGameData);
const inputController = new InputController(UI, gameData);
const eventRouter = new EventRouter(UI, inputController);
const renderer = new Renderer(UI, gameData, parentElement);
const networkController = new NetworkController(gameData);

gameData.initialize();
renderer.run();
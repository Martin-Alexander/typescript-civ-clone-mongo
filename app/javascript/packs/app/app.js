import { EventRouter }         from "./event_router";
import { UserInterface }       from "./user_interface";
import { InputController }     from "./input_controller";
import { Renderer }            from "./renderer";
import { GameData }            from "./game_data";
import { NetworkController }   from "./network_controller";
import { GameDataController }  from "./game_data_controller";
import { AnimationController } from "./animation_controller";

/* global rawGameData */

const parentElement = document.getElementById("canvas-container");

const UI                  = new UserInterface();
const gameData            = new GameData(UI, rawGameData);
const renderer            = new Renderer(UI, gameData, parentElement);
const gameDataController  = new GameDataController(gameData);
const animationController = new AnimationController(renderer);
const networkController   = new NetworkController(gameDataController, animationController);
const inputController     = new InputController(UI, gameData, networkController);
const eventRouter         = new EventRouter(UI, inputController);

gameData.initialize();
renderer.run();
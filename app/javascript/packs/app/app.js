import React                   from "react";
import ReactDOM                from "react-dom";

import { EventRouter }         from "./event_router";
import { UserInterface }       from "./user_interface";
import { InputController }     from "./input_controller";
import { Renderer }            from "./renderer";
import { GameData }            from "./game_data";
import { NetworkController }   from "./network_controller";
import { GameDataController }  from "./game_data_controller";
import { AnimationController } from "./animation_controller";
import { ReactController }     from "./react_controller";

import ReactUserInterface      from "./react_ui/components/ReactUserInterface";

/* global rawGameData */

const parentElement = document.getElementById("canvas-container");

const UI                     = new UserInterface();
global.gameData               = new GameData(UI, rawGameData);
const renderer               = new Renderer(UI, gameData, parentElement);
const reactController        = new ReactController(UI, gameData);
const gameDataController     = new GameDataController(gameData, UI, reactController);
const animationController    = new AnimationController(renderer);
const networkController      = new NetworkController(gameDataController, animationController);
const inputController        = new InputController(UI, gameData, networkController, reactController);
const eventRouter            = new EventRouter(UI, inputController, reactController);

gameData.initialize();
renderer.run();

const canvasContainer = document.getElementById("canvas-container");
ReactDOM.render(<ReactUserInterface currentPlayer={gameData.getCurrentPlayer()} UI={UI} inputController={inputController} />, canvasContainer);
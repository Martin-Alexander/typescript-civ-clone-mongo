import React                    from "react";
import ReactDOM                 from "react-dom";

import { EventRouter }          from "./../controllers/event_router";
import { UserInterface }        from "./../controllers/user_interface";
import { UnitOrdersController } from "./../controllers/unit_orders_controller";
import { InputController }      from "./../controllers/input_controller";
import { Renderer }             from "./../controllers/renderer";
import { GameData }             from "./../controllers/game_data";
import { NetworkController }    from "./../controllers/network_controller";
import { GameDataController }   from "./../controllers/game_data_controller";
import { AnimationController }  from "./../controllers/animation_controller";
import { TurnTransitioner }     from "./../controllers/turn_transitioner";
import { ReactController }      from "./../controllers/react_controller";
import { Rules }                from "./../controllers/rules";
import ReactUserInterface       from "./../react/ReactUserInterface";

/* global rawGameData */

const parentElement = document.getElementById("canvas-container");

const UI                     = new UserInterface();
global.gameData              = new GameData(UI, rawGameData);
const renderer               = new Renderer(UI, gameData, parentElement);
const reactController        = new ReactController(UI, gameData);
const gameDataController     = new GameDataController(gameData, UI, reactController);
const animationController    = new AnimationController(renderer);
const turnTransitioner       = new TurnTransitioner(UI, reactController);
const networkController      = new NetworkController(turnTransitioner, gameDataController, animationController);
const unitOrdersController   = new UnitOrdersController(UI, gameData, networkController)
const inputController        = new InputController(UI, gameData, networkController, reactController, unitOrdersController);
const eventRouter            = new EventRouter(UI, inputController);
global.Rules                 = Rules;

gameData.initialize();
renderer.run();

const canvasContainer = document.getElementById("canvas-container");
ReactDOM.render(
  <ReactUserInterface 
    currentPlayer={gameData.getCurrentPlayer()}
    gameData={gameData}
    UI={UI}
    inputController={inputController}
    networkController={networkController}
  />, canvasContainer
);
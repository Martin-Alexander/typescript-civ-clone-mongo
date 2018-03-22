import { UnitsController }     from "./controllers/units_controller";
import { InputController }     from "./controllers/input_controller";
import { NetworkController }   from "./controllers/network_controller";
import { GameDataController }  from "./controllers/game_data_controller";
import { AnimationController } from "./controllers/animation_controller";
import { TurnTransitioner }    from "./controllers/turn_transitioner";
import { ReactController }     from "./controllers/react_controller";
import { Renderer }            from "./views/renderer";
import { ReactUI }            from "./views/react/react_ui";
import { EventRouter }         from "./event_router";
import { UserInterface }       from "./user_interface";
import { GameData }            from "./game_data";
import { Rules }               from "./rules";

const App = {
  initialize() {
    const parentElement = document.getElementById("canvas-container");

    const UI                     = new UserInterface();
    const gameData               = new GameData(UI, rawGameData);
    const renderer               = new Renderer(UI, gameData, parentElement);
    const reactController        = new ReactController(UI, gameData);
    const gameDataController     = new GameDataController(gameData, UI, reactController);
    const animationController    = new AnimationController(renderer);
    const turnTransitioner       = new TurnTransitioner(UI, reactController);
    const networkController      = new NetworkController(turnTransitioner, gameDataController, animationController);
    const unitsController        = new UnitsController(UI, gameData, networkController)
    const inputController        = new InputController(UI, gameData, networkController, reactController, unitsController);
    const eventRouter            = new EventRouter(UI, inputController);

    global.gameData = gameData;
    global.Rules = Rules;

    gameData.initialize();
    renderer.initialize();
    ReactUI.initialize(UI, gameData, inputController, networkController);
  }
}

export { App };
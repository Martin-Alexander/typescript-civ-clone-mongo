import React            from "react";
import MenuBar          from "./MenuBar";
import SelectionDetails from "./SelectionDetails";
import TurnTimer        from "./TurnTimer";
import Minimap          from "./Minimap";
import MainMenu         from "./MainMenu";

export default class ReactUserInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      UI: this.props.UI,
      gameData: this.props.gameData,
      currentPlayer: this.props.currentPlayer,
      menuOpen: false
    };
  }

  componentWillMount() {
    global.updateUI = (UI) => {
      this.setState({ UI: UI });
    }

    global.updateGameData = (gameData) => {
      this.setState({ gameData: gameData });
    }
  }  

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  render() {
    const userInterfaceStyle = {
      position: "absolute",
      top: "0", 
      bottom: "0",
      width: "100%"
    }

    return(
      <div id="react-user-interface" style={userInterfaceStyle}>
        <MenuBar toggleMenu={this.toggleMenu.bind(this)} currentPlayer={this.props.currentPlayer}/>
        <SelectionDetails currentPlayer={this.props.currentPlayer} UI={this.props.UI} inputController={this.props.inputController}/>
        <TurnTimer gamePlayers={this.state.gameData.game_players} ongoingTurnTransition={this.state.UI.ongoingTurnTransition}/>
        <Minimap />
        <MainMenu networkController={this.props.networkController} menuOpen={this.state.menuOpen}/>
      </div>
    );
  }
}
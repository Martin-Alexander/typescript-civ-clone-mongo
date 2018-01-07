import React from "react";
import MenuBar from "./MenuBar";
import SelectionDetails from "./SelectionDetails";
import TurnTimer from "./TurnTimer";
import Minimap from "./Minimap";

export default class ReactUserInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      UI: this.props.UI,
      currentPlayer: this.props.currentPlayer
    };
  }

  componentWillMount() {
    global.updateUI = (UI) => {
      this.setState({UI: UI});
    }
  }  

  render() {
    const userInterfaceStyle = {
      position: "absolute",
      top: "0", 
      bottom: "0",
      width: "100%"
    }

    return(
      <div style={userInterfaceStyle}>
        <MenuBar currentPlayer={this.props.currentPlayer}/>
        <SelectionDetails currentPlayer={this.props.currentPlayer} UI={this.props.UI} inputController={this.props.inputController}/>
        <TurnTimer ongoingTurnTransition={this.state.UI.ongoingTurnTransition}/>
        <Minimap />
      </div>
    );
  }
}
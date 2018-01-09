import React from "react";

export default class MainMenu extends React.Component {
  handleExitGameClick() {
    this.props.networkController.leaveGame();
  }

  render() {
    const mainMenuStyle = {
      position: "absolute",
      top: "10%",
      left: "calc(50% - 275px)",
      width: "550px",
      height: "600px",
      backgroundColor: "#e4e5d7"
    }

    if (this.props.menuOpen) {
      mainMenuStyle.display = "inherit";
    } else {
      mainMenuStyle.display = "none";
    }

    return(
      <div style={mainMenuStyle}>
        <button onClick={this.handleExitGameClick.bind(this)}>Exit Current Game</button>
      </div>
    );
  }
}
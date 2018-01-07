import React from "react";

export default class TurnTimer extends React.Component {
  render() {
    const turnTimerStyle = {
      position: "absolute",
      bottom: "50px",
      left: "calc(50% - 200px)",
      width: "400px",
      height: "50px",
      backgroundColor: "#e4e5d7"
    }

    const text = () => {
      if (this.props.ongoingTurnTransition) {
        return "Next Turn. Please Wait..."
      } else {
        return "Ready"
      }
    }
    
    return(
      <div style={turnTimerStyle}>{text()}</div>
    );
  }
}
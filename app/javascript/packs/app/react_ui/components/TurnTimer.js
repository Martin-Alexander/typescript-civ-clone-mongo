import React from "react";

export default class TurnTimer extends React.Component {
  render() {
    const turnTimerStyle = {
      position: "absolute",
      bottom: "50px",
      left: "calc(50% - 200px)",
      width: "400px",
      height: "50px",
      backgroundColor: "blue"
    }
    
    return(
      <div style={turnTimerStyle}></div>
    );
  }
}
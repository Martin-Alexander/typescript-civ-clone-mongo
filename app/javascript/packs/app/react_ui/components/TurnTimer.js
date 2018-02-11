import React from "react";

export default class TurnTimer extends React.Component {
  render() {
    const turnTimerStyle = {
      position: "absolute",
      bottom: "50px",
      left: "calc(50% - 150px)",
      width: "400px",
      height: "100px",
      backgroundColor: "#e4e5d7"
    }

    const text = () => {
      if (this.props.ongoingTurnTransition) {
        return(<div>"Next Turn. Please Wait..."</div>)
      }
    }
    
    const playersReady = () => {
      return this.props.players.map((player) => {
        if (player.turn_over) {
          return(<div key={player.number}>Player {player.number} is <strong>ready</strong> </div>)
        } else {
          return(<div key={player.number}>Player {player.number} is <strong>not ready</strong> </div>)
        }
      });
    }

    return(
      <div style={turnTimerStyle}>
        {text()}
        <div>{playersReady()}</div>
      </div>
    );
  }
}
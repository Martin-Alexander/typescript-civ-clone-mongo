import React from "react";

export default class SelectionDetails extends React.Component {
  render() {
    const selectionDetailsStyle = {
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "400px",
      height: "200px",
      backgroundColor: "green"
    }
    
    return(
      <div style={selectionDetailsStyle}></div>
    );
  }
}
import React from "react";

export default class SelectionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { UI: global.UI };
  }

  componentWillMount() {
    global.updateSelectionDetails = (UI) => {
      this.setState(UI);
    }
  }

  render() {
    const selectionSquare = {
      x: null,
      y: null,
      numberOfUnits: null
    }

    if (this.state.UI.selection.square) {
      selectionSquare.x = this.state.UI.selection.square.x;
      selectionSquare.y = this.state.UI.selection.square.y;
      selectionSquare.numberOfUnits = this.state.UI.selection.square.units.length;
    }

    const selectionDetailsStyle = {
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "400px",
      height: "200px",
      backgroundColor: "green"
    }
    
    return(
      <div style={selectionDetailsStyle}>
        <div><strong>Tile over:</strong> {this.state.UI.tileMousePosition.x}, {this.state.UI.tileMousePosition.y}</div>
        <div><strong>Selection square:</strong></div>
        <div>Coords: {selectionSquare.x}, {selectionSquare.y}</div>
        <div>No. Units: {selectionSquare.numberOfUnits}</div>
      </div>
    );
  }
}
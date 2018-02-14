import React from "react";

import Order from "./Order";

export default class SelectionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      UI: this.props.UI,
      currentPlayer: this.props.currentPlayer
    };
  }

  render() {

    const renderSelectionDetails = () => {
      let displaySquare;

      if (this.state.UI.selection.square) {
        displaySquare = this.state.UI.selection.square;
      } else {
        displaySquare = this.state.UI.tileMousePosition;
      }

      // if (displaySquare.units[0]) {
      //   displayUnit = displaySquare.units[0];
      // }

      return(
        <div>
          {renderSquareDetails(displaySquare)}
          {renderUnitDetails(displaySquare)}
          {renderStructureDetails(displaySquare)}
        </div>
      );
    }

    const renderStructureDetails = (square) => {
      if (square.structures && square.structures.length > 0) {
        const allStructures = square.structures.map((structure) => {
          if (structure.complete) {
            return(<span key={structure.id}><strong>{structure.type} </strong></span>);
          } else {
            return(<span key={structure.id}>{structure.type} </span>);
          }
        });

        return(
          <div>
            <span><strong>Structures: </strong></span>
            {allStructures}
          </div>
        );
      }
    }

    const renderSquareDetails = (square) => {
      return(
        <div>
          <div><strong>Square:</strong></div>
          <div>Coordinates: {square.x}, {square.y}</div>  
        </div>
      );
    }

    const renderUnitDetails = (square) => {
      if (!square.units) { return false; }

      let unit;

      if (this.state.UI.selection.unit) {
        unit = this.state.UI.selection.unit;
      } else {
        unit = square.units[0]
      }
      if (unit) {
        return(
          <div>
            <div><strong>Unit:</strong></div>
            <div>Type: {unit.type}</div>
            <div>Moves: {unit.moves}</div>
            <div>Orders: {unit.order}</div>
            <div>State: {unit.state}</div>
          </div>
        );
      }
    }


    const renderOrdersOfSelectedUnit = () => {
      let listOfOrders = [];

      if (this.state.UI.selection.unit) {
        listOfOrders = Rules.ordersForUnit(this.state.UI.selection.unit, this.state.UI.selection.square, gameData.getCurrentPlayer())
        .map((order) => {
          return <Order key={order} inputController={this.props.inputController} name={order}/>;
        });
      }

      return listOfOrders;
    }

    const selectionDetailsStyle = {
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "400px",
      height: "200px",
      backgroundColor: "#e4e5d7"
    }
    
    return(
      <div style={selectionDetailsStyle}>
        {renderSelectionDetails()}
        {renderOrdersOfSelectedUnit()}
      </div>
    );
  }
}
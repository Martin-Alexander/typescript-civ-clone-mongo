import React from "react";

import Order from "./Order";

export default class SelectionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      UI: this.props.UI,
      currentPlayer: this.props.currentPlayer
    };
    this.rules = JSON.parse(rules);
  }

  componentWillMount() {
    global.updateSelectionDetails = (UI) => {
      this.setState({UI: UI});
    }
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
      if (square.units && square.units[0]) {
        return(
          <div>
            <div><strong>Unit:</strong></div>
            <div>Type: {square.units[0].type}</div>
            <div>Moves: {square.units[0].moves}</div>
            <div>Orders: {square.units[0].order}</div>
            <div>State: {square.units[0].state}</div>
          </div>
        );
      }
    }


    const renderOrdersOfSelectedUnit = () => {
      let listOfOrders = [];

      if (this.state.UI.selection.unit) {
        listOfOrders = this.rules.units[this.state.UI.selection.unit.type].allowed_orders.map((order) => {
          if (
            !(this.rules.orders[order].type == "construction" && 
            this.state.UI.selection.square.hasCompletedStructure(this.rules.orders[order].structure)) &&
            order !== this.state.UI.selection.unit.order &&
            this.state.currentPlayer.number === this.state.UI.selection.unit.player_number
          ) {
            return <Order key={order} inputController={this.props.inputController} name={order}/>;
          }
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
import React from "react";

import Order from "./Order";

export default class SelectionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { UI: this.props.UI };
    this.rules = JSON.parse(rules);
  }

  componentWillMount() {
    global.updateSelectionDetails = (UI) => {
      this.setState({UI: UI});
    }
  }

  render() {
    const renderSelectedSquareDetails = () => {
      if (this.state.UI.selection.square) {
        return(
          <div>
            <div><strong>Selection square:</strong></div>
            <div>Coords: {this.state.UI.selection.square.x}, {this.state.UI.selection.square.y}</div>
            <div>No. Units: {this.state.UI.selection.square.units.length}</div>
          </div>
        );
      }
    }

    const renderSelectedUnitDetails = () => {
      if (this.state.UI.selection.unit) {
        return(
          <div>
            <div><strong>Selection square:</strong></div>
            <div>Type: {this.state.UI.selection.unit.type}</div>
            <div>Moves: {this.state.UI.selection.unit.moves}</div>
            <div>Orders: {this.state.UI.selection.unit.order}</div>
            <div>State: {this.state.UI.selection.unit.state}</div>
          </div>
        );
      }
    }

    const renderOrdersOfSelectedUnit = () => {
      let orders = [];

      if (this.state.UI.selection.unit) {
        orders = this.rules.units[this.state.UI.selection.unit.type].allowed_orders.map((order) => {
          return <Order key={order} inputController={this.props.inputController} name={order}/>;
        });
      }

      return orders;
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
        {renderSelectedSquareDetails()}
        {renderSelectedUnitDetails()}
        {renderOrdersOfSelectedUnit()}
      </div>
    );
  }
}
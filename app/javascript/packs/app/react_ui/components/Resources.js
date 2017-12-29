import React from "react";

export default class Resources extends React.Component {
  render() {
    const resourcesStyle = {
      height: "100%"
    }

    return(
      <div style={resourcesStyle}>
        <span>  Military: 20 </span>
        <span>Civilian: 2 </span>
        <span>Supply: 128 </span>
        <span>Growth: 1</span>
      </div>
    );
  }
}

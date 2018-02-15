import React from "react";

export default class CityOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {structure: this.props.structure};

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({structure: this.props.structure});
  }

  handleChange(event) {
    this.state.structure.production = event.target.value;
    this.setState({structure: this.state.structure});
    this.props.inputController.setProduction();
  }

  productionOptions() {
    // This is eventually be changed to list all units from the rules
    const productionOptions = ["nothing", "infantry", "worker"].map((option, index) => {
      if (option === this.state.structure.production) {
        return(<option key={index} value={option}>{option}</option>);
      } else {
        return(<option key={index} value={option}>{option}</option>);
      }
    });

    return productionOptions;
  }

  render() {
    const userInterfaceStyle = {
      position: "absolute",
      left: "0",
      bottom: "210px",
      width: "400px",
      height: "50px",
      backgroundColor: "#e4e5d7"
    }
    
    return(
      <div style={userInterfaceStyle}>
        <form>
          <span><strong>Production: </strong></span>
          <select value={this.state.structure.production} onChange={this.handleChange}>
            {this.productionOptions()}
          </select>
        </form>
      </div>
    )
  }
}
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortAmountUp,
  faSortAmountDown
} from "@fortawesome/free-solid-svg-icons";

export default class TableColumn extends React.Component {
  constructor() {
    super();
    this.state = {
      orderby: "ASC"
    };
  }

  render() {
    return (
      <th
        onClick={() => {
          var by = this.state.orderby == "ASC" ? "DESC" : "ASC";
          this.setState({ orderby: by });
          this.props.sort(by);
        }}
        style={this.props.style}
      >
        {this.props.title}

        <FontAwesomeIcon
          icon={
            this.state.orderby === "ASC" ? faSortAmountUp : faSortAmountDown
          }
          className="float-right"
          size="sm"
        />
      </th>
    );
  }
}

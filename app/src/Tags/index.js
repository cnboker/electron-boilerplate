import React from "react";
import PropTypes from "prop-types";
/*

*/
export default class Tags extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: ""
    };
  }
  tagRender() {
    return this.props.tags.map((x, index) => {
      return (
        <span
          key={index}
          onClick={() => {
            var tag = this.state.selected === x ? "" : x;
            this.props.tagSelect({ catelog: this.props.catelog, tag });
            this.setState({ selected:  tag});
          }}
          className={`badge badge-pill ${
            this.state.selected === x ? "badge-warning" : "badge-primary"
          }`}
        >
          {x}
        </span>
      );
    });
  }

  render() {
    return (
      <React.Fragment>
      
        {this.tagRender()}
      </React.Fragment>
    );
  }
}

Tags.PropTypes = {
  // tags: PropTypes.arrayOf(PropTypes.shape(title : PropTypes.string.isRequired,
  // catelog : PropTypes.string.isRequired))
  tags: PropTypes.arrayOf(PropTypes.string.isRequired),
  catelog: PropTypes.string.isRequired
};

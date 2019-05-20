import React from 'react'
import PropTypes from 'prop-types'
/*

*/
export default class Tags extends React.Component {
  tagRender() {
    return this
      .props
      .tags
      .map((x, index) => {
        return <span
          key={index}
          onClick=
          { () => this.props.tagSelect({catelog:this.props.catelog,tag:x}) }
          className="badge badge-pill badge-primary">
          {x}
        </span>
      });
  }

  render() {
    return (
      <React.Fragment >
        <span
          className="badge badge-pill badge-primary"
          onClick=
          { () => this.props.tagSelect({catelog:this.props.catelog,tag:''})}>全部</span>
        {this.tagRender()}
      </React.Fragment>
    )
  }
}

Tags.PropTypes = { // tags: PropTypes.arrayOf(PropTypes.shape(title : PropTypes.string.isRequired,
  // catelog : PropTypes.string.isRequired))
  tags: PropTypes.arrayOf(PropTypes.string.isRequired),
  catelog: PropTypes.string.isRequired
}
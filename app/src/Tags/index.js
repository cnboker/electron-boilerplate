import React from 'react'
import PropTypes from 'prop-types'
/*

*/
export default class Tags extends React.Component {
  render() {
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
}

Tags.PropTypes = {
  //tags: PropTypes.arrayOf(PropTypes.shape(title : PropTypes.string.isRequired, catelog : PropTypes.string.isRequired))
  tags:PropTypes.arrayOf(PropTypes.string.isRequired),
  catelog:PropTypes.string.isRequired
}
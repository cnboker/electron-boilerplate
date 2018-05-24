import React, { Component } from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'

export default class DropdownButtonBinder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title
    }
  }
  getChildren(list) {
    return list.map((item) => {
      return (<MenuItem eventKey={item.value} key={item.key}>{item.key}</MenuItem >)
    })
  }

  onSelect(target) {
    this.setState({ title: target });

    if (this.props.onSelect) {
      this.props.onSelect(target)
    }
  }
  render() {
    const { dataSource, bsStyle, id } = this.props
    return (

      <DropdownButton title={this.state.title} bsStyle={bsStyle} key={id} id={id}
        onSelect={this.onSelect.bind(this)}
      >
        {this.getChildren(dataSource)}
      </DropdownButton>

    )
  }
}
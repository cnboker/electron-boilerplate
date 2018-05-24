import React, { Component } from 'react'
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap'

export default class RadioGroup extends Component {
  constructor(props) {
    super(props)
    //this.state ={value:0}
    this.onChange = this.onChange.bind(this)
  }

  onChange(value) {
    //this.setState({value})
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  getChildren(list) {
    return list.map((item) => {
      return (<ToggleButton value={item.value}>{item.key}</ToggleButton>)
    })
  }

  render() {
    const { dataSource, name } = this.props
    return (
      <ToggleButtonGroup type="radio" name={name}
        value={this.props.defaultValue}
        onChange={this.onChange}
      >
        {this.getChildren(dataSource)}
      </ToggleButtonGroup>
    )
  }
}
import React from 'react'

export class Switch extends React.Component {

  toggle(e) {
    e.stopPropagation();
    
    this.props.onClick()
  }
  render() {
    const { name, on } = this.props

    return (
     
        <label className="switch switch-3d switch-primary" >
          <input type="checkbox" className="switch-input" defaultChecked={on} name={name} />
          <span className="switch-label" onClick={this.toggle.bind(this)}></span>
          <span className="switch-handle"  onClick={this.toggle.bind(this)}></span>
        </label>
      
    )
  }
}

export default Switch
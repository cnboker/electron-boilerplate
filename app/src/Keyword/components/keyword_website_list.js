import React from 'react'
import {Link} from 'react-router-dom'

class WebsiteList extends React.Component {
  constructor(){
    super();
    this.state = {
      isOpen: false
    };
  }
  
  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;
    return (
      <div className="btn-group">
      <button type="button" className="btn btn-info dropdown-toggle" 
      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"  onClick={this.toggleOpen.bind(this)}>
        站点列表
      </button>
      <div className="dropdown-menu" className={menuClass}>
        {this.props.websites.map(x=>{
          return <a className="dropdown-item" href="#" onClick={(e)=>this.props.onFliter(x._id,e)} key={x._id}>{x._id}</a>
        })}
      </div>
    </div>
    )
  }

}

export default WebsiteList;
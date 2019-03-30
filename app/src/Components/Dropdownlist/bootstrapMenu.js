import React from "react";
import {Link} from 'react-router-dom'

class BootstrapMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

  componentDidMount() {}

  render() {
    const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;
    const {title,data} = this.props;
    return (
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-info dropdown-toggle"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          onClick={this.toggleOpen.bind(this)}
        >
          {title}
        </button>
        <div className="dropdown-menu" className={menuClass}>
          {data.map((x,key) => {
            return (
              <Link onClick={()=>this.setState({isOpen:false})}
                className="dropdown-item" key={key}
                to={x.link}
              >
                {x.name}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}

export default BootstrapMenu;

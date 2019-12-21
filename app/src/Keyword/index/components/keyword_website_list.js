import React from "react";

class WebsiteList extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      selectedMenuItem:{label:'全部',value:''}
    };
  }

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

  componentDidMount() {}

  getItems(){
    var result = [];
  //  result.push({label:'全部',value:''})
    for(var item of this.props.websites){
      result.push({label:item._id, value:item._id})
    }
    return result;
  }

  getCloseBtn(){
    if(this.state.selectedMenuItem.value !== ''){
      return  <span onClick={e=>{
        e.stopPropagation();
        this.props.onFliter('', e);
        this.setState({selectedMenuItem:{label:'全部',value:''}})
        
      }}>[ x ]</span>
    }
    return null;
  }

  render() {
    const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""} scrollable-menu`;
    return (
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-info dropdown-toggle btn-sm"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          onClick={this.toggleOpen.bind(this)}
        >
         {this.getCloseBtn()}
         {this.state.selectedMenuItem.label} 
        </button>
        <div  className={menuClass}>
       
          {this.getItems().map(x => {
            return (
              <a
                className="dropdown-item"
                href="#"
                onClick={e => {
                  this.props.onFliter(x.value, e);
                  this.setState({isOpen:false,selectedMenuItem:{label:x.label,value:x.value}})
                }}
                key={x.value}
              >
                {x.label} 
              </a>
            );
          })}
        </div>
      </div>
    );
  }
}

export default WebsiteList;

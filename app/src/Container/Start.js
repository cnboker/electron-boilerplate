import React ,{Component} from 'react'
import {Button} from 'react-bootstrap'

export default class Start extends Component{
  constructor(props){
    super(props);
    this.buttonClick = this.buttonClick.bind(this);
  }
  buttonClick(){
    window.backgroundTask();
  }

  render(){
    return(
      <Button bsStyle="primary" bsSize="large"  onClick={this.buttonClick}>
      擦亮关键字
      </Button>
    )
  }
}
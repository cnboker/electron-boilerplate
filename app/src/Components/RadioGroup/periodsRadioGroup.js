import React, {Component} from 'react'
import {ToggleButtonGroup, ToggleButton} from 'react-bootstrap'
import LocalizedStrings from 'react-localization'
import Cookies from "js-cookie"

const resources = new LocalizedStrings({
  en: {
    week: 'Week',
    month:'Month',
    year:'Year',
  },
  zh: {
    week: '周',
    month:'月',
    year:'年',
  }
})
var language = Cookies.get('language') || resources.getLanguage()    
resources.setLanguage(language)


class PeriodRadioGroup extends Component{
  constructor(props){
    super(props)
    this.state ={value:7}
    this.onChange = this.onChange.bind(this)
  }
  
  onChange(value){
    this.setState({value})
    if(this.props.onChange){
      this.props.onChange(value)
    }
  }

  render(){
    return (
        <div>
          
            <ToggleButtonGroup type="radio" name="periods" 
            defaultValue={this.state.value}
            onChange={this.onChange}
            >
              <ToggleButton value={7} className="bth-outline-info">1{resources.week}</ToggleButton>
              <ToggleButton value={30}>1{resources.month}</ToggleButton>
              <ToggleButton value={60}>2{resources.month}</ToggleButton>
              <ToggleButton value={90}>3{resources.month}</ToggleButton>
              <ToggleButton value={120}>4{resources.month}</ToggleButton>
              <ToggleButton value={150}>5{resources.month}</ToggleButton>
              <ToggleButton value={180}>6{resources.month}</ToggleButton>
              <ToggleButton value={360}>1{resources.year}</ToggleButton>
              <ToggleButton value={720}>2{resources.year}</ToggleButton>              
            </ToggleButtonGroup>
         
        </div>

    )
  }
}

export default PeriodRadioGroup
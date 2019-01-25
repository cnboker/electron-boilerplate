import React, { Component } from "react";
import KeywordExtender from "./keywordExtender";

class CustomKeywordExtender extends Component {
  constructor() {
    super();
    this.state = {
      link: "",
      keyword: ""
    };
  }

  handleKeyPress = (event) => {
    if(event.key == 'Enter'){
      console.log('enter press here! ',this.refs)
      this.refs.keywordExtender.findKeywords()
    }
  }

  render() {
    return (
      <div>
        <div className="input-group flex-nowrap">
          <div className="input-group-prepend">
            <span className="input-group-text" id="addon-wrapping">
              关键词
            </span>
          </div>
          <input ref="inputBox"
            type="text"
            className="form-control"
            placeholder="输入关键字，回车键查询"
            aria-label="keyword"
            aria-describedby="addon-wrapping"
            onKeyPress={this.handleKeyPress}
            onChange={(evt)=>this.setState({keyword:evt.target.value})}
          />
        </div>
        <div className="bd-example">
          <KeywordExtender ref="keywordExtender" keyword={this.state} displaySearchBtn={false}/>
        </div>
      </div>
    );
  }
}

export default CustomKeywordExtender;

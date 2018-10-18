import React, { Component } from "react";
import { renderField } from "../utils/fieldLevelValidation";

export default class Index extends Component {
  componentDidMount() {
   
  }
  render() {
    return (
      <div>
        <input type="text" id="focusKeyword" />
        <textarea type="text" id="content" />
        <div id="snippet" />
        <div id="output" />
      </div>
    );
  }
}

import React, { Component } from "react";
import { Button } from "react-bootstrap";

export default class Start extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="card">
            <div className="card-body">
              <h2>如何用?</h2>
              <h2>运算逻辑是什么?</h2>
              <h2>怎样提高效果?</h2>
              <h2>常见问题 </h2>
            </div>
            <div className="card-footer" />
          </div>
        </div>
      </div>
    );
  }
}

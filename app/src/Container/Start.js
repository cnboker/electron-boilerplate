import React, {Component} from "react";
import {Button} from "react-bootstrap";

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
              <div className="page-header">
                <h2>如何使用?</h2>
              </div>
              <p class="lead">this is test</p>
              <div className="page-header">
                <h2>运算逻辑是什么</h2>
              </div>
              <p className="lead">

              </p>
              <div className="page-header">
                <h2>怎样提高效果</h2>
              </div>
              <p className="lead">
                使用软件的人越多则效果越好，想取得网站关键字好的优化效果，保持软件运行就可以做到。
              </p>
              <div className="page-header">
                <h2>常见问题</h2>
              </div>
              <p className="lead">
                
              </p>
            </div>
            <div className="card-footer"/>
          </div>
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";
import Event from '../Event/list'
import Extender from './keywordExtender'
import Rank from './rankChart'

export default class Index extends Component {
  componentDidMount() {
  }
  
  render() {
    return (
      <div>
        <ul className="nav nav-tabs" role="tablist">
          <li className="nav-item">
            <a
              className="nav-link active"
              href="#rank"
              role="tab"
              data-toggle="tab"
            >
              排名跟踪
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#event" role="tab" data-toggle="tab">
              事件
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#keywords" role="tab" data-toggle="tab">
              拓词
            </a>
          </li>
        </ul>

        <div className="tab-content">
          <div role="tabpanel" className="tab-pane fade  active show" id="rank">
            <Rank id={this.props.match.params.id}/>
          </div>
          <div role="tabpanel" className="tab-pane fade " id="event">
            <Event {...this.props}/>
          </div>
          <div role="tabpanel" className="tab-pane fade" id="keywords">
            <Extender/>
          </div>
        </div>
      </div>
    );
  }
}

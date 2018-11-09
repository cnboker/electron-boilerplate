import React, { Component } from "react";
import { connect } from "react-redux";
import EventBus from "eventing-bus";
import { sendToBackground } from "../communication";

class Index extends Component {
  constructor() {
    super();
    this.state = {
      keywords: ["正在获取拓词数据..."]
    };
  }
  componentDidMount() {
    var kw = this.getKeyword();
    //发消息给后台
    sendToBackground("wordQuery", kw.keyword);
    var self = this;
    EventBus.on("wordResponse", function(obj) {
      console.log("react wordResponse", obj);
      kw = self.getKeyword();
      if (kw.keyword == obj.keyword) {
        self.setState({
          keywords: obj.result
        });
      }
    });
  }

  getKeyword() {
    var id = this.props.match.params.id;
    const { keywords } = this.props;
    var kw = keywords.filter(x => {
      return x._id == id;
    });
    return kw[0];
  }

  componentWillUnmount() {}

  wordReady(keywords) {
    console.log("wordReady", keywords);
  }

  render() {
    return (
      <div>
        <ul className="list-group">
          {this.state.keywords.map((item, index) => {
            return (
              <li className="list-group-item" key={index}>
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { keywords: state.keywords, client: state.client };
};
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(Index);

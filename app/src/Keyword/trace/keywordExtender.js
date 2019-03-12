import React, { Component } from "react";
// import EventBus from "eventing-bus"; import { sendToBackground } from
// "../communication";
import { Link } from "react-router-dom";
import ipcBus from '~/ipc/ipcBus';

class Index extends Component {
  constructor() {
    super();
    this.state = {
      keywords: [],
      selectedKeywords: [],
      searchButtonStatus: false
    };
    this.unmount = false;
  }

  componentDidMount() {}

  findKeywords() {
    this.setState({
      keywords: ["正在获取拓词数据..."],
      searchButtonStatus: true
    });

    var kw = this.props.keyword;
    console.info("keyword=", kw);
    // 发消息给后台 sendToBackground("wordQuery", kw.keyword); var self = this;
    // EventBus.on("wordResponse", function(obj) {   if (self.unmount) return;
    // console.log("react wordResponse", obj);   kw = self.props.keyword;   if
    // (kw.keyword == obj.keyword) {     self.setState({ keywords: obj.result });
    // } });
    var self = this;
    ipcBus.frontToBack("wordQuery", kw.keyword).then(obj => {
      if (self.unmount) return;
      console.log("react wordResponse", obj);
      kw = self.props.keyword;
      if (kw.keyword == obj.keyword) {
        self.setState({ keywords: obj.result });
      }
    });
  }

  componentWillUnmount() {
    this.unmount = true;
  }

  wordReady(keywords) {
    console.log("wordReady", keywords);
  }

  leftClick(index) {
    var selected = this.state.keywords.splice(index, 1);
    var selectedKeywords = this.state.selectedKeywords;
    selectedKeywords.push(selected);
    this.setState(selectedKeywords);
  }

  rightClick(index) {
    var selectedKeywords = this.state.selectedKeywords;
    var removeItem = selectedKeywords.splice(index, 1);
    this.state.keywords.push(removeItem);
    this.setState(selectedKeywords);
  }

  keywordSubmit() {}

  render() {
    return (
      <div>
        <div className="alert alert-success">
          请等待拓词数据全部出现，点击选择相应关键词，然后点击“添加到排名列表”完成操作
        </div>
        <div className="row">
          <div className="col-sm">
            {this.props.displaySearchBtn && (
              <button
                className="btn btn-primary"
                disabled={this.state.searchButtonStatus}
                onClick={this.findKeywords.bind(this)}
              >
                {" "}
                获取拓词数据{" "}
              </button>
            )}
            <ul className="list-group section-nav">
              {this.state.keywords.map((item, index) => {
                return (
                  <li
                    className="list-group-item"
                    key={index}
                    onClick={this.leftClick.bind(this, index)}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="col-sm">
            <ul className="list-group">
              {this.state.selectedKeywords.map((item, index) => {
                return (
                  <li
                    className="list-group-item"
                    key={index}
                    onClick={this.rightClick.bind(this, index)}
                  >
                    {item}
                  </li>
                );
              })}
              <li className="list-group-item">
                <Link
                  to={{
                    pathname: "/keyword/new",
                    state: {
                      newKeywords: this.state.selectedKeywords.join("\n"),
                      link: this.props.keyword.link
                    }
                  }}
                  className="btn btn-primary"
                  onClick={e => {
                    if (this.state.selectedKeywords.length == 0) {
                      e.preventDefault();
                    }
                  }}
                >
                  添加到排名列表
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;

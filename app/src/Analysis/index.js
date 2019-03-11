import React, { Component } from "react";
import Event from "../Event/list";
import Extender from "./keywordExtender";
import Rank from "./rankChart";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from 'classnames'
import { connect } from "react-redux";
 class Index extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  getKeyword() {
    var id = "";
    if (this.props.match) {
      id = this.props.match.params.id;
      const { keywords } = this.props;
      return keywords[id];
    }

    return id;
  }

  render() {
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "1" })}
              onClick={() => {
                this.toggle("1");
              }}
            >
              排名跟踪
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "2" })}
              onClick={() => {
                this.toggle("2");
              }}
            >
              记录
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "3" })}
              onClick={() => {
                this.toggle("3");
              }}
            >
              拓词
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Rank {...this.props}/>
          </TabPane>
          <TabPane tabId="2">
            <Event {...this.props} />{" "}
          </TabPane>
          <TabPane tabId="3">
            <Extender keyword={this.getKeyword()} displaySearchBtn={true}/>{" "}
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { keywords: state.keywords, client: state.client };
};
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(Index);


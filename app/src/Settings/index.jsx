import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { unsetClient } from "../Client/action";
import { bindActionCreators } from "redux";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      engine: props.client.engine || "baidu",
      rankSet: props.client.rankSet || 1
    };
    this.rankSetChange = this.rankSetChange.bind(this);
    this.engineChange = this.engineChange.bind(this);
  }

  engineChange(event) {
    this.setState({
      engine: event.target.value
    });
   
    this.handleSubmit({
      engine: event.target.value,
      rankSet:this.state.rankSet
    });
  }

  rankSetChange(event) {
    this.setState({
      rankSet: event.target.value
    });
    
    this.handleSubmit({
      rankSet: event.target.value,
      engine:this.state.engine
    });
  }

  handleSubmit(data) {
    console.log('submit data', data);
    const url = `${process.env.REACT_APP_API_URL}/user/setting`;
    console.log("url", url);
    axios({
      url: url,
      method: "post",
      data,
      headers: {
        Authorization: `Bearer ${this.props.client.access_token}`
      }
    })
      .then(response => {
        //this.props.unsetClient();
        //this.props.history.push("/login");
        toast.success("设置成功,请退出重新登录生效", {
          position: toast.POSITION.BOTTOM_CENTER
        });
        //this.props.history.push("/keyword");
      })
      .catch(e => {
        toast.error(e.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      });
  }

  render() {
    return (
      <div className="bd-panel">
        <div className="alert alert-info">参数修改后，需重新登录生效!</div>
        <p>系统规则设定</p>
        <div className="form-group">
          <input
            type="radio"
            value="2"
            checked={this.state.rankSet == 2}
            onChange={this.rankSetChange.bind(this)}
          />
          仅检测排名
        </div>
        <div className="form-group">
          <input
            type="radio"
            value="1"
            checked={this.state.rankSet == 1}
            onChange={this.rankSetChange.bind(this)}
          />
          检测排名同时执行优化
        </div>
      
        <hr />
        <p>
          切换引擎->切换后,关键词统计数据将重置,请谨慎操作,切换到google确保网络通畅.
        </p>

        <div className="form-group">
          <input
            type="radio"
            value="baidu"
            checked={this.state.engine === "baidu"}
            onChange={this.engineChange.bind(this)}
          />
          baidu
        </div>
        <div className="form-group">
          <input
            type="radio"
            value="google"
            checked={this.state.engine === "google"}
            onChange={this.engineChange.bind(this)}
          />
          google
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    client: state.client
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch,
    ...bindActionCreators({ unsetClient }, dispatch)
  };
};
//state表示reducer, combineReducer包含state和dispatch
//export default connect(mapStateToProps)(Setting);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

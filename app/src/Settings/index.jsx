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
      rankSet: props.client.rankSet || 2
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
        <div className="alert alert-info">系统设置更改后，需重新登录生效!</div>
        <p>系统规则设定</p>
        <div className="form-group">
          <input
            type="radio"
            value="2"
            checked={this.state.rankSet == 2}
            onChange={this.rankSetChange.bind(this)}
          />
          排名监控模式-自动检测排名变化
        </div>
        <div className="form-group">
          <input
            type="radio"
            value="1"
            checked={this.state.rankSet == 1}
            onChange={this.rankSetChange.bind(this)}
          />
          智能优化模式-检测排名且智能优化
        </div>
      
        <hr />
        <p>
          切换引擎->注意，更改搜索引擎会导致原有关键字排名数据清零，请谨慎操作。如果选择google.com需要确保你本地网络能够正常访问
        </p>

        <div className="form-group">
          <input
            type="radio"
            value="baidu"
            checked={this.state.engine === "baidu"}
            onChange={this.engineChange.bind(this)}
          />
          baidu.com
        </div>
        <div className="form-group">
          <input
            type="radio"
            value="google"
            checked={this.state.engine === "google"}
            onChange={this.engineChange.bind(this)}
          />
          google.com
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

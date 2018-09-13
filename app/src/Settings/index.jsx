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
      engine: props.client.token.engine || 'baidu'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      engine: event.target.value
    });
    console.log(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();
    var engine = this.state.engine;
    const url = `${process.env.REACT_APP_API_URL}/user/engineChange`;
    console.log("url", url);
    axios({
      url: url,
      method: "put",
      data: {
        engine
      },
      headers: {
        Authorization: `Bearer ${this.props.client.token.access_token}`
      }
    })
      .then(response => {
      
        this.props.unsetClient();
        this.props.history.push("/login");
        toast.success('切换成功', {
          position: toast.POSITION.BOTTOM_CENTER
        });
        this.props.history.push("/keyword");
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
        <p>切换引擎->切换后,系统需要重新登录,关键字统计数据将重置,请谨慎操作,切换到google确保网络通畅.</p>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              type="radio"
              value="baidu"
              checked={this.state.engine === "baidu"}
              onChange={this.handleChange}
            />
            baidu
          </div>
          <div className="form-group">
            <input
              type="radio"
              value="google"
              checked={this.state.engine === "google"}
              onChange={this.handleChange}
            />
            google
          </div>

          <button type="submit" className="btn btn-default">
            确定
          </button>
        </form>
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
    ...bindActionCreators({unsetClient }, dispatch)
  }
}
//state表示reducer, combineReducer包含state和dispatch
//export default connect(mapStateToProps)(Setting);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
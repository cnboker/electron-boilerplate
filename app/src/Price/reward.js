import React, { Component } from "react";
import Account from "./account";
import axiox from "axios";
import { connect } from "react-redux";

 class Reward extends Component {
  constructor() {
    super();
    this.state = {
      profile: {
        grade: "",
        rewardCode:'',
        userName: "",
        expiredDate: Date.now(),
        balance: []
      }
    };
  }

  componentDidMount() {
    console.log(this.props.client);
    var $this = this;
    const url = `${process.env.REACT_APP_API_URL}/profile`;
    axiox({
      url,
      headers: {
        Authorization: `Bearer ${this.props.client.token.access_token}`
      }
    })
      .then(function(res) {
        $this.setState({
          profile: res.data
        });
       // $this.forceUpdate()
      })
      .catch(function(e) {
        toast.error(e.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      });
  }

  render() {
    const model = this.props.model;
    return (
      <div>
        <div className="alert alert-success" role="alert">
          <h3>分享越多收获越多！</h3>
          <hr />
          <p className="mb-0">
            把好用的钢铁侠推荐给更多人使用，你会有更多收获，经你推荐的注册用户，一旦激活VIP身份，你就能有
            <strong
              style={{
                color: "red"
              }}
            >
            
              50元/人
            </strong>
            奖金拿，奖励随时提现.
            <br/><br/>
            <span style={{fontStyle: "italic"}}>不要忘记告诉新注册用户注册的时候输入你的推荐码哟!</span>
          </p>
        </div>

        <p>
          您的推荐码:
          <span
            style={{
              fontSize: "36px",
              color:"red",
              marginLeft:'15px'
            }}
          >
            {this.state.profile.rewardCode}
          </span>
        </p>
          
        <Account balance={this.state.profile.balance.filter(x=>x.payType == 2)} />
     
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return { client: state.client };
};

//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(Reward);
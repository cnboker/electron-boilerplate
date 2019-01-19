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
        rewardCode: "",
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
       
      });
  }

  getStats(balance) {
    var amount = balance.reduce((sum, val) => {
      return (sum += val.amount);
    }, 0);
    var paidAmount = balance
      .filter(f => f.status === 1)
      .reduce((sum, val) => {
        return (sum += val.amount);
      }, 0);
    var unPaidAmount = amount - paidAmount;
    return {
      amount,
      paidAmount,
      unPaidAmount
    };
  }

  render() {
    const balance = this.state.profile.balance.filter(x => x.payType == 2);
    const stats = this.getStats(balance);
    return (
      <div>
        <div className="alert alert-success" role="alert">
          <h3>分享越多,收获越多！</h3>
          <hr />
          <p className="mb-0">
            把好用的钢铁侠推荐给更多人使用，你会有更多收获。经你推荐的注册用户，一旦激活VIP身份，你就能有
            <strong
              style={{
                color: "red"
              }}
            >
              50元/人
            </strong>
            奖金拿，奖励随时可提现.
            <br />
            <br />
            <span style={{ fontStyle: "italic" }}>
              记得提醒新用户在注册时，输入你的专用推荐码哟！
            </span>
          </p>
        </div>

        <p style={{marginBottom:"50px"}}>
          钢铁侠赐你专用推荐码:
          <span
            style={{
              fontSize: "36px",
              color: "red",
              marginLeft: "15px"
            }}
          >
            {this.state.profile.rewardCode}
          </span>
        </p>
        <hr/>
        <Account balance={balance} >
        <h5>我的分享收益</h5>
          <div className="text-right">
            总收益:
            {stats.amount.toFixed(2)}
            元，已提现金额:{stats.paidAmount.toFixed(2)}元，余额:
            {stats.unPaidAmount.toFixed(2)}
          </div>
        </Account>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { client: state.client };
};

//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(Reward);

import React, { Component } from "react";
import Account from "./account";
import { connect } from "react-redux";
import ImageUploader from "~/src/Components/Fileuploader/index";
import { userUpdate } from "~/src/Profile/action";

class Reward extends Component {
  constructor() {
    super();
    this.state = {
 
      pictures: []
    };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(pictureFiles, pictureDataURLs) {
    console.log("ondrop", pictureFiles, pictureDataURLs);
    this.setState({
      pictures: this.state.pictures.concat(pictureFiles)
    });
  }

  componentDidMount() {}

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
    return { amount, paidAmount, unPaidAmount };
  }

  onFinished(url) {
    this.props.dispatch(
      userUpdate(this.props.client.userName, { wxpayUrl: url })
    );
  }

  onRemove(url) {
    this.props.dispatch(
      userUpdate(this.props.client.userName, { wxpayUrl: "" })
    );
  }

  render() {
    const { profile } = this.props;
   
    const balance = profile.balance.filter(x => x.payType == 2);
    const stats = this.getStats(balance);
    const images = [];
    if(profile.wxpayUrl){
      images.push(profile.wxpayUrl)
    }
    console.log('profile',profile,images)
    return (
      <div>
        <h3>分享越多,收获越多！</h3>
        <div className="mt-3 mb-3">
          把好用的钢铁侠推荐给更多人使用，您会有更多收获。经您推荐的注册用户，一旦激活VIP身份，您就能有
          <strong
            style={{
              color: "red"
            }}
          >
            50元/人
          </strong>
          奖金拿，奖励随时可提现.
          <br />
          记得提醒新用户在注册时，输入您的专用推荐码哟！
          <p>
            您的推荐码:
            <span
              style={{
                fontSize: "36px",
                color: "red",
                marginLeft: "15px"
              }}
            >
              {profile.rewardCode}
            </span>
          </p>
        </div>
        <h3>点击下面图标上传收款码，方便给您返还奖励</h3>
        <div className="mt-3 mb-3">
          <ImageUploader
            images={images}
            onFinished={this.onFinished.bind(this)}
            onRemove={this.onRemove.bind(this)}
          />
        </div>

        <h3>我的分享收益</h3>
        <div className="mt-3 mb-3">
          <Account balance={balance} onlyReward={true}>
            <div className="text-right">
              总收益: {stats.amount.toFixed(2)}
              元，已提现金额:{stats.paidAmount.toFixed(2)}元，余额:{" "}
              {stats.unPaidAmount.toFixed(2)}
            </div>
          </Account>
          <p>客服人员每周统一办理个人分享收益提现。请注意自己的收款微信上的收款信息。</p>
          <p>群号：340828020</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { client: state.client, profile: state.userProfile };
};

//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(Reward);

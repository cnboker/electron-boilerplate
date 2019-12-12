import React, { Component } from "react";
import Account from "./account";
import { connect } from "react-redux";
import ImageUploader from "~/src/Components/Fileuploader/index";
import { userUpdate } from "~/src/Profile/action";
import Share from "social-share-react";
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
    if (profile.wxpayUrl) {
      images.push(profile.wxpayUrl);
    }
    var key = btoa(
      `id=${profile._id}&url=${encodeURIComponent(
        process.env.REACT_APP_API_URL
      )}/promotion/trace`
    );

    return (
      <div>
        <h5>分享越多,收获越多！</h5>
        <div className="mt-3 mb-3">
          把好用的钢铁侠推荐给更多人使用，你会有更多收获。
          <br />
          经你推荐的注册用户，一旦激活VIP身份，您就能有{" "}
          <strong
            style={{
              color: "red"
            }}
          >
            50
          </strong>
          元/人奖金拿，奖励随时可提现。记得提醒新用户在注册时，输入您的专用推荐码哟！
          <br/><br/>
        </div>
        <div className="mt-3 mb-3">
          <h5>你的专属推荐码</h5>
          <span
            style={{
              fontSize: "36px",
              color: "red",
              marginLeft: "15px"
            }}
          >
            {profile.rewardCode}
          </span>
          <br/><br/>
        </div>
        <h5>你也可以通过专属的推荐链接分享到自己的网站，或是微博、朋友圈等</h5>
        <div className="mt-3 mb-3">
          <Share
            url={`http://www.kwpolish.com/?t=${key}`}
            title="钢铁侠-提升网站排名好帮手"
            disabled={["google", "facebook", "twitter"]}
          ></Share>
          <br/><br/>
        </div>
        <h5>点击下面图标上传你的微信收款码，方便给你发放推荐奖励</h5>

        <div className="mt-3 mb-3">
          <ImageUploader
            images={images}
            onFinished={this.onFinished.bind(this)}
            onRemove={this.onRemove.bind(this)}
          />
          <br/><br/>
        </div>

        <h5>我的分享收益</h5>
        <div className="mt-3 mb-3">
          <Account balance={balance} onlyReward={true}>
            <div className="text-right">
              总收益: {stats.amount.toFixed(2)}
              元，已提现金额:{stats.paidAmount.toFixed(2)}元，余额:{" "}
              {stats.unPaidAmount.toFixed(2)}
            </div>
          </Account>
          <p>
            如果你要提取个人的推荐奖励，只须提交个人的微信收款码，客服人员每周统一办理一次提现。请注意自己的收款微信上的收款信息。其它事宜，可查看【帮助】，或咨询客服人员。
          </p>
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

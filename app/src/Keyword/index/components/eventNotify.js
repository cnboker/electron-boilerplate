import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

export default class EventNotify extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "你可以提交更多关键词，优化效果会更好。",
      className: "alert alert-success"
    };
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.messageLoop();
    }, 60000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  messageLoop() {
    var keywords = Object.values(this.props.keywords);
    var result = this.expired10Days();
    console.log("less10", result);
    if (result.less10) {
      if (result.value > 0) {
        this.setState({
          message: `你的VIP服务将在${result.value}天后到期，请到用户中心及时续费!`,
          className: "alert alert-success"
        });
      } else {
        this.setState({
          message: "VIP会员资格已过期, 请到用户中心及时续费!",
          className: "alert alert-danger"
        });
      }
      return;
    }

    if (keywords.length === 0) {
      this.setState({
        message: "点击下方【新建】，提交新项目呗",
        className: "alert alert-success"
      });
    } else if (this.systemUnchecked(keywords)) {
      this.setState({
        message: "钢铁侠可能未正常检测，具体请查看《帮助》介绍方法针对性解决",
        className: "alert alert-danger"
      });
    } else if (this.all120(keywords)) {
      this.setState({
        message: "请查看《帮助》针对性解决排名数据120+的问题",
        className: "alert alert-danger"
      });
    } else if (keywords.length < 50) {
      this.setState({
        message: "多上词，自动优化，流量增长快起来",
        className: "alert alert-success"
      });
    } else if (this.rankIssue(keywords)) {
      this.setState({
        message: "排名异常情况，可查看【排名跟踪】及【记录】排查问题",
        className: "alert alert-success"
      });
    }
  }

  //VIP到期前10天，开始提醒
  expired10Days() {
    const { profile } = this.props;
    if (profile.gradeValue !== 2) return {
      less10: false,
      value: -1
    };
    var less10 = moment(profile.expiredDate).diff(moment(), "days");
    return {
      less10: less10 < 10,
      value: less10
    };
  }

  //关键词提交时间超过10分钟，排名数据全部为0
  systemUnchecked(keywords) {
    var unCheckedKeywords = keywords.filter(x => {
      return (
        moment().diff(moment(x.createDate), "minutes") > 10 &&
        x.originRank === 0
      );
    });
    return unCheckedKeywords.length === keywords.length;
  }

  //关键词排名数据全部为120+
  all120(keywords) {
    var data120 = keywords.filter(x => {
      return x.originRank === -1;
    });
    return data120.length === keywords.length;
  }

  rankIssue(keywords) {
    var isOkData = keywords.filter(x => {
      return x.originRank >= x.dynamicRank;
    });
    return isOkData.length < keywords.length - isOkData.length;
  }

  render() {
    return (
      <div>
        {/* {(this.props.profile.gradeValue || 1) === 1 && (
          <div className="alert alert-light">
            免费版用户可以优化5个关键词,现在升级VIP马上就能优化更多关键词, 快去
            <Link to="/pay">升级</Link>吧!
          </div>
        )} */}
        <div id="__messages" className={this.state.className}>
          {this.state.message}
        </div>
      </div>
    );
  }
}

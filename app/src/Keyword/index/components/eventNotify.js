import React from "react";
import { Link } from "react-router-dom";
export default class EventNotify extends React.Component {
  render() {
    return (
      <div>
         {/* {(this.props.profile.gradeValue || 1) === 1 && (
          <div className="alert alert-light">
            免费版用户可以优化5个关键词,现在升级VIP马上就能优化更多关键词, 快去
            <Link to="/pay">升级</Link>吧!
          </div>
        )} */}
        <div id="__messages" className="alert alert-success">
        你可以提交更多关键词，优化效果会更好。
        </div>
        {this.props.profile.vipUserExpired && (
          <div className="alert alert-danger">
            VIP会员资格已过期, 快去<Link to="/pay">升级</Link>吧!
          </div>
        )}
       
      </div>
    );
  }
}

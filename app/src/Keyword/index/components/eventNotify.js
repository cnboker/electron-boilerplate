import React from 'react'
import {Link} from 'react-router-dom'
export default class EventNotify extends React.Component {
  render() {
    return (
      <div>
      <div id="__messages" className="alert alert-success">
      保持程序运行，优化工作正在进行中...
    </div>
    {this.props.vipUserExpired && (
      <div className="alert alert-danger">
        VIP会员资格已过期, 快去<Link to="/pay">升级</Link>吧!
      </div>
    )}
      </div>
       
    )
  }
}
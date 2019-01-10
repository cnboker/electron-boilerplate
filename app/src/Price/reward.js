import React, {Component} from 'react'

export default class Reward extends Component {
  render() {
    return (
      <div>
        <div className="alert alert-success" role="alert">
          <h3>推荐新用户赚奖励！</h3>
          <hr/>
          <p className="mb-0">
            把您的推荐码告诉新用户，新用户注册的时候输入您的推荐码，注册成功一旦激活VIP身份，你就能获得<strong style={{
        color: 'red'
      }}>50元</strong>奖励,奖励的金额可以提现.
          </p>
        </div>
        <div className="bd-callout bd-callout-info">
          <p>您的推荐码是
            <code
              class="highlighter-rouge"
              style={{
              fontSize: '18px'
            }}>xzftk</code>
            赶快推荐给您的好友赚奖励吧!
          </p>
        </div>
        <div className="bd-callout bd-callout-info">
          <div class="form-group">
            <label for="exampleFormControlInput1">输入您的个人微信收款码，方便工作人员给您付款</label>
            <input
              type="email"
              class="form-control"
              id="exampleFormControlInput1"
              placeholder="个人微信收款码"/>
          </div>

          <div class="form-group">
            <button className="btn btn-primary">提交</button>
          </div>
        </div>
     
        <div className="alert alert-info" role="alert" style={{color:'red'}}>
          你邀请注册的用户中有XXX位用户升级VIP，在本月成绩榜中处于中上水平，继续加油。
        </div>
        </div>
    )
  }

}

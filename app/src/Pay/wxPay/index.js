import React from 'react'
import {toast} from "react-toastify";

export default class Index extends React.Component {

  componentDidMount() {
    this
      .props
      .requestwxPay();
  }

  wxPayPost() {
    this
      .props
      .postwxPay();
  }

  pendingRender() {
    return (
      <p className="text-left">
        付款完成后请点击
        <button
          className="btn btn-primary"
          onClick={this
          .wxPayPost
          .bind(this)}>
          确认按钮
        </button>提交完成支付</p>
    );
  }

  rePostRender() {
    return (
      <p className="text-left">提交成功,客服人员会尽快帮您处理，请稍后。如果继续充值请点击<button>充值</button>按钮继续充值</p>
    )
  }
  render() {
    const {profile} = this.props.client;
    const {wxpay} = this.props;
    return (
      <div>
        <div className="row">
          <div className="col">
            您的付款附加码是<kbd>{wxpay.payCode}</kbd>,请在付款的时候务必将改代码添加的付款备注内方便平台客服人员确认
          </div>
        </div>
        <div className="row">
          <div className="col">扫描二维码付款充值</div>
        </div>
        <div className="row">
          <div className="col">
            
            <img src={process.env.REACT_APP_AUTH_URL + wxpay.keeperQR} alt=""/>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {wxpay.status == 0
              ? this.pendingRender()
              : this.rePostRender()}
          </div>
        </div>
      </div>

    )
  }
}
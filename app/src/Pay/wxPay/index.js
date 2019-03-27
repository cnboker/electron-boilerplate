import React from 'react'
import {toast} from "react-toastify";
import {Link} from 'react-router-dom'
export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 0
    }
  }
  componentDidMount() {
    this
      .props
      .requestwxPay();
  }

  wxPayPost() {
    this
      .props
      .postwxPay();
    this.setState({status: 1})
  }

  pendingRender(wxpay) {
    return (
      <div>
        <p>
          您的付款附加码是<kbd>{wxpay.payCode}</kbd>, 付款时请将附加码添加到微信付款备注内, 方便平台客服人员确认.
        </p>
        <h4>扫描二维码付款充值</h4>

        <p>
          <img src={process.env.REACT_APP_AUTH_URL + wxpay.keeperQR} alt=""/>
        </p>
        <p className="text-left">
          付款完成后请点击"确认按钮" 提交完成支付</p><br/>
        <button
          className="btn btn-primary"
          onClick={this
          .wxPayPost
          .bind(this)}>
          完成支付确认
        </button>
      </div>
    );
  }

  rePostRender() {
    return (
      <div>
        <p className="text-left">提交成功,客服人员会尽快帮您处理，请稍后。如果继续充值请点击"充值“按钮继续充值
        </p>
        <p>
          <button onClick={() => this.setState({status: 0})} className="btn btn-primary">充值</button>
        </p>
      </div>
    )
  }

  render() {
    const {profile} = this.props.client;
    const {wxpay} = this.props;
    return (
      <div className="bs-expamle">
        {this.state.status == 0
          ? this.pendingRender(wxpay)
          : this.rePostRender()}
      </div>
    )
  }
}
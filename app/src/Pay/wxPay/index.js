import React from 'react'
import Dialog from "../../Components/Modals/Dialog";
import wxremarkImage from '../../assets/images/wxremark.png'
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

  reanderRemarkImage(e){
    e.preventDefault();
    this.refs.dialog.show({
      body: <img src={wxremarkImage} />,
      actions: [
        Dialog.CancelAction(() => {
          console.log("dialog cancel");
        })
      ],
    });
  }
  pendingRender(wxpay) {
    return (
      <div>
        <p>
          本次付款的对账码是<kbd>{wxpay.payCode}</kbd>。付款时，请将本次对账码添加到<a href="#" onClick={this.reanderRemarkImage.bind(this)}>微信付款的备注栏</a>内，以方便平台客服人员及时确认。
        </p>
        <h4>扫描二维码付款充值</h4>

        <p>
          <img src={process.env.REACT_APP_AUTH_URL + wxpay.keeperQR} alt=""/>
        </p>
        <p className="text-left">
          支付成功，请点击下方“完成支付"</p><br/>
        <button
          className="btn btn-primary"
          onClick={this
          .wxPayPost
          .bind(this)}>
          完成支付确认
        </button>
        <hr/>
        说明：<br/>
        默认支付一个月VIP费用。如果需要购买多月，请分开多次支付。请注意，每次对账码不同。<br/>
        正常工作时间，付款成功30分钟内完成充值。非工作时间，完成充值时间可能延后。你也可以通过购买充值码的方式完成充值。<br/>
        工作时间：周一至周六   9：00-12：00   14：00-17：00  （节假日除外）
      </div>
    );
  }

  recharge(){
    this.setState({status: 0})
    this
      .props
      .requestwxPay();
  }

  rePostRender() {
    return (
      <div>
        <p className="text-left">提交成功,客服人员会尽快帮您处理，请稍后。如果继续充值请点击"充值“按钮继续充值
        </p>
        <p>
          <button onClick={this.recharge.bind(this)} className="btn btn-primary">充值</button>
        </p>
      </div>
    )
  }

  render() {
    const {profile} = this.props.client;
    const {wxpay} = this.props;
    return (
      <div className="bs-expamle">
      <Dialog ref="dialog" />
        {this.state.status == 0
          ? this.pendingRender(wxpay)
          : this.rePostRender()}
      </div>
    )
  }
}
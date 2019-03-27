import {connect} from 'react-redux'
import React from 'react'
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  Row
} from 'reactstrap';
import classnames from 'classnames';
import WXPay from './wxPay/indexContainer'
import SNPay from './snPay/snActive'
import Price from "~/src/my/price";

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.toggle = this
      .toggle
      .bind(this);
    this.state = {
      activeTab: '1'
    }; 
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({activeTab: tab});
    }
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({
              active: this.state.activeTab === '1'
            })}
              onClick={() => {
              this.toggle('1');
            }}>
              微信扫码充值
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
              active: this.state.activeTab === '2'
            })}
              onClick={() => {
              this.toggle('2');
            }}>
              充值码充值
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row className="card-deck">
              <div className="card"><div className="card-body"><WXPay/></div></div>
              
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row className="card-deck">
              <div className="card">
                <div className="card-body"> <SNPay/></div>
              </div>
            </Row>
          </TabPane>
        </TabContent>
        <Price action={false}/>
      </div>
    )
  }
}

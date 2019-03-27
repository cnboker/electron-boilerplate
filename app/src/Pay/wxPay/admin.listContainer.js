import React from 'react'
import {connect} from 'react-redux'
import {findAllPay, confirmPay, cancelPay} from './action'
import AdminList from './admin.list'
import AdminQuery from './admin.query'
import {fetchProfile} from '~/src/Client/action'
import Pager from "~/src/Components/Tables/Pager";
import {PAGE_SIZE} from './contants'

class AdminListContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 0,
      data: [],
      pageCount: 0
    };
  }

  getPaginateData(page) {
    var currentIndex = page * PAGE_SIZE;
    var arr = Object.values(this.props.wxpay);
    return {
      pageCount: Math.ceil(arr.length / PAGE_SIZE),
      data: arr.slice(currentIndex, currentIndex + PAGE_SIZE)
    };
  }

  pagination = target => {
    const {data} = this.getPaginateData(target.selected);
    this.setState({page: target.selected, data: data});
  };

  onSelect(terms) {
    this
      .props
      .findAllPay({
        ...terms,
        ...{
          page: 0
        }
      })
  }

  componentDidUpdate(previousProps, previousState) {
    if (
      previousProps.wxpay !== this.props.wxpay 
    ) {
      this.setState({
        ...this.state,
        ...this.getPaginateData(this.state.page)
      });
    }
  }

  render() {
    console.log('admin.listcontainer', this.state)
    return (
      <div>
        <AdminQuery onSelect={this
          .onSelect
          .bind(this)}/>
        <AdminList data={this.state.data} confirmPay={this.props.confirmPay} cancelPay={this.props.cancelPay}/>
        <br/>
        <div className="float-right">
          <Pager
            pageCount={this.state.pageCount}
            onPageChange={this
            .pagination
            .bind(this)}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {wxpay: state.wxpay, client: state.client}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    findAllPay: (terms) => {
      dispatch(findAllPay(terms))
    },
    confirmPay: (payno) => {
      dispatch(confirmPay(payno))
    },
    cancelPay: (payno) => {
      dispatch(cancelPay(payno))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminListContainer)
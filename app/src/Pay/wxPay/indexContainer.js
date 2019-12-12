import {connect} from 'react-redux'
import {requestwxPay, postwxPay} from './action'
import Index from './index';

const mapStateToProps = (state, ownProps) => {
  return {client: state.client, wxpay: state.wxpay}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    requestwxPay: () => {
      dispatch(requestwxPay())
    },
    postwxPay: () => {
      dispatch(postwxPay())
    }
  }
} 

export default connect(mapStateToProps, mapDispatchToProps)(Index)
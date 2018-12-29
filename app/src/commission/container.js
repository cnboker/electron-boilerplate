import {connect} from 'react-redux'
import {fetchAll, commissionPay} from './action'
import Index from './index'

const mapStateToProps = (state, ownProps) => {
  return {
    commissions: state.commissions,
    client: state.client
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAll: (terms) => {
      dispatch(fetchAll(terms))
    },
    commissionPay: (id) => {
      dispatch(commissionPay(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
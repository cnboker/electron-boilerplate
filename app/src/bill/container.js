import {connect} from 'react-redux'
import {fetchAll, billPay, wxqr} from './action'
import Index from './index'

const mapStateToProps = (state, ownProps) => {
  return {
    bills: state.bills,
    client: state.client
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAll: (terms) => {
      dispatch(fetchAll(terms))
    },
    billPay: (id) => {
      dispatch(billPay(id))
    },
    wxqr:(user,id) =>{
      dispatch(wxqr(user,id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
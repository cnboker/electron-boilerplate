import actions from './actions'
import invariant from 'invariant'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from './Form'
import { connect } from 'react-redux'
import R from 'ramda'
import { toast } from 'react-toastify';
import resources from '../locale'

class New extends Component {
  constructor(){
    super()
  }
  onCommit(entity) {
    console.log('update entity', entity)
    var action
    if (this.getId() === 'new') {
      action = actions.create(entity,this.props.client)
    } else {
      action = actions.update(entity,this.props.client)
    }
    this.props.dispatch(action)
    .then((response)=>{
      toast.success(resources.fetch_data_ok, {
        position: toast.POSITION.BOTTOM_CENTER
      });
      this.props.history.push('/keyword')
    }).catch((e)=>{
      toast.error(e.response.data.message, {
        position: toast.POSITION.BOTTOM_CENTER
      });
    })
    //this.props.history.push('/keyword')
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('nextProps', nextProps)

  }
 
  getId() {
   return this.props.match.params.id;
  }

  getEntity() {
    var id = this.getId()
    if (id === 'new') {
      return { id: 0, engine: 'baidu'}
    } else {
      return R.find(R.propEq('_id', id))(this.props.keywords)
    }
  }

  render() {
    invariant(this.props.dispatch, "Required dispatch")
    return (
      <Form onCommit={this.onCommit.bind(this)}  {...this.props} entity={this.getEntity()} />
    )
  }
}

New.propTypes = {
  dispatch: PropTypes.func.isRequired
}


const mapStateToProps = (state, ownProps) => {
  return {
    keywords: state.keywords,
    client:state.client
  }
}
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(New)

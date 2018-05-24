import actions from './actions'
import invariant from 'invariant'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from './Form'
import { connect } from 'react-redux'
import R from 'ramda'

class New extends Component {
  constructor(){
    super()
    console.log('new loading...')
  }
  onCommit(entity) {
    console.log('update entity', entity)
    var action
    if (this.getId() === 0) {
      action = actions.create(entity,this.props.client)
    } else {
      action = actions.update(entity,this.props.client)
    }
    this.props.dispatch(action)
    this.props.history.push('/keyword')
  }

 
  getId() {
    var id = this.props.match.params.id;
    if (id === 'new') return 0
    return parseInt(id,10)
  }

  getEntity() {
    var id = this.getId()
    if (id === 0) {
      return { id: 0, name: ''}
    } else {
      return R.find(R.propEq('id', id))(this.props.keywords)
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
    //client:state.client
  }
}
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(New)

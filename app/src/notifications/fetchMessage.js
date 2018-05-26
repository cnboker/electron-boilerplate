import React from 'react'
import PropTypes from 'prop-types'
import Messages from './messages'
import Errors from './errors'
import If from '../lib/If'

const FetchMessage = (props) => {
  const {requestState,onSuccess} = props
    
    
  const {
    requesting,
    successful,
    messages,
    errors
  } = requestState

  
  return (
    <div className="auth-messages">  
     
      <If test={!requesting && !!errors.length}>
        <Errors message="请求错误:" errors={errors} />
      </If>
      <If test={requesting && !!messages.length}>
        <Messages messages={messages} />
      </If>
      <If test={!requesting && successful}>
        <Messages messages={messages} />
      </If>
      {(!requesting) && successful && onSuccess &&(onSuccess())}
    
    </div>
  )
}

FetchMessage.propTypes = {
  onSuccess: PropTypes.func,
  requestState: PropTypes.shape({
    requesting: PropTypes.bool,
    successfull: PropTypes.bool,
    messages: PropTypes.array,
    errors: PropTypes.array
  }),
}


export default FetchMessage
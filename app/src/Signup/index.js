// the actual container component itself and all of the react goodness
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field, SubmissionError } from 'redux-form'
import { connect } from 'react-redux'
import signupRequest from './actions'
import { required, renderField, email, minLength6 } from '../utils/fieldLevelValidation'
import FetchMessage from '../notifications/fetchMessage'
import { Link } from "react-router-dom";
import resources from './locals'

class Signup extends Component {

  // grab what we need from props.  The handleSubmit from ReduxForm
  // and the pieces of state from the global state.
  submit = (values) => {
    if (values.password !== values.repeatPassword) {
      throw new SubmissionError({ repeatPassword: resources.password_mismatch, _error: resources.register_failure })
    }
    //console.log(values)
    this.props.signupRequest(values)
  }
 
  //在状态或props改变后render之前执行
  componentWillUpdate(nextProps,nextState){
    console.log("signup nextProps", nextProps)
    if(!nextProps.signup.requesting && nextProps.signup.successful){
      nextProps.history.push('/')
    }
  }
  render() {
    const  {
      handleSubmit
      } = this.props
    return (
      <form onSubmit={handleSubmit(this.submit)}>
        <div className="app flex-row align-items-center" >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card mx-4">
                  <div className="card-block p-4">
                    {/*<h1>注册</h1>*/}
                    <p className="text-muted">{resources.create_account}</p>
                    <Field name="userName" type="text" labelIcon="icon-user" className="form-control" component={renderField} placeholder={'手机号'} validate={required} />
                    <Field name="email" type="text" label="@" className="form-control" component={renderField} placeholder={resources.email} validate={[required, email]} />
                    <Field name="password" type="password" labelIcon="icon-lock" className="form-control" component={renderField} placeholder={resources.password} validate={[required, minLength6]} />
                    <Field name="repeatPassword" type="password" labelIcon="icon-lock" className="form-control" component={renderField} placeholder={resources.confirm_password} validate={[required, minLength6]} />
                    <Field name="reference" type="text" labelIcon="icon-user" className="form-control" component={renderField} placeholder='推荐人' />
                    <button action="submit" className="btn btn-block btn-success">{resources.create}</button>
    
                    <div>{resources.formatString(resources.registered,<Link to="/login">{resources.login}</Link>)}</div>
                    <FetchMessage requestState={this.props.signup} ></FetchMessage>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }

}

Signup.propTypes = {
  handleSubmit: PropTypes.func,
  signupRequest: PropTypes.func,
  signup: PropTypes.shape({
    requesting: PropTypes.bool,
    successfull: PropTypes.bool,
    messages: PropTypes.array,
    errors: PropTypes.array
  }),
}


//Grab only the peice of state we need
// state.signup name came from when we combined our reducers
const mapStateToProps = state => ({
  signup: state.signup
})

const connected = connect(mapStateToProps, { signupRequest })(Signup)

const formed = reduxForm({
  form: 'signup'
})(connected)

export default formed
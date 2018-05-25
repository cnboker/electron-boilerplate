import R from 'ramda'
import React, { Component } from 'react'
import { required } from '../../utils/fieldLevelValidation'
import { renderField } from '../Components/Forms/RenderField'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { RowContainer } from '../Components/Forms/RowContainer'
import { Switch } from '../Components/Forms/Switch'

class Form extends Component {
  constructor(props) {
    super(props)
    console.log('form load...')
    this.state = {
      
    }
  }

  submit(values) {
    var entity = R.mergeAll([this.props.entity, values, this.state])
    entity.user = 'scott';
    console.log('keywords.form.submit', entity)
    this.props.onCommit(entity)
  }

  componentDidMount() {
    this.props.initialize(this.props.entity)
  }

  render() {
    const { handleSubmit } = this.props

    return (
      <form onSubmit={handleSubmit(this.submit.bind(this))}>
        <Field name="engine" type="text" label="搜索引擎" component={renderField} validate={required} />
        <Field name="keyword" type="text" label="关键字" component={renderField} validate={required} />
        <Field name="link" type="text" label="匹配链接" component={renderField} validate={required} />
        <Field name="manualPage" type="text" label="排名页数" component={renderField} />
        <button action="submit" className="btn btn-block btn-success">更新</button>
      </form>
    )
  }
}

Form.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onCommit: PropTypes.func.isRequired,
}

Form = reduxForm({
  form: 'form'
}
)(Form)


export default Form
import React from 'react'
import Form from 'react-jsonschema-form'
import {userUpdate} from '../../../Profile/action'

const schema = {
  title: "个人设置",
  type: "object",
  require: ["nickname"],
  properties: {
    nickname: {
      type: "string",
      title: "昵称"
    }
  }
}

const log = type => console
  .log
  .bind(console, type)

export default class UserInfoSettings extends React.Component {
  onSubmit({formData}){
    const {userName} = this.props.client;
    this.props.dispatch(
      userUpdate(userName,{...formData})
    );
  }

  render() {
    return (
      <React.Fragment>
        <Form
          schema={schema}
          showErrorList={false}
          onSubmit={this
          .onSubmit
          .bind(this)}
          onError={log('errors')}/>
      </React.Fragment>
    )
  }
}


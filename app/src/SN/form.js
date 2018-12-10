import React, {Component} from "react";
import {required} from "../utils/fieldLevelValidation";
import {renderField} from "../Components/Forms/RenderField";
import {reduxForm, Field} from "redux-form";
import axios from "axios";
import {toast} from "react-toastify";
import {connect} from "react-redux";
import actions from './actions'
class Form extends Component {
  constructor(){
    super()
    this.state = {
      sns:''
    }
    this.submitStart = false;
  }
  submit(values) {
    var self = this;
    var action = actions.create(values,this.props.client)
    this.props.dispatch(action)
    .then((response)=>{
     
      var sns = response.data.map(e=>{
        return e.sn;
      })
      self.setState({
        sns:sns.join('\n')
      })
      self.submitStart = true;
      //this.props.history.push('/sn')
    }).catch((e)=>{
      toast.error(e, {
        position: toast.POSITION.BOTTOM_CENTER
      });
    })
  }

  getId() {
    return this.props.match.params.id;
   }

  componentDidMount() {
    var id = this.getId();
    if(!id)return;
    var action = actions.agent(id,this.props.client)
    var self = this;
    action
    .then(response=>{
      self
      .props
      .initialize(response.data);
    })
  }

  render() {
    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit(this.submit.bind(this))}>
        <Field
          name="userName"
          type="text"
          label="代理商姓名"
          component={renderField}
          validate={required}
          placeholder="代理商姓名"/>
        <Field
          name="mobile"
          type="text"
          label="手机号"
          component={renderField}
          validate={required}
          placeholder="手机号"/>
        <Field
          name="address"
          type="text"
          label="地址"
          component={renderField}
          placeholder="地址"/>
        <Field
          name="remark"
          type="text"
          label="备注"
          component={renderField}
          placeholder="备注"/>
        <Field
          name="snCount"
          type="number"
          parse={value => Number(value)}
          label="充值码个数"
          component={renderField}
          validate={required}
          placeholder="0"/>
        <Field
          name="agentPrice"
          type="number"
          parse={value => Number(value)}
          label="充值码单价"
          component={renderField}
          validate={required}
          placeholder="代理商价格"/>
        <button
          action="submit"
          className="btn btn-block btn-success"
          disabled={this.submitStart}>
          提交
        </button>
        <hr/>
        <div className="form-group row">
        <label className="col-md-3 form-control-label" htmlFor="sns">充值码</label>
        <div className="col-md-9">
          <textarea id="sns" name="sns" rows="9" className="form-control" placeholder="生成的充值码列表" disabled value={this.state.sns}></textarea>
        </div>
      </div>
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {client: state.client};
};

//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(reduxForm({form: "form"})(Form));

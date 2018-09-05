import R from "ramda";
import React, { Component } from "react";
import { required } from "../utils/fieldLevelValidation";
import { renderField } from "../Components/Forms/RenderField";
import PropTypes from "prop-types";
import { reduxForm, Field } from "redux-form";
import RadioGroup from '../Components/RadioGroup/radioGroup'
class Setting extends Component {
  constructor(props) {
    super(props);
    console.log("form load...");
    this.state = {};
  }

  submit(values) {
    var entity = R.mergeAll([this.props.entity, values, this.state]);
    this.props.onCommit(entity);
  }

  componentDidMount() {
    //this.props.initialize(this.props.entity);
  }

  render() {
    const { handleSubmit } = this.props;

    return (
     
        <form onSubmit={handleSubmit(this.submit.bind(this))}>
          <RadioGroup dataSource={[{key:'baidu',value:'baidu'},{key:'google',value:'goole'}]} name="engine"/>
          {/*<Field name="everyDayMaxPolishedCount" type="text" label="单日最大擦亮次数" component={renderField} validate={required} /> */}
          <button action="submit" className="btn btn-block btn-success">
            更新
          </button>
        </form>
   
    );
  }
}


Setting = reduxForm({
  form: "form"
})(Setting);

export default Setting;

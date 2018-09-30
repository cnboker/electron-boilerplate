import R from "ramda";
import React, { Component } from "react";
import { required } from "../utils/fieldLevelValidation";
import { renderField } from "../Components/Forms/RenderField";
import { RowContainer } from "../Components/Forms/RowContainer";
import PropTypes from "prop-types";
import { reduxForm, Field } from "redux-form";
import TextareaAutosize from "react-autosize-textarea";
import {extractRootDomain} from '../utils/string'

class Form extends Component {
  constructor(props) {
    super(props);
    console.log("form load...");
    this.state = {};
  }

  submit(values) {
    var keyword = this.textarea.value;
    var entity = R.mergeAll([
      this.props.entity,
      values,
      this.state,
      { keyword }
    ]);
    entity.link = extractRootDomain(entity.link).substring(0,20)
    console.log(entity);
    this.props.onCommit(entity);
  }

  componentDidMount() {
    this.props.initialize(this.props.entity);
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.submit.bind(this))}>
        <div className="alert alert-danger center-block">
          禁止添加黄赌毒诈骗等国家明令禁止的非法关键词，一经发现关停账号处理.
        </div>
        <Field
          name="link"
          type="text"
          label="网站域名"
          component={renderField}
          validate={required}
          placeholder="输入需要提升排名的网站域名,不加http://"
        />
        <RowContainer label="关键字">
          <TextareaAutosize
            rows={1}
            placeholder="输入需要优化的关键字,回车可以批量添加多个关键字"
            className="form-control"
            innerRef={ref => (this.textarea = ref)}
          />
        </RowContainer>

        {/*<Field name="everyDayMaxPolishedCount" type="text" label="单日最大擦亮次数" component={renderField} validate={required} /> */}
        <button action="submit" className="btn btn-block btn-success">
          提交
        </button>
      </form>
    );
  }
}

Form.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onCommit: PropTypes.func.isRequired
};

Form = reduxForm({
  form: "form"
})(Form);

export default Form;

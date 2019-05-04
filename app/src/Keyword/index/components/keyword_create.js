import R from "ramda";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {reduxForm, Field} from "redux-form";
import TextareaAutosize from "react-autosize-textarea";

import {required} from "~/src/utils/fieldLevelValidation";
import {renderField} from "~/src/Components/Forms/RenderField";
import {RowContainer} from "~/src/Components/Forms/RowContainer";
import {extractRootDomain} from '~/src/utils/string'

var lastKeyword = '';
class KeywordCreate extends Component {
  constructor(props) {
    super(props);
    console.log("form load...");
    this.state = {};
  }

  submit(values) {
    var keyword = this.textarea.value;

    var entity = R.mergeAll([this.props.entity, values, this.state, {
        keyword
      }]);
    entity.link = extractRootDomain(entity.link).substring(0, 20)
    lastKeyword = entity.link;
    console.log(entity);
    this
      .props
      .createKeyword(entity);
  }

  componentDidMount() {
    console.log('link state', this.props.location.state)
    //route transfer data to state ref keywordExtender.js
    
    this
      .props
      .initialize(this.props.entity);
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousProps.keywords !== this.props.keywords) {
      this
        .props
        .history
        .push('/keyword')
    }
  }

  render() {
    const {handleSubmit} = this.props;
    const {newKeywords} = this.props.location.state || ""

    return (
      <form onSubmit={handleSubmit(this.submit.bind(this))}  >
        <div className="alert alert-danger center-block">
          禁止添加黄赌毒诈骗等国家明令禁止的非法关键词，一经发现关停账号处理.
          <br/>
          免费版用户默认可提交关键词数量为5个，随着使用时间增长，系统自动增加可提交关键词数量。用户也可以通过升级VIP，马上就能提交更多关键词.
        </div>
        <Field
          name="link"
          type="text"
          label="网站域名/熊掌号"
          component={renderField}
          validate={required}
          placeholder="如已开通熊掌号，请输入熊掌号。否则，输入目标网站域名，不加http://"/>
        <RowContainer label="关键词">
          <TextareaAutosize
            rows={1}
            placeholder="输入要优化的关键词。批量添加关键词，请敲回车键，每个关键词单独一行"
            className="form-control"
            defaultValue={newKeywords}
            innerRef={ref => (this.textarea = ref)}/>
        </RowContainer>

        {/*<Field name="everyDayMaxPolishedCount" type="text" label="单日最大擦亮次数" component={renderField} validate={required} /> */}
        <button action="submit" className="btn btn-block btn-success">
          提交
        </button>
      </form>
    );
  }
}

KeywordCreate.propTypes = {
  dispatch: PropTypes.func.isRequired,
  createKeyword: PropTypes.func.isRequired
};

KeywordCreate = reduxForm({
  form: "form",
  initialValues:{link:lastKeyword},
  enableReinitialize: true
})(KeywordCreate);

export default KeywordCreate;

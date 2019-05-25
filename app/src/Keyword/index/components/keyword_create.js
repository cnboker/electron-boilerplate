import R from "ramda";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxForm, Field } from "redux-form";
import TextareaAutosize from "react-autosize-textarea";

import { required } from "~/src/utils/fieldLevelValidation";
import { renderField } from "~/src/Components/Forms/RenderField";
import { RowContainer } from "~/src/Components/Forms/RowContainer";
import { extractRootDomain } from "~/src/utils/string";
import Select from "react-select";
import { connect } from "react-redux";
import TagButton from "./tagButton";

var lastKeyword = "";
class KeywordCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: []
    };
  }

  submit(values) {
    var keyword = this.textarea.value;

    var entity = R.mergeAll([
      this.props.entity,
      values,
      this.state,
      {
        keyword,
        tags: this.state.tags
      }
    ]);
    entity.link = extractRootDomain(entity.link).substring(0, 20);
    lastKeyword = entity.link;
    console.log(entity);
    this.props.createKeyword(entity);
  }

  componentDidMount() {
    console.log("link state", this.props.location.state);
    //route transfer data to state ref keywordExtender.js

    this.props.initialize(this.props.entity);
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousProps.keywords !== this.props.keywords) {
      this.props.history.push("/keyword");
    }
  }

  onSelect(options) {
    this.setState({
      tags: options.map(x => x.value)
    });
  }

  render() {
    const { handleSubmit } = this.props;
    const { newKeywords } = this.props.location.state || "";

    return (
      <form onSubmit={handleSubmit(this.submit.bind(this))}>
        <div className="alert alert-danger center-block">
          禁止添加黄赌毒诈骗等国家明令禁止的非法关键词，一经发现关停账号处理。
          <br />
          免费版用户默认只优化关键词数量为5个。你也可以通过升级VIP，马上就能优化更多关键词。
        </div>
        <Field
          name="link"
          type="text"
          label="网站域名/熊掌号"
          component={renderField}
          validate={required}
          placeholder="如已开通熊掌号，请输入熊掌号。否则，输入目标网站域名，不加http://"
        />
        <RowContainer label="关键词">
          <TextareaAutosize
            rows={1}
            placeholder="输入要优化的关键词。批量添加关键词，请敲回车键，每个关键词单独一行"
            className="form-control"
            defaultValue={newKeywords}
            innerRef={ref => (this.textarea = ref)}
          />
        </RowContainer>
        <RowContainer label="标签">
          <div className="row">
            <div className="col">
              {" "}
              <Select
                placeholder="标签"
                width="240px"
                onChange={this.onSelect.bind(this)}
                options={this.props.tags.map(x => {
                  return { label: x, value: x };
                })}
                isMulti
              />
            </div>
            <div className="col">
              <TagButton
                create={true}
                keywords={this.props.keywords}
                name="添加标签"
              />
            </div>
          </div>
        </RowContainer>

        <button action="submit" className="btn btn-block btn-success">
          提交
        </button>
      </form>
    );
  }
}

KeywordCreate.PropTypes = {
  dispatch: PropTypes.func.isRequired,
  createKeyword: PropTypes.func.isRequired
};

KeywordCreate = reduxForm({
  form: "form",
  initialValues: {
    link: lastKeyword
  },
  enableReinitialize: true
})(KeywordCreate);

const mapStateToProps = (state, ownProps) => {
  return {
    tags: state.tagReducer["keyword"],
    keywords: state.keywords
  };
};

export default connect(mapStateToProps)(KeywordCreate);

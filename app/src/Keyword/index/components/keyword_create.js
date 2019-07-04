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
import AutoSuggestBox from '~/src/Components/Forms/AutoSuggestBox'

class KeywordCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      link:'',
      error:''
    };
  }

  submit(values) {
    var keyword = this.textarea.value;
    let {tags, link} = this.state;
    link = extractRootDomain(link).substring(0, 20);
    if(link === ''){
      this.setState({error:'网站域名/熊掌ID名称不能为空'});
      return;
    }else{
      this.setState({error:''});
    }
    if(keyword === ''){
      this.setState({error:'网站域名/熊掌ID名称不能为空'});
      return;
    }else{
      this.setState({error:''});
    }
    var entity = R.mergeAll([
      this.props.entity,
      values,
      {keyword,link,tags}
    ]);
    console.log(entity);
    this.props.createKeyword(entity);
  }

  componentDidMount() {
    console.log("link state", this.props.location.state);
    //route transfer data to state ref keywordExtender.js

    this.props.initialize(this.props.entity);
  }

  componentDidUpdate(previousProps, previousState) {
    if (Object.keys(previousProps.keywords).length < Object.keys(this.props.keywords).length) {
      this.props.history.push("/keyword");
    }
  }

  onSelect(options) {
    this.setState({
      tags: options.map(x => x.value)
    });
  }

  onSuggestionsFetchRequested(value){
    this.setState({link:value})
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
       
        <RowContainer label="网站域名/熊掌ID名称">
          <AutoSuggestBox suggestions={this.props.websites.map(x=>x._id)} 
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)} 
          placeholder="如果网站已绑定熊掌ID，请在此输入熊掌ID名称。否则，输入网站域名，不加http://"
          required
          />
           {this.state.error && <span className="help-block ">{this.state.error}</span>}
        </RowContainer>

        <RowContainer label="关键词">
          <TextareaAutosize
            rows={1}
            placeholder="输入要优化的关键词。批量添加关键词，请敲回车键，每个关键词单独一行"
            className="form-control"
            defaultValue={newKeywords}
            innerRef={ref => (this.textarea = ref)} required
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
  },
  enableReinitialize: true
})(KeywordCreate);

const mapStateToProps = (state, ownProps) => {
  return {
    tags: state.tagReducer["keyword"],
    keywords: state.keywords,
    websites: state.websites, 
  };
};

export default connect(mapStateToProps)(KeywordCreate);
